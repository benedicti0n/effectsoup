import { clampByte } from "./buffer.js";

/**
 * Invert an RGB color.
 */
export function invertColor(r: number, g: number, b: number): [number, number, number] {
  return [255 - r, 255 - g, 255 - b];
}

/**
 * Apply a blue/cyan color grade. Shadows and midtones are pulled toward cyan
 * while highlights are lifted toward blue. Intensity scales the strength.
 */
export function applyBlueCyanGrade(
  r: number,
  g: number,
  b: number,
  intensity: number
): [number, number, number] {
  const t = Math.max(0, intensity);
  const gradedR = r * (1 - 0.25 * t);
  const gradedG = g + (255 - g) * 0.15 * t;
  const gradedB = b + (255 - b) * 0.45 * t;
  return [
    clampByte(gradedR),
    clampByte(gradedG),
    clampByte(gradedB)
  ];
}
