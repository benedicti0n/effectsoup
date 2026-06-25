import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte } from "./buffer.js";

/**
 * Convert a buffer to grayscale in-place using luminance weights.
 */
export function toGrayscale(buffer: PixelBuffer): void {
  const { data } = buffer;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const value = clampByte(luminance);
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
}

/**
 * Adjust brightness and contrast in-place.
 * brightness: -255 to 255
 * contrast: -1 to 1 (where 0 is unchanged, 1 is max contrast)
 */
export function adjustBrightnessContrast(
  buffer: PixelBuffer,
  brightness: number,
  contrast: number
): void {
  const { data } = buffer;
  const contrastFactor = (1 + contrast) * (1 + contrast);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = data[i + c] + brightness;
      value = (value - 128) * contrastFactor + 128;
      data[i + c] = clampByte(value);
    }
  }
}

/**
 * Adjust saturation in-place.
 * saturation: -1 to 1 (where 0 is unchanged, 1 is max saturation)
 */
export function adjustSaturation(buffer: PixelBuffer, saturation: number): void {
  const { data } = buffer;
  const factor = 1 + saturation;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    data[i] = clampByte(luminance + (r - luminance) * factor);
    data[i + 1] = clampByte(luminance + (g - luminance) * factor);
    data[i + 2] = clampByte(luminance + (b - luminance) * factor);
  }
}

/**
 * Posterize a buffer in-place, reducing the number of levels per channel.
 * levels: 2 to 256
 */
export function applyPosterize(buffer: PixelBuffer, levels: number): void {
  if (levels < 2 || levels > 256) {
    throw new Error("levels must be between 2 and 256");
  }
  const { data } = buffer;
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const value = data[i + c];
      data[i + c] = clampByte(Math.round(value / step) * step);
    }
  }
}

/**
 * Map luminance to a duotone gradient between shadow and highlight colors.
 */
export function applyDuotone(
  buffer: PixelBuffer,
  shadow: RgbaColor,
  highlight: RgbaColor
): void {
  const { data } = buffer;
  for (let i = 0; i < data.length; i += 4) {
    const luminance =
      (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    const t = luminance;
    data[i] = clampByte(shadow[0] + (highlight[0] - shadow[0]) * t);
    data[i + 1] = clampByte(shadow[1] + (highlight[1] - shadow[1]) * t);
    data[i + 2] = clampByte(shadow[2] + (highlight[2] - shadow[2]) * t);
  }
}

/**
 * Reduce the color palette to a fixed number of colors using simple uniform quantization.
 * For MVP this is fast and deterministic; a k-means variant can be swapped later.
 */
export function reducePalette(buffer: PixelBuffer, colorCount: number): void {
  if (colorCount < 2 || colorCount > 256) {
    throw new Error("colorCount must be between 2 and 256");
  }
  const { data } = buffer;
  const levels = Math.max(2, Math.round(Math.cbrt(colorCount)));
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      data[i + c] = clampByte(Math.round(data[i + c] / step) * step);
    }
  }
}

/**
 * Tint a buffer in-place by blending each pixel toward a tint color.
 * amount: 0 to 1, where 0 is unchanged and 1 is fully tinted.
 */
export function applyTint(buffer: PixelBuffer, tint: RgbaColor, amount: number): void {
  if (amount <= 0) return;
  const { data } = buffer;
  const a = Math.min(1, Math.max(0, amount));
  const inv = 1 - a;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clampByte(data[i] * inv + tint[0] * a);
    data[i + 1] = clampByte(data[i + 1] * inv + tint[1] * a);
    data[i + 2] = clampByte(data[i + 2] * inv + tint[2] * a);
  }
}

/**
 * Compute the average color of a buffer.
 */
export function averageColor(buffer: PixelBuffer): RgbaColor {
  const { data } = buffer;
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  const count = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    a += data[i + 3];
  }
  return [r / count, g / count, b / count, a / count];
}
