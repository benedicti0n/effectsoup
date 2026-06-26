import type { PixelBuffer } from "./types.js";
import { clonePixelBuffer } from "./buffer.js";
import { applyNoise, createSeededRandom } from "./noise.js";
import { applyRgbShift, applyScanlines } from "./scanlines.js";

export type CrtGlitchOptions = {
  sliceHeight: number;
  shiftAmount: number;
  rgbShift: number;
  scanlineStrength: number;
  noiseAmount: number;
  seed?: number;
};

function shiftRowSlice(
  buffer: PixelBuffer,
  yStart: number,
  sliceHeight: number,
  offset: number
): void {
  if (offset === 0) return;
  const { width, height, data } = buffer;
  const yEnd = Math.min(height, yStart + sliceHeight);
  const rowBytes = width * 4;
  const temp = new Uint8ClampedArray(rowBytes);

  for (let y = yStart; y < yEnd; y++) {
    const rowStart = y * width * 4;
    temp.set(data.subarray(rowStart, rowStart + rowBytes));

    for (let x = 0; x < width; x++) {
      const srcX = ((x - offset) % width + width) % width;
      const dstIdx = rowStart + x * 4;
      data[dstIdx] = temp[srcX * 4];
      data[dstIdx + 1] = temp[srcX * 4 + 1];
      data[dstIdx + 2] = temp[srcX * 4 + 2];
      data[dstIdx + 3] = temp[srcX * 4 + 3];
    }
  }
}

/**
 * CRT-style glitch with sliced horizontal shifts, RGB channel separation,
 * scanlines, and analog noise.
 */
export function applyCrtGlitch(
  source: PixelBuffer,
  options: CrtGlitchOptions
): PixelBuffer {
  const {
    sliceHeight = 4,
    shiftAmount = 8,
    rgbShift = 2,
    scanlineStrength = 0.3,
    noiseAmount = 0.05,
    seed = 42
  } = options;

  if (sliceHeight <= 0) {
    throw new Error("sliceHeight must be positive");
  }

  const output = clonePixelBuffer(source);
  const rand = createSeededRandom(seed);

  for (let y = 0; y < output.height; y += sliceHeight) {
    const offset = Math.round((rand() - 0.5) * 2 * shiftAmount);
    shiftRowSlice(output, y, sliceHeight, offset);
  }

  if (rgbShift > 0) {
    applyRgbShift(output, rgbShift);
  }
  if (scanlineStrength > 0) {
    applyScanlines(output, scanlineStrength, sliceHeight);
  }
  if (noiseAmount > 0) {
    applyNoise(output, noiseAmount, seed + 1);
  }

  return output;
}
