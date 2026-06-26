import type { PixelBuffer } from "./types.js";
import { reducePalette } from "./color.js";
import { applyOrderedDither } from "./dither.js";
import { resizeNearestNeighbor } from "./resize.js";

export type BitmapOptions = {
  pixelSize: number;
  colorLevels: number;
  ditherThreshold?: number;
};

/**
 * Heavy pixelation with palette reduction and optional ordered dither.
 * Great for retro bitmap / 8-bit poster looks.
 */
export function applyBitmap(
  source: PixelBuffer,
  options: BitmapOptions
): PixelBuffer {
  const { pixelSize, colorLevels, ditherThreshold } = options;
  if (pixelSize <= 0) {
    throw new Error("pixelSize must be positive");
  }
  if (colorLevels < 2 || colorLevels > 256) {
    throw new Error("colorLevels must be between 2 and 256");
  }

  const smallW = Math.max(1, Math.floor(source.width / pixelSize));
  const smallH = Math.max(1, Math.floor(source.height / pixelSize));
  let result = resizeNearestNeighbor(source, smallW, smallH);
  result = resizeNearestNeighbor(result, source.width, source.height);

  reducePalette(result, colorLevels);

  if (ditherThreshold !== undefined && ditherThreshold > 0) {
    applyOrderedDither(result, ditherThreshold);
  }

  return result;
}
