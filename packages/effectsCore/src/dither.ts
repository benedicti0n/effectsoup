import type { PixelBuffer } from "./types.js";
import { clampByte, pixelIndex } from "./buffer.js";

/**
 * 4x4 Bayer ordered dither matrix, normalized to 0-255 range.
 */
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
].map((row) => row.map((v) => (v / 16) * 255));

/**
 * Apply ordered Bayer dither to a buffer in-place.
 * The buffer should already be grayscale for classic 1-bit dither.
 * threshold: 0 to 255, higher values produce more dark pixels.
 */
export function applyOrderedDither(
  buffer: PixelBuffer,
  threshold: number = 128
): void {
  const { data, width, height } = buffer;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(buffer, x, y);
      const bayer = BAYER_4X4[y % 4][x % 4];
      const value = data[idx] + bayer - 128;
      const output = value >= threshold ? 255 : 0;
      data[idx] = output;
      data[idx + 1] = output;
      data[idx + 2] = output;
    }
  }
}

/**
 * Apply Floyd–Steinberg error-diffusion dither to a buffer in-place.
 * threshold: 0 to 255
 */
export function applyFloydSteinbergDither(
  buffer: PixelBuffer,
  threshold: number = 128
): void {
  const { data, width, height } = buffer;
  const errors = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(buffer, x, y);
      const errorIdx = y * width + x;
      const oldValue = data[idx] + errors[errorIdx];
      const newValue = oldValue >= threshold ? 255 : 0;
      const quantError = oldValue - newValue;

      data[idx] = clampByte(newValue);
      data[idx + 1] = clampByte(newValue);
      data[idx + 2] = clampByte(newValue);

      // Distribute error to neighboring pixels.
      if (x + 1 < width) {
        errors[errorIdx + 1] += (quantError * 7) / 16;
      }
      if (y + 1 < height) {
        if (x > 0) {
          errors[errorIdx + width - 1] += (quantError * 3) / 16;
        }
        errors[errorIdx + width] += (quantError * 5) / 16;
        if (x + 1 < width) {
          errors[errorIdx + width + 1] += (quantError * 1) / 16;
        }
      }
    }
  }
}
