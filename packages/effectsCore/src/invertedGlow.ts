import type { PixelBuffer } from "./types.js";
import { clampByte, clonePixelBuffer } from "./buffer.js";
import { applyBoxBlur, blendPixelBuffers } from "./blend.js";
import { invertColor, applyBlueCyanGrade } from "./glowUtils.js";

export type InvertedGlowOptions = {
  intensity: number;
};

/**
 * Inverted Glow:
 * 1. Invert the image colors.
 * 2. Apply a blue/cyan color grade.
 * 3. Build a glow through multiple blurred layers blended with lighten.
 * 4. Enhance highlights and deepen shadows for a dramatic neon-cyan look.
 */
export function applyInvertedGlow(
  source: PixelBuffer,
  options: InvertedGlowOptions
): PixelBuffer {
  const { intensity } = options;
  if (intensity < 0) {
    throw new Error("intensity must be non-negative");
  }

  let output = clonePixelBuffer(source);
  const { data } = output;

  // First pass: invert and grade.
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = invertColor(data[i], data[i + 1], data[i + 2]);
    const [gr, gg, gb] = applyBlueCyanGrade(r, g, b, intensity);
    data[i] = gr;
    data[i + 1] = gg;
    data[i + 2] = gb;
  }

  // Glow/bloom through stacked blurred layers.
  const glowStrength = Math.max(1, Math.round(intensity * 3));
  for (let blur = glowStrength; blur > 0; blur -= 1) {
    const blurred = clonePixelBuffer(output);
    applyBoxBlur(blurred, blur * 2);
    const amount = 0.1 + intensity * 0.05;
    output = blendPixelBuffers(output, blurred, "lighten", amount);
  }

  // Second pass: boost highlights, darken shadows.
  const outData = output.data;
  for (let i = 0; i < outData.length; i += 4) {
    const brightness = (outData[i] + outData[i + 1] + outData[i + 2]) / 3;
    if (brightness > 150) {
      outData[i] = clampByte(outData[i] * (1 + intensity * 0.2));
      outData[i + 1] = clampByte(outData[i + 1] * (1 + intensity * 0.2));
      outData[i + 2] = clampByte(outData[i + 2] * (1 + intensity * 0.3));
    } else if (brightness < 100) {
      outData[i] = clampByte(outData[i] * (1 - intensity * 0.15));
      outData[i + 1] = clampByte(outData[i + 1] * (1 - intensity * 0.15));
      outData[i + 2] = clampByte(outData[i + 2] * (1 - intensity * 0.1));
    }
  }

  return output;
}
