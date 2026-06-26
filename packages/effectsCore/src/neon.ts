import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { blendPixelBuffers } from "./blend.js";
import { applyGlow } from "./glow.js";

export type NeonSmearOptions = {
  angle: number;
  length: number;
  color: RgbaColor;
  intensity: number;
  glowRadius?: number;
};

/**
 * Apply a directional motion smear tinted toward a neon color, then blend it
 * over the source with a screen merge. The result mimics light-trails or
 * neon drag photography.
 */
export function applyNeonSmear(
  source: PixelBuffer,
  options: NeonSmearOptions
): PixelBuffer {
  const {
    angle,
    length,
    color,
    intensity,
    glowRadius = Math.max(1, Math.round(length / 2))
  } = options;

  if (length <= 0) {
    throw new Error("length must be positive");
  }
  if (intensity < 0 || intensity > 1) {
    throw new Error("intensity must be between 0 and 1");
  }

  const { width, height } = source;
  const smear = createPixelBuffer(width, height);
  const radians = (angle * Math.PI) / 180;
  const dirX = Math.cos(radians);
  const dirY = Math.sin(radians);
  const samples = Math.max(2, Math.round(length));
  const invSamples = 1 / samples;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let s = 0; s < samples; s++) {
        const t = s / (samples - 1) - 0.5;
        const sx = Math.round(x + dirX * t * length);
        const sy = Math.round(y + dirY * t * length);
        const cx = Math.max(0, Math.min(width - 1, sx));
        const cy = Math.max(0, Math.min(height - 1, sy));
        const idx = pixelIndex(source, cx, cy);
        r += source.data[idx];
        g += source.data[idx + 1];
        b += source.data[idx + 2];
        a += source.data[idx + 3];
      }

      const outIdx = pixelIndex(smear, x, y);
      smear.data[outIdx] = clampByte(r * invSamples);
      smear.data[outIdx + 1] = clampByte(g * invSamples);
      smear.data[outIdx + 2] = clampByte(b * invSamples);
      smear.data[outIdx + 3] = clampByte(a * invSamples);
    }
  }

  // Tint the smear toward the neon color.
  const { data } = smear;
  const mix = intensity;
  const inv = 1 - mix;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clampByte(data[i] * inv + color[0] * mix);
    data[i + 1] = clampByte(data[i + 1] * inv + color[1] * mix);
    data[i + 2] = clampByte(data[i + 2] * inv + color[2] * mix);
  }

  if (glowRadius > 0 && intensity > 0) {
    applyGlow(smear, {
      radius: glowRadius,
      amount: intensity,
      mode: "screen",
      color
    });
  }

  return blendPixelBuffers(source, smear, "screen", intensity);
}
