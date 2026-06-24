import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, clonePixelBuffer, createPixelBuffer, pixelIndex } from "./buffer.js";
import { applyBoxBlur, blendPixelBuffers } from "./blend.js";

export type GlowOptions = {
  radius: number;
  amount: number;
  mode?: "screen" | "add" | "soft";
  color?: RgbaColor;
};

/**
 * Apply a diffuse glow/bloom to a buffer.
 * `amount` controls the blend strength (0 to 1).
 */
export function applyGlow(buffer: PixelBuffer, options: GlowOptions): void {
  const { radius, amount, mode = "screen", color } = options;
  if (amount <= 0 || radius <= 0) return;

  const glow = clonePixelBuffer(buffer);
  applyBoxBlur(glow, radius);

  if (color) {
    // Tint the glow buffer toward a target color.
    const { data } = glow;
    const inv = 0.6;
    const mix = 0.4;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = clampByte(data[i] * inv + color[0] * mix);
      data[i + 1] = clampByte(data[i + 1] * inv + color[1] * mix);
      data[i + 2] = clampByte(data[i + 2] * inv + color[2] * mix);
    }
  }

  const blendMode = mode === "add" ? "screen" : mode;
  const blendAmount = mode === "add" ? amount * 0.7 : amount;
  const blended = blendPixelBuffers(buffer, glow, blendMode, blendAmount);
  buffer.data.set(blended.data);
}

export type BloomOptions = {
  radius: number;
  threshold: number;
  amount: number;
  color?: RgbaColor;
};

/**
 * Apply a thresholded bloom: only bright pixels contribute to the glow.
 * This is useful for effects like Luminous ASCII Bloom where bright
 * regions should emit light.
 */
export function applyBloom(buffer: PixelBuffer, options: BloomOptions): void {
  const { radius, threshold, amount, color } = options;
  if (amount <= 0 || radius <= 0) return;

  const { width, height } = buffer;
  const bright = createPixelBuffer(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(buffer, x, y);
      const lum =
        (0.299 * buffer.data[idx] +
          0.587 * buffer.data[idx + 1] +
          0.114 * buffer.data[idx + 2]) /
        255;
      if (lum > threshold) {
        const t = (lum - threshold) / (1 - threshold);
        bright.data[idx] = clampByte(buffer.data[idx] * t);
        bright.data[idx + 1] = clampByte(buffer.data[idx + 1] * t);
        bright.data[idx + 2] = clampByte(buffer.data[idx + 2] * t);
        bright.data[idx + 3] = 255;
      }
    }
  }

  applyBoxBlur(bright, radius);

  if (color) {
    const { data } = bright;
    const inv = 0.65;
    const mix = 0.35;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = clampByte(data[i] * inv + color[0] * mix);
      data[i + 1] = clampByte(data[i + 1] * inv + color[1] * mix);
      data[i + 2] = clampByte(data[i + 2] * inv + color[2] * mix);
    }
  }

  const blended = blendPixelBuffers(buffer, bright, "screen", amount);
  buffer.data.set(blended.data);
}
