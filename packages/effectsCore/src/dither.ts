import type { PixelBuffer } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { resizeNearestNeighbor } from "./resize.js";

export type OrderedColorDitherOptions = {
  cellSize: number;
  threshold: number;
  invert: boolean;
  monochrome: boolean;
  /** When true, inactive cells show their averaged colour instead of black. */
  coloredInactive?: boolean;
};

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

/**
 * Apply Floyd–Steinberg error-diffusion dither to each color channel
 * independently in-place. The result preserves color information while
 * the per-channel error propagation produces a richly textured noise
 * that maintains image hue and saturation.
 *
 * threshold: 0 to 255, applied to each channel.
 * channels: optional list of channel indices (0=R, 1=G, 2=B, 3=A).
 *   Default dithers R, G, B and leaves alpha untouched.
 */
export function applyFloydSteinbergColorDither(
  buffer: PixelBuffer,
  threshold: number = 128,
  channels: readonly number[] = [0, 1, 2]
): void {
  const { data, width, height } = buffer;

  // Per-channel error buffers for the FS propagation.
  const errorBuffers = channels.map(
    () => new Float32Array(width * height)
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(buffer, x, y);
      const errorIdx = y * width + x;
      for (let c = 0; c < channels.length; c++) {
        const channel = channels[c];
        const oldValue = data[idx + channel] + errorBuffers[c][errorIdx];
        const newValue = oldValue >= threshold ? 255 : 0;
        const quantError = oldValue - newValue;
        data[idx + channel] = clampByte(newValue);

        if (x + 1 < width) {
          errorBuffers[c][errorIdx + 1] += (quantError * 7) / 16;
        }
        if (y + 1 < height) {
          if (x > 0) {
            errorBuffers[c][errorIdx + width - 1] += (quantError * 3) / 16;
          }
          errorBuffers[c][errorIdx + width] += (quantError * 5) / 16;
          if (x + 1 < width) {
            errorBuffers[c][errorIdx + width + 1] += (quantError * 1) / 16;
          }
        }
      }
    }
  }
}

/**
 * Cell-based ordered Bayer colour dither.
 *
 * Every cell renders the averaged source colour (with a modest
 * saturation boost).  The Bayer matrix drives a per‑cell luminance
 * offset that creates a structured pixel‑print texture — no fixed
 * background, no white gaps, no inactive‑cell placeholder.
 *
 * - **Threshold** controls the dither amplitude (0 = no variation,
 *   255 = maximum structured texture).
 * - **Invert** reverses the polarity of the Bayer offset.
 * - **Monochrome** renders each cell as a gray level.
 */
export function applyOrderedColorDither(
  source: PixelBuffer,
  options: OrderedColorDitherOptions
): PixelBuffer {
  const { cellSize, threshold, invert, monochrome } = options;
  const { width, height, data } = source;

  if (cellSize < 1) throw new Error("cellSize must be >= 1");

  const gridW = Math.max(1, Math.ceil(width / cellSize));
  const gridH = Math.max(1, Math.ceil(height / cellSize));

  // 4×4 Bayer threshold map (raw matrix values 0..15).
  const BAYER: number[][] = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const grid = createPixelBuffer(gridW, gridH);

  // Threshold maps linearly to dither amplitude:
  //   0   → no dither (all cells show the averaged colour)
  //   255 → maximum luminance offset (±30)
  const amplitude = threshold / 255;
  const MAX_SHIFT = 60;

  for (let gy = 0; gy < gridH; gy++) {
    const y0 = gy * cellSize;
    const y1 = Math.min(height, y0 + cellSize);
    for (let gx = 0; gx < gridW; gx++) {
      const x0 = gx * cellSize;
      const x1 = Math.min(width, x0 + cellSize);

      // Average cell RGBA.
      let r = 0, g = 0, b = 0, count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = pixelIndex(source, x, y);
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }

      const avgR = count > 0 ? r / count : 0;
      const avgG = count > 0 ? g / count : 0;
      const avgB = count > 0 ? b / count : 0;

      // Per‑cell saturation boost (preserves hue).
      const mid = (avgR + avgG + avgB) / 3;
      const boostR = avgR + (avgR - mid) * 0.25;
      const boostG = avgG + (avgG - mid) * 0.25;
      const boostB = avgB + (avgB - mid) * 0.25;

      // Bayer offset in the range -0.5 … +0.5.
      const bayerVal = BAYER[gy % 4][gx % 4];
      const bayerNorm = (bayerVal / 16) - 0.5;

      // Luminance offset that creates the visible dither texture.
      const sign = invert ? -1 : 1;
      const ditherShift = bayerNorm * MAX_SHIFT * amplitude * sign;

      const gridIdx = pixelIndex(grid, gx, gy);
      if (monochrome) {
        const lum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
        const val = clampByte(Math.round(lum + ditherShift));
        grid.data[gridIdx]     = val;
        grid.data[gridIdx + 1] = val;
        grid.data[gridIdx + 2] = val;
      } else {
        grid.data[gridIdx]     = clampByte(Math.round(boostR + ditherShift));
        grid.data[gridIdx + 1] = clampByte(Math.round(boostG + ditherShift));
        grid.data[gridIdx + 2] = clampByte(Math.round(boostB + ditherShift));
      }
      grid.data[gridIdx + 3] = 255;
    }
  }

  return resizeNearestNeighbor(grid, width, height);
}
