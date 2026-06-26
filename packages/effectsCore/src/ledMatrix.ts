import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { applyGlow } from "./glow.js";

export type LedShape = "circle" | "square";

export type LedMatrixOptions = {
  cellSize: number;
  shape?: LedShape;
  colorMode?: "source" | "white" | "tint";
  tint?: RgbaColor;
  glowAmount?: number;
  backgroundColor?: RgbaColor;
};

function averageCell(
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

function drawLed(
  buffer: PixelBuffer,
  cx: number,
  cy: number,
  radius: number,
  color: RgbaColor,
  shape: LedShape
): void {
  const { width, height, data } = buffer;
  const r2 = radius * radius;
  const startY = Math.max(0, Math.floor(cy - radius));
  const endY = Math.min(height - 1, Math.ceil(cy + radius));
  const startX = Math.max(0, Math.floor(cx - radius));
  const endX = Math.min(width - 1, Math.ceil(cx + radius));

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const inside =
        shape === "circle"
          ? dx * dx + dy * dy <= r2
          : Math.abs(dx) <= radius && Math.abs(dy) <= radius;
      if (inside) {
        const idx = pixelIndex(buffer, x, y);
        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }
  }
}

/**
 * Render the source as a grid of LED dots. Bright cells produce larger LEDs.
 * Dark areas reveal the background color, making this suitable for marquee
 * and matrix-style looks.
 */
export function applyLedMatrix(
  source: PixelBuffer,
  options: LedMatrixOptions
): PixelBuffer {
  const {
    cellSize,
    shape = "circle",
    colorMode = "source",
    tint = [255, 0, 80, 255],
    glowAmount = 0,
    backgroundColor = [0, 0, 0, 255]
  } = options;

  if (cellSize <= 0) {
    throw new Error("cellSize must be positive");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, backgroundColor);
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = col * cellSize;
      const y0 = row * cellSize;
      const avg = averageCell(source, x0, y0, cellSize, cellSize);
      const lum =
        (0.299 * avg[0] + 0.587 * avg[1] + 0.114 * avg[2]) / 255;
      const radius = (cellSize / 2) * lum;
      if (radius <= 0) continue;

      let color: RgbaColor;
      if (colorMode === "white") {
        const v = clampByte(lum * 255);
        color = [v, v, v, 255];
      } else if (colorMode === "tint") {
        color = [
          clampByte(tint[0] * lum),
          clampByte(tint[1] * lum),
          clampByte(tint[2] * lum),
          255
        ];
      } else {
        color = [
          clampByte(avg[0]),
          clampByte(avg[1]),
          clampByte(avg[2]),
          255
        ];
      }

      drawLed(
        output,
        x0 + cellSize / 2,
        y0 + cellSize / 2,
        radius,
        color,
        shape
      );
    }
  }

  if (glowAmount > 0) {
    applyGlow(output, {
      radius: Math.max(1, Math.round(cellSize * 0.5)),
      amount: glowAmount,
      mode: "screen"
    });
  }

  return output;
}
