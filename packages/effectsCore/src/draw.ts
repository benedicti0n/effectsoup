import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, pixelIndex } from "./buffer.js";

/**
 * Draw a filled circle into a buffer with simple opacity blending.
 */
export function drawCircle(
  buffer: PixelBuffer,
  cx: number,
  cy: number,
  radius: number,
  color: RgbaColor,
  opacity: number = 1
): void {
  if (opacity <= 0 || radius <= 0) return;
  const { width, height, data } = buffer;
  const r2 = radius * radius;
  const startY = Math.max(0, Math.floor(cy - radius));
  const endY = Math.min(height - 1, Math.ceil(cy + radius));
  const startX = Math.max(0, Math.floor(cx - radius));
  const endX = Math.min(width - 1, Math.ceil(cx + radius));
  const a = Math.min(1, opacity);
  const inv = 1 - a;

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        const idx = pixelIndex(buffer, x, y);
        data[idx] = clampByte(data[idx] * inv + color[0] * a);
        data[idx + 1] = clampByte(data[idx + 1] * inv + color[1] * a);
        data[idx + 2] = clampByte(data[idx + 2] * inv + color[2] * a);
      }
    }
  }
}

/**
 * Draw a line between two points using Bresenham's algorithm with opacity
 * blending. Pixels are clipped to the buffer bounds.
 */
export function drawLine(
  buffer: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: RgbaColor,
  opacity: number = 1
): void {
  if (opacity <= 0) return;
  const { width, height, data } = buffer;
  const a = Math.min(1, opacity);
  const inv = 1 - a;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let x = x0;
  let y = y0;
  while (true) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = pixelIndex(buffer, x, y);
      data[idx] = clampByte(data[idx] * inv + color[0] * a);
      data[idx + 1] = clampByte(data[idx + 1] * inv + color[1] * a);
      data[idx + 2] = clampByte(data[idx + 2] * inv + color[2] * a);
    }

    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}
