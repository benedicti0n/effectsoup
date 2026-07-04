import type { PixelBuffer } from "./types.js";
import { clampByte } from "./buffer.js";

/**
 * Simple deterministic linear congruential generator for seeded noise.
 * Hashes the input seed so different integer, fractional, NaN, ±Infinity
 * and zero-coercing values produce different streams.
 */
export function createSeededRandom(seed: number): () => number {
  let h = 2166136261 >>> 0;
  const bytes = new Float64Array([seed]);
  const u32 = new Uint32Array(bytes.buffer);
  for (let i = 0; i < u32.length; i++) {
    h ^= u32[i];
    h = Math.imul(h, 16777619) >>> 0;
  }
  if (h === 0) h = 0x9e3779b9;
  let state = h;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * Apply monochrome noise in-place.
 * amount: 0 to 1
 */
export function applyNoise(
  buffer: PixelBuffer,
  amount: number,
  seed: number = 42
): void {
  if (amount < 0 || amount > 1) {
    throw new Error("amount must be between 0 and 1");
  }
  const { data } = buffer;
  const random = createSeededRandom(seed);
  for (let i = 0; i < data.length; i += 4) {
    const noise = (random() - 0.5) * 255 * amount;
    for (let c = 0; c < 3; c++) {
      data[i + c] = clampByte(data[i + c] + noise);
    }
  }
}

/**
 * Apply film-like grain in-place.
 * amount: 0 to 1
 */
export function applyGrain(
  buffer: PixelBuffer,
  amount: number,
  seed: number = 42
): void {
  if (amount < 0 || amount > 1) {
    throw new Error("amount must be between 0 and 1");
  }
  const { data } = buffer;
  const random = createSeededRandom(seed);
  for (let i = 0; i < data.length; i += 4) {
    const luminance =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const grain = (random() - 0.5) * 255 * amount * (1 - luminance / 510);
    for (let c = 0; c < 3; c++) {
      data[i + c] = clampByte(data[i + c] + grain);
    }
  }
}
