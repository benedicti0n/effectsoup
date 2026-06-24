import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { resizeBilinear } from "./resize.js";

/**
 * 5x7 bitmap font for ASCII rendering without DOM APIs.
 * Each character is an array of 7 rows, 5 bits per row.
 * The larger glyphs preserve more facial detail than the previous 3x5 font.
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
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111]
};

/**
 * Dense 10-level luminance ramp. Dark characters have more ink,
 * light characters have less, giving recognizability at small cell sizes.
 */
const DEFAULT_CHARSET = " .:-=+*#%@";

export type AsciiColorMode = "monochrome" | "color" | "source";

export type AsciiOptions = {
  fontSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  charset?: string;
  colorMode?: AsciiColorMode;
  spacing?: number;
  backgroundBlur?: number;
};

function averageCellColor(
  source: PixelBuffer,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number
): RgbaColor {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  let count = 0;
  const maxX = Math.min(source.width, cellX + cellW);
  const maxY = Math.min(source.height, cellY + cellH);
  for (let y = cellY; y < maxY; y++) {
    for (let x = cellX; x < maxX; x++) {
      const idx = pixelIndex(source, x, y);
      r += source.data[idx];
      g += source.data[idx + 1];
      b += source.data[idx + 2];
      a += source.data[idx + 3];
      count++;
    }
  }
  if (count === 0) return [0, 0, 0, 255];
  return [r / count, g / count, b / count, a / count];
}

/**
 * Render ASCII art from a source buffer.
 * Returns a new PixelBuffer at the source dimensions.
 *
 * Improvements over the previous implementation:
 * - 5x7 bitmap font preserves fine detail.
 * - Cell height is matched to the glyph aspect ratio (7:5) so glyphs
 *   are not stretched.
 * - Color mode samples the local cell color.
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
    spacing = 0,
    colorMode = "monochrome"
  } = options;

  if (fontSize <= 0) {
    throw new Error("fontSize must be positive");
  }
  if (charset.length === 0) {
    throw new Error("charset must not be empty");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, backgroundColor);

  // Glyph dimensions are 5x7. Keep cell aspect ratio close to glyph ratio
  // so characters are not stretched. fontSize maps to glyph width.
  const cellWidth = fontSize;
  const cellHeight = Math.max(1, Math.round((fontSize * 7) / 5));
  const cols = Math.max(1, Math.floor(width / cellWidth));
  const rows = Math.max(1, Math.floor(height / cellHeight));

  // Downsample source to cell grid for fast luminance sampling.
  const smallWidth = cols;
  const smallHeight = rows;
  const small = resizeBilinear(source, smallWidth, smallHeight);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const idx = (gy * smallWidth + gx) * 4;
      const luminance =
        (0.299 * small.data[idx] +
          0.587 * small.data[idx + 1] +
          0.114 * small.data[idx + 2]) /
        255;
      const charIndex = Math.max(
        0,
        Math.min(charset.length - 1, Math.floor(luminance * (charset.length - 1)))
      );
      const char = charset[charIndex];
      const bitmap = BITMAP_FONT[char] ?? BITMAP_FONT[" "];

      const cellX = Math.floor(gx * cellWidth);
      const cellY = Math.floor(gy * cellHeight);
      const pixelW = Math.max(1, Math.floor(cellWidth / 5));
      const pixelH = Math.max(1, Math.floor(cellHeight / 7));

      let glyphColor = inkColor;
      if (colorMode === "source" || colorMode === "color") {
        const avg = averageCellColor(source, cellX, cellY, cellWidth, cellHeight);
        if (colorMode === "source") {
          glyphColor = avg;
        } else {
          // Color mode: mix the local color with the ink color so glyphs
          // remain readable while showing hue variation.
          const mix = 0.7;
          glyphColor = [
            clampByte(inkColor[0] * (1 - mix) + avg[0] * mix),
            clampByte(inkColor[1] * (1 - mix) + avg[1] * mix),
            clampByte(inkColor[2] * (1 - mix) + avg[2] * mix),
            255
          ];
        }
      }

      for (let row = 0; row < 7; row++) {
        const rowBits = bitmap[row] ?? 0;
        for (let col = 0; col < 5; col++) {
          if ((rowBits >> (4 - col)) & 1) {
            const startX = cellX + col * pixelW + spacing;
            const startY = cellY + row * pixelH + spacing;
            const endX = Math.min(
              width,
              startX + Math.max(1, pixelW - spacing * 2)
            );
            const endY = Math.min(
              height,
              startY + Math.max(1, pixelH - spacing * 2)
            );
            for (let py = startY; py < endY; py++) {
              for (let px = startX; px < endX; px++) {
                if (px >= 0 && px < width && py >= 0 && py < height) {
                  const outIdx = pixelIndex(output, px, py);
                  output.data[outIdx] = glyphColor[0];
                  output.data[outIdx + 1] = glyphColor[1];
                  output.data[outIdx + 2] = glyphColor[2];
                  output.data[outIdx + 3] = glyphColor[3];
                }
              }
            }
          }
        }
      }
    }
  }

  return output;
}
