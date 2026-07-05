import type { PixelBuffer, RgbaColor } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";
import { createSeededRandom } from "./noise.js";

export type StippleOptions = {
  dotSize: number;
  spacing: number;
  density: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  seed?: number;
};

function cellAverageLuminance(
  source: PixelBuffer,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number
): number {
  let sum = 0;
  let count = 0;
  const maxX = Math.min(source.width, cellX + cellW);
  const maxY = Math.min(source.height, cellY + cellH);
  for (let y = cellY; y < maxY; y++) {
    for (let x = cellX; x < maxX; x++) {
      const idx = pixelIndex(source, x, y);
      sum +=
        (0.299 * source.data[idx] +
          0.587 * source.data[idx + 1] +
          0.114 * source.data[idx + 2]) /
        255;
      count++;
    }
  }
  if (count === 0) return 1;
  return sum / count;
}

function drawDot(
  buffer: PixelBuffer,
  cx: number,
  cy: number,
  radius: number,
  color: RgbaColor
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
      if (dx * dx + dy * dy <= r2) {
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
 * Render a stipple illustration: more dots are placed in darker areas.
 * Density controls the maximum number of dots per cell, and placement is
 * deterministic for a given seed.
 */
export function renderStipple(
  source: PixelBuffer,
  options: StippleOptions
): PixelBuffer {
  const {
    dotSize,
    spacing,
    density,
    inkColor,
    backgroundColor,
    seed = 42
  } = options;

  if (dotSize <= 0 || spacing <= 0) {
    throw new Error("dotSize and spacing must be positive");
  }
  if (density < 0 || density > 1) {
    throw new Error("density must be between 0 and 1");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, backgroundColor);
  const rand = createSeededRandom(seed);
  const cols = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);
  const maxDotsPerCell = Math.max(
    1,
    Math.floor((spacing / dotSize) * (spacing / dotSize))
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = col * spacing;
      const y0 = row * spacing;
      const lum = cellAverageLuminance(source, x0, y0, spacing, spacing);
      const darkness = 1 - lum;

      // Non-linear mapping so dark cells get noticeably more dots than
      // the linear `darkness` would suggest. The square of darkness
      // sharpens the gradient so the darkest areas feel much denser
      // than midtones, with midtones staying airy.
      const shaped = Math.pow(Math.max(0, darkness), 1.4);
      // At least one dot in any cell whose darkness crosses 0.45 so
      // the dark regions never look empty.
      const minDark = darkness > 0.45 ? 1 : 0;
      const dotCount = Math.max(
        minDark,
        Math.round(shaped * density * maxDotsPerCell)
      );

      for (let i = 0; i < dotCount; i++) {
        const dx = rand() * spacing;
        const dy = rand() * spacing;
        drawDot(output, x0 + dx, y0 + dy, dotSize / 2, inkColor);
      }
    }
  }

  return output;
}
