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
 * Cell-based ordered Bayer color dither.
 *
 * Downsamples the source into a cell grid (size = cellSize × cellSize),
 * averages each cell's color, applies a 4x4 Bayer threshold to decide
 * which cells are filled (colored / grayscale) vs empty (black), then
 * scales back up with nearest-neighbor for a clean pixel-print texture.
 *
 * At cellSize=1 the grid equals the source resolution and the
 * algorithm degrades gracefully to per-pixel Bayer dither, matching
 * the behaviour of the old applyOrderedDitherColor.
 */
export function applyOrderedColorDither(
  source: PixelBuffer,
  options: OrderedColorDitherOptions
): PixelBuffer {
  const { cellSize, threshold, invert, monochrome, coloredInactive } = options;
  const { width, height, data } = source;

  if (cellSize < 1) throw new Error("cellSize must be >= 1");

  const gridW = Math.max(1, Math.ceil(width / cellSize));
  const gridH = Math.max(1, Math.ceil(height / cellSize));

  // 4×4 Bayer threshold map (values 0..15, used as 0..255 here).
  const BAYER: number[][] = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const grid = createPixelBuffer(gridW, gridH);

  for (let gy = 0; gy < gridH; gy++) {
    const y0 = gy * cellSize;
    const y1 = Math.min(height, y0 + cellSize);
    for (let gx = 0; gx < gridW; gx++) {
      const x0 = gx * cellSize;
      const x1 = Math.min(width, x0 + cellSize);

      // Average cell RGBA.
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
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

      // Luminance (0..255) used as the threshold signal.
      const lum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

      // Bayer threshold offset for this cell position.
      const bayerVal = BAYER[gy % 4][gx % 4];
      const offset = (bayerVal / 16) * 255;

      const active = lum + offset >= threshold;
      const isActive = invert ? !active : active;

      const gridIdx = pixelIndex(grid, gx, gy);
      if (isActive) {
        if (monochrome) {
          const gray = clampByte(Math.round(lum));
          grid.data[gridIdx] = gray;
          grid.data[gridIdx + 1] = gray;
          grid.data[gridIdx + 2] = gray;
        } else {
          grid.data[gridIdx] = clampByte(Math.round(avgR));
          grid.data[gridIdx + 1] = clampByte(Math.round(avgG));
          grid.data[gridIdx + 2] = clampByte(Math.round(avgB));
        }
      } else if (coloredInactive) {
        if (monochrome) {
          const gray = clampByte(Math.round(lum));
          grid.data[gridIdx] = gray;
          grid.data[gridIdx + 1] = gray;
          grid.data[gridIdx + 2] = gray;
        } else {
          grid.data[gridIdx] = clampByte(Math.round(avgR * 0.35));
          grid.data[gridIdx + 1] = clampByte(Math.round(avgG * 0.35));
          grid.data[gridIdx + 2] = clampByte(Math.round(avgB * 0.35));
        }
      } else {
        grid.data[gridIdx] = 0;
        grid.data[gridIdx + 1] = 0;
        grid.data[gridIdx + 2] = 0;
      }
      grid.data[gridIdx + 3] = 255;
    }
  }

  return resizeNearestNeighbor(grid, width, height);
}
