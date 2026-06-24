import type { PixelBuffer, RgbaColor } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";
import { resizeBilinear } from "./resize.js";

/**
 * Simple 3x5 bitmap font for ASCII rendering without DOM APIs.
 * Each character is an array of 5 rows, 3 bits per row.
 */
const BITMAP_FONT: Record<string, number[]> = {
  " ": [0b000, 0b000, 0b000, 0b000, 0b000],
  ".": [0b000, 0b000, 0b000, 0b000, 0b010],
  ":": [0b000, 0b010, 0b000, 0b010, 0b000],
  "-": [0b000, 0b000, 0b111, 0b000, 0b000],
  "+": [0b000, 0b010, 0b111, 0b010, 0b000],
  "=": [0b000, 0b111, 0b000, 0b111, 0b000],
  "!": [0b010, 0b010, 0b010, 0b000, 0b010],
  "?": [0b111, 0b001, 0b010, 0b000, 0b010],
  "@": [0b111, 0b101, 0b111, 0b100, 0b111],
  "#": [0b101, 0b111, 0b101, 0b111, 0b101],
  "$": [0b011, 0b101, 0b010, 0b101, 0b110],
  "%": [0b101, 0b001, 0b010, 0b100, 0b101],
  "&": [0b010, 0b101, 0b010, 0b101, 0b110],
  "*": [0b000, 0b101, 0b010, 0b101, 0b000],
  "/": [0b001, 0b001, 0b010, 0b100, 0b100],
  "\\": [0b100, 0b100, 0b010, 0b001, 0b001],
  "_": [0b000, 0b000, 0b000, 0b000, 0b111],
  "0": [0b111, 0b101, 0b101, 0b101, 0b111],
  "1": [0b010, 0b110, 0b010, 0b010, 0b111],
  "2": [0b111, 0b001, 0b111, 0b100, 0b111],
  "3": [0b111, 0b001, 0b111, 0b001, 0b111],
  "4": [0b101, 0b101, 0b111, 0b001, 0b001],
  "5": [0b111, 0b100, 0b111, 0b001, 0b111],
  "6": [0b111, 0b100, 0b111, 0b101, 0b111],
  "7": [0b111, 0b001, 0b001, 0b010, 0b010],
  "8": [0b111, 0b101, 0b111, 0b101, 0b111],
  "9": [0b111, 0b101, 0b111, 0b001, 0b111],
  A: [0b111, 0b101, 0b111, 0b101, 0b101],
  B: [0b110, 0b101, 0b110, 0b101, 0b110],
  C: [0b011, 0b100, 0b100, 0b100, 0b011],
  D: [0b110, 0b101, 0b101, 0b101, 0b110],
  E: [0b111, 0b100, 0b111, 0b100, 0b111],
  F: [0b111, 0b100, 0b110, 0b100, 0b100],
  G: [0b011, 0b100, 0b101, 0b101, 0b011],
  H: [0b101, 0b101, 0b111, 0b101, 0b101],
  I: [0b111, 0b010, 0b010, 0b010, 0b111],
  J: [0b001, 0b001, 0b001, 0b101, 0b010],
  K: [0b101, 0b101, 0b110, 0b101, 0b101],
  L: [0b100, 0b100, 0b100, 0b100, 0b111],
  M: [0b101, 0b111, 0b101, 0b101, 0b101],
  N: [0b111, 0b101, 0b101, 0b101, 0b101],
  O: [0b010, 0b101, 0b101, 0b101, 0b010],
  P: [0b110, 0b101, 0b110, 0b100, 0b100],
  Q: [0b010, 0b101, 0b101, 0b110, 0b011],
  R: [0b110, 0b101, 0b110, 0b101, 0b101],
  S: [0b011, 0b100, 0b010, 0b001, 0b110],
  T: [0b111, 0b010, 0b010, 0b010, 0b010],
  U: [0b101, 0b101, 0b101, 0b101, 0b111],
  V: [0b101, 0b101, 0b101, 0b101, 0b010],
  W: [0b101, 0b101, 0b101, 0b111, 0b101],
  X: [0b101, 0b101, 0b010, 0b101, 0b101],
  Y: [0b101, 0b101, 0b010, 0b010, 0b010],
  Z: [0b111, 0b001, 0b010, 0b100, 0b111]
};

const DEFAULT_CHARSET =
  " .:-=+*#%@";

export type AsciiOptions = {
  fontSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  charset?: string;
  colorMode?: "monochrome" | "color";
  spacing?: number;
  backgroundBlur?: number;
};

/**
 * Render ASCII art from a source buffer.
 * Returns a new PixelBuffer at the source dimensions.
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
    backgroundBlur = 0
  } = options;

  if (fontSize <= 0) {
    throw new Error("fontSize must be positive");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, backgroundColor);

  // Optional background blur.
  if (backgroundBlur > 0) {
    // Blur is not implemented in this primitive; leave background solid.
  }

  const cols = Math.max(1, Math.floor(width / fontSize));
  const rows = Math.max(1, Math.floor(height / (fontSize * 2)));
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  // Downsample source to cell grid for luminance/color sampling.
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
      const pixelW = Math.max(1, Math.floor(cellWidth / 3));
      const pixelH = Math.max(1, Math.floor(cellHeight / 5));

      for (let row = 0; row < 5; row++) {
        const rowBits = bitmap[row] ?? 0;
        for (let col = 0; col < 3; col++) {
          if ((rowBits >> (2 - col)) & 1) {
            const startX = cellX + col * pixelW + spacing;
            const startY = cellY + row * pixelH + spacing;
            for (let dy = 0; dy < pixelH - spacing * 2; dy++) {
              for (let dx = 0; dx < pixelW - spacing * 2; dx++) {
                const px = startX + dx;
                const py = startY + dy;
                if (px >= 0 && px < width && py >= 0 && py < height) {
                  const outIdx = pixelIndex(output, px, py);
                  output.data[outIdx] = inkColor[0];
                  output.data[outIdx + 1] = inkColor[1];
                  output.data[outIdx + 2] = inkColor[2];
                  output.data[outIdx + 3] = inkColor[3];
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
