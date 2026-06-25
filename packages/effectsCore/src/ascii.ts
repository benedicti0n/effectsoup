import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { resizeBilinear } from "./resize.js";
import { applyBoxBlur } from "./blend.js";
import { applyGlow } from "./glow.js";

/**
 * 5x7 bitmap font for ASCII rendering without DOM APIs.
 * Each character is an array of 7 rows, 5 bits per row.
 */
const BITMAP_FONT: Record<string, number[]> = {
  " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  ".": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b01100],
  ":": [0b00000, 0b01100, 0b01100, 0b00000, 0b01100, 0b01100, 0b00000],
  ",": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b00100],
  ";": [0b00000, 0b01100, 0b01100, 0b00000, 0b01100, 0b00100, 0b01000],
  "!": [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
  "?": [0b11110, 0b10001, 0b00001, 0b00110, 0b00100, 0b00000, 0b00100],
  "-": [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
  "+": [0b00000, 0b00100, 0b00100, 0b11111, 0b00100, 0b00100, 0b00000],
  "=": [0b00000, 0b00000, 0b11111, 0b00000, 0b11111, 0b00000, 0b00000],
  "*": [0b00000, 0b00100, 0b10101, 0b01110, 0b10101, 0b00100, 0b00000],
  "/": [0b00001, 0b00010, 0b00010, 0b00100, 0b01000, 0b01000, 0b10000],
  "\\": [0b10000, 0b01000, 0b01000, 0b00100, 0b00010, 0b00010, 0b00001],
  "_": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b11111],
  "'": [0b00100, 0b00100, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  "\"": [0b01010, 0b01010, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  "#": [0b01010, 0b01010, 0b11111, 0b01010, 0b11111, 0b01010, 0b01010],
  "$": [0b00100, 0b01111, 0b10100, 0b01110, 0b00101, 0b11110, 0b00100],
  "%": [0b10001, 0b10010, 0b00010, 0b00100, 0b01000, 0b01001, 0b10001],
  "&": [0b01100, 0b10010, 0b10010, 0b01100, 0b10010, 0b10001, 0b01110],
  "@": [0b01110, 0b10001, 0b10111, 0b10101, 0b10111, 0b10000, 0b01110],
  "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  "2": [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  "3": [0b11111, 0b00001, 0b00010, 0b00110, 0b00001, 0b10001, 0b01110],
  "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  "6": [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10011, 0b10001, 0b10001, 0b01110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00001, 0b00001, 0b00001, 0b00001, 0b10001, 0b10001, 0b01110],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  "█": [0b11111, 0b11111, 0b11111, 0b11111, 0b11111, 0b11111, 0b11111],
  "▓": [0b10101, 0b01010, 0b10101, 0b01010, 0b10101, 0b01010, 0b10101],
  "▒": [0b10101, 0b00000, 0b01010, 0b00000, 0b10101, 0b00000, 0b01010],
  "░": [0b10001, 0b00000, 0b00100, 0b00000, 0b10001, 0b00000, 0b00100],
  "·": [0b00000, 0b00000, 0b00000, 0b00100, 0b00000, 0b00000, 0b00000],
  "•": [0b00000, 0b00000, 0b00100, 0b01110, 0b00100, 0b00000, 0b00000],
  "∞": [0b00000, 0b01010, 0b10101, 0b10101, 0b10101, 0b01010, 0b00000],
  "∑": [0b11111, 0b01000, 0b00100, 0b00100, 0b01000, 0b01000, 0b11111],
  "√": [0b00011, 0b00100, 0b00100, 0b01000, 0b01000, 0b10000, 0b10000]
};

export const ASCII_CHARSET_PRESETS: Record<string, string> = {
  dense: `$@B%8&WM#*oahkbdpqwmZ0OQLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\` . `,
  standard: "@%#*+=-:. ",
  technical: "01/\\|<>[]{}?=-_+~",
  blocks: "█▓▒░ ",
  minimal: " #.",
  bloom: " .:-=+*#%@"
};

/**
 * Validate and normalize a user-provided custom character set.
 * Requires at least two non-whitespace characters. Preserves order.
 * Falls back to the dense preset on invalid input.
 */
export function normalizeCustomCharset(input: string, fallback = ASCII_CHARSET_PRESETS.dense): string {
  const trimmed = input.replace(/\s/g, "");
  if (trimmed.length < 2) return fallback;
  const cleaned = input.replace(/^\s+|\s+$/g, "");
  if (cleaned.length < 2) return fallback;
  return cleaned;
}

/**
 * Dense 10-level luminance ramp. Dark characters have more ink,
 * light characters have less, giving recognizability at small cell sizes.
 */
const DEFAULT_CHARSET = ASCII_CHARSET_PRESETS.dense;

export type AsciiColorMode = "monochrome" | "color" | "source";
export type AsciiBackgroundMode = "solid" | "source" | "transparent";

export type AsciiOptions = {
  fontSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  charset?: string;
  colorMode?: AsciiColorMode;
  backgroundMode?: AsciiBackgroundMode;
  spacing?: number;
  backgroundBlur?: number;
  palette?: RgbaColor[];
  invertLuminance?: boolean;
  antialias?: boolean;
};

function nearestPaletteColor(color: RgbaColor, palette: RgbaColor[]): RgbaColor {
  let best = palette[0] ?? color;
  let bestDist = Infinity;
  for (const candidate of palette) {
    const dr = color[0] - candidate[0];
    const dg = color[1] - candidate[1];
    const db = color[2] - candidate[2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

function luminanceFromCell(small: PixelBuffer, gx: number, gy: number): number {
  const idx = (gy * small.width + gx) * 4;
  return (
    (0.299 * small.data[idx] +
      0.587 * small.data[idx + 1] +
      0.114 * small.data[idx + 2]) /
    255
  );
}

function colorFromCell(small: PixelBuffer, gx: number, gy: number): RgbaColor {
  const idx = (gy * small.width + gx) * 4;
  return [small.data[idx], small.data[idx + 1], small.data[idx + 2], 255];
}

function resolveGlyphBitmap(char: string): number[] {
  return (
    BITMAP_FONT[char] ??
    BITMAP_FONT[char.toUpperCase()] ??
    BITMAP_FONT[char.toLowerCase()] ??
    BITMAP_FONT[" "]
  );
}

function blendGlyphPixel(
  background: RgbaColor,
  glyphColor: RgbaColor,
  coverage: number
): RgbaColor {
  const alpha = (glyphColor[3] / 255) * coverage;
  const inv = 1 - alpha;
  return [
    clampByte(background[0] * inv + glyphColor[0] * alpha),
    clampByte(background[1] * inv + glyphColor[1] * alpha),
    clampByte(background[2] * inv + glyphColor[2] * alpha),
    clampByte(background[3] * inv + 255 * alpha)
  ];
}

/**
 * Render ASCII art from a source buffer.
 * Returns a new PixelBuffer at the source dimensions.
 *
 * Improvements:
 * - 5x7 bitmap font with supersampled antialiasing.
 * - Cell height matched to glyph aspect ratio (7:5) so glyphs are not stretched.
 * - Color mode samples the local cell color from a downsampled source.
 * - Optional solid/source/transparent background modes.
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
    colorMode = "monochrome",
    backgroundMode = "solid",
    spacing = 0,
    palette,
    invertLuminance = false,
    antialias = true
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

      let glyphColor = inkColor;
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

          const outIdx = pixelIndex(output, px, py);
          const bg: RgbaColor =
            backgroundMode === "source"
              ? [output.data[outIdx], output.data[outIdx + 1], output.data[outIdx + 2], output.data[outIdx + 3]]
              : [backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]];
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

export type SymbolGlowOptions = {
  fontSize: number;
  symbolSet: string;
  glowRadius: number;
  colorMode: "monochrome" | "colored";
  antialias?: boolean;
};

/**
 * Symbol Glow effect:
 * 1. Blur the source image for a dreamy base.
 * 2. Render a transparent symbol layer using the improved ASCII renderer.
 * 3. Add a soft glow around the symbol layer.
 * 4. Composite the glowing symbols over the blurred base.
 */
export function renderSymbolGlow(
  source: PixelBuffer,
  options: SymbolGlowOptions
): PixelBuffer {
  const { fontSize, symbolSet, glowRadius, colorMode, antialias = true } = options;

  const symbols = symbolSet.length > 0 ? symbolSet : "2*+/=e";
  const { width, height } = source;

  const blurredBase: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(source.data)
  };
  applyBoxBlur(blurredBase, Math.max(0, glowRadius));

  const symbolLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 0],
    charset: symbols,
    colorMode: colorMode === "colored" ? "source" : "monochrome",
    backgroundMode: "transparent",
    antialias
  });

  if (glowRadius > 0) {
    applyGlow(symbolLayer, {
      radius: Math.max(1, Math.round(glowRadius)),
      amount: 0.6,
      mode: "screen",
      color: [255, 255, 255, 255]
    });
  }

  const output = createPixelBuffer(width, height);
  for (let i = 0; i < output.data.length; i += 4) {
    const alpha = symbolLayer.data[i + 3] / 255;
    for (let c = 0; c < 3; c++) {
      output.data[i + c] = clampByte(
        blurredBase.data[i + c] * (1 - alpha) + symbolLayer.data[i + c] * alpha
      );
    }
    output.data[i + 3] = 255;
  }

  return output;
}
