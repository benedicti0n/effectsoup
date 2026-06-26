import type { PixelBuffer, RgbaColor } from "../types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "../buffer.js";
import { resizeBilinear } from "../resize.js";
import { resolveGlyphBitmap, ASCII_CHARSET_PRESETS } from "./font.js";
import type { AsciiOptions, AsciiColorMode, AsciiBackgroundMode } from "./types.js";
import {
  blendGlyphPixel,
  averageCellChannel,
  luminanceFromCell,
  colorFromCell,
  nearestPaletteColor,
  ensureMinLuminance
} from "./utils.js";

const DEFAULT_CHARSET = ASCII_CHARSET_PRESETS.dense;

/**
 * Render ASCII art from a source buffer.
 * Returns a new PixelBuffer at the source dimensions.
 *
 * Improvements:
 * - 5x7 bitmap font with supersampled antialiasing.
 * - Cell height matched to glyph aspect ratio (7:5) so glyphs are not stretched.
 * - Color mode samples the local cell color from a downsampled source.
 * - Optional solid/source/transparent background modes.
 * - Optional per-cell density map for masked/sparse placement.
 */
export function renderAscii(
  source: PixelBuffer,
  options: AsciiOptions
): PixelBuffer {
  const {
    fontSize,
    inkColor,
    backgroundColor,
    charset = DEFAULT_CHARSET,
    colorMode = "monochrome" as AsciiColorMode,
    backgroundMode = "solid" as AsciiBackgroundMode,
    spacing = 0,
    palette,
    invertLuminance = false,
    antialias = true,
    densityMap,
    minGlyphLuminance = 0
  } = options;

  if (fontSize <= 0) {
    throw new Error("fontSize must be positive");
  }
  if (charset.length === 0) {
    throw new Error("charset must not be empty");
  }

  const { width, height } = source;
  const output =
    backgroundMode === "source"
      ? createPixelBuffer(width, height, [0, 0, 0, 0])
      : createPixelBuffer(width, height, backgroundColor);

  if (backgroundMode === "source") {
    output.data.set(source.data);
  }

  const cellWidth = Math.max(1, fontSize);
  const cellHeight = Math.max(1, Math.round((fontSize * 7) / 5));
  const cols = Math.max(1, Math.floor(width / cellWidth));
  const rows = Math.max(1, Math.floor(height / cellHeight));

  const small = resizeBilinear(source, cols, rows);

  const glyphW = 5;
  const glyphH = 7;
  const sampleCount = antialias ? 4 : 1;
  const sampleStep = 1 / sampleCount;

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      let luminance = luminanceFromCell(small, gx, gy);
      if (invertLuminance) {
        luminance = 1 - luminance;
      }
      const charIndex = Math.max(
        0,
        Math.min(charset.length - 1, Math.floor(luminance * (charset.length - 1)))
      );
      const char = charset[charIndex];
      const bitmap = resolveGlyphBitmap(char);

      const cellX = Math.floor(gx * cellWidth);
      const cellY = Math.floor(gy * cellHeight);
      const cellRight = Math.min(width, cellX + cellWidth);
      const cellBottom = Math.min(height, cellY + cellHeight);

      let glyphColor: RgbaColor = inkColor;
      if (colorMode === "source" || colorMode === "color") {
        let avg = colorFromCell(small, gx, gy);
        if (palette && palette.length > 0) {
          avg = nearestPaletteColor(avg, palette);
        }
        if (colorMode === "source") {
          glyphColor = avg;
        } else {
          const mix = 0.7;
          glyphColor = [
            clampByte(inkColor[0] * (1 - mix) + avg[0] * mix),
            clampByte(inkColor[1] * (1 - mix) + avg[1] * mix),
            clampByte(inkColor[2] * (1 - mix) + avg[2] * mix),
            255
          ];
        }
      }

      if (minGlyphLuminance > 0 && (colorMode === "source" || colorMode === "color")) {
        glyphColor = ensureMinLuminance(glyphColor, minGlyphLuminance);
      }

      let cellDensity = 1;
      if (densityMap) {
        cellDensity = averageCellChannel(densityMap, cellX, cellY, cellWidth, cellHeight) / 255;
        if (cellDensity <= 0) continue;
      }

      const innerX0 = cellX + spacing;
      const innerY0 = cellY + spacing;
      const innerX1 = Math.max(innerX0, cellRight - spacing);
      const innerY1 = Math.max(innerY0, cellBottom - spacing);
      if (innerX0 >= innerX1 || innerY0 >= innerY1) continue;

      const innerW = innerX1 - innerX0;
      const innerH = innerY1 - innerY0;

      for (let py = innerY0; py < innerY1; py++) {
        for (let px = innerX0; px < innerX1; px++) {
          if (px < 0 || px >= width || py < 0 || py >= height) continue;

          const u = ((px - innerX0 + 0.5) / innerW) * glyphW;
          const v = ((py - innerY0 + 0.5) / innerH) * glyphH;

          let coverage = 0;
          if (antialias) {
            for (let sy = 0; sy < sampleCount; sy++) {
              for (let sx = 0; sx < sampleCount; sx++) {
                const gu = u + (sx + 0.5) * sampleStep - 0.5;
                const gv = v + (sy + 0.5) * sampleStep - 0.5;
                const col = Math.floor(gu);
                const row = Math.floor(gv);
                if (row >= 0 && row < glyphH && col >= 0 && col < glyphW) {
                  const rowBits = bitmap[row] ?? 0;
                  if ((rowBits >> (4 - col)) & 1) {
                    coverage++;
                  }
                }
              }
            }
            coverage /= sampleCount * sampleCount;
          } else {
            const col = Math.floor(u);
            const row = Math.floor(v);
            if (row >= 0 && row < glyphH && col >= 0 && col < glyphW) {
              const rowBits = bitmap[row] ?? 0;
              coverage = (rowBits >> (4 - col)) & 1 ? 1 : 0;
            }
          }

          if (coverage <= 0) continue;
          coverage *= cellDensity;
          if (coverage <= 0) continue;

          const outIdx = pixelIndex(output, px, py);
          const bg: RgbaColor =
            backgroundMode === "source"
              ? [
                  output.data[outIdx],
                  output.data[outIdx + 1],
                  output.data[outIdx + 2],
                  output.data[outIdx + 3]
                ]
              : [
                  backgroundColor[0],
                  backgroundColor[1],
                  backgroundColor[2],
                  backgroundColor[3]
                ];
          const blended = blendGlyphPixel(bg, glyphColor, coverage);
          output.data[outIdx] = blended[0];
          output.data[outIdx + 1] = blended[1];
          output.data[outIdx + 2] = blended[2];
          output.data[outIdx + 3] = blended[3];
        }
      }
    }
  }

  return output;
}
