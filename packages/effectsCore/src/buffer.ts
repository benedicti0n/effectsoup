import type { PixelBuffer, RgbaColor } from "./types.js";

/**
 * Create a new PixelBuffer with the given dimensions.
 * The buffer is zero-initialized unless a fill color is provided.
 */
export function createPixelBuffer(
  width: number,
  height: number,
  fill?: RgbaColor
): PixelBuffer {
  if (width <= 0 || height <= 0) {
    throw new Error("Buffer dimensions must be positive");
  }
  const data = new Uint8ClampedArray(width * height * 4);
  if (fill) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = fill[0];
      data[i + 1] = fill[1];
      data[i + 2] = fill[2];
      data[i + 3] = fill[3];
    }
  }
  return { width, height, data };
}

/**
 * Create a deep copy of a PixelBuffer.
 */
export function clonePixelBuffer(buffer: PixelBuffer): PixelBuffer {
  return {
    width: buffer.width,
    height: buffer.height,
    data: new Uint8ClampedArray(buffer.data)
  };
}

/**
 * Fill an existing PixelBuffer with a color in-place.
 */
export function fillPixelBuffer(buffer: PixelBuffer, color: RgbaColor): void {
  const { data } = buffer;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = color[3];
  }
}

/**
 * Helper to clamp a number to the 0-255 range.
 * Returns 0 for NaN/Infinity values.
 */
export function clampByte(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return Math.round(value);
}

/**
 * Helper to get the index of a pixel in a buffer.
 */
export function pixelIndex(buffer: PixelBuffer, x: number, y: number): number {
  return (y * buffer.width + x) * 4;
}
