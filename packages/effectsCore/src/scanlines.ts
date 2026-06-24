import type { PixelBuffer } from "./types.js";
import { clampByte, pixelIndex } from "./buffer.js";

/**
 * Apply horizontal scanlines to a buffer in-place.
 * strength: 0 to 1
 * lineHeight: pixels between scanlines
 */
export function applyScanlines(
  buffer: PixelBuffer,
  strength: number,
  lineHeight: number = 4
): void {
  if (strength < 0 || strength > 1) {
    throw new Error("strength must be between 0 and 1");
  }
  if (lineHeight <= 0) {
    throw new Error("lineHeight must be positive");
  }
  const { data, height, width } = buffer;
  const dim = 1 - strength;
  for (let y = 0; y < height; y++) {
    if (y % lineHeight === 0) continue;
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(buffer, x, y);
      data[idx] = clampByte(data[idx] * dim);
      data[idx + 1] = clampByte(data[idx + 1] * dim);
      data[idx + 2] = clampByte(data[idx + 2] * dim);
    }
  }
}

/**
 * Apply a horizontal RGB channel shift in-place.
 * shiftX: number of pixels to shift red (positive) and cyan (negative) channels.
 */
export function applyRgbShift(buffer: PixelBuffer, shiftX: number): void {
  if (shiftX === 0) return;
  const { data, width, height } = buffer;
  const shifted = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(buffer, x, y);

      const redSrcX = Math.max(0, Math.min(width - 1, Math.round(x - shiftX)));
      const redIdx = pixelIndex(buffer, redSrcX, y);
      shifted[idx] = data[redIdx];

      const blueSrcX = Math.max(0, Math.min(width - 1, Math.round(x + shiftX)));
      const blueIdx = pixelIndex(buffer, blueSrcX, y);
      shifted[idx + 2] = data[blueIdx];
    }
  }

  data.set(shifted);
}
