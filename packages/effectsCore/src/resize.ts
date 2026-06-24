import type { PixelBuffer } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";

/**
 * Resize a PixelBuffer using nearest-neighbor sampling.
 * Fast but blocky; useful for pixelation effects.
 */
export function resizeNearestNeighbor(
  source: PixelBuffer,
  targetWidth: number,
  targetHeight: number
): PixelBuffer {
  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error("Target dimensions must be positive");
  }
  const output = createPixelBuffer(targetWidth, targetHeight);
  const xRatio = source.width / targetWidth;
  const yRatio = source.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const srcY = Math.min(source.height - 1, Math.floor(y * yRatio));
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.min(source.width - 1, Math.floor(x * xRatio));
      const srcIdx = pixelIndex(source, srcX, srcY);
      const dstIdx = pixelIndex(output, x, y);
      output.data[dstIdx] = source.data[srcIdx];
      output.data[dstIdx + 1] = source.data[srcIdx + 1];
      output.data[dstIdx + 2] = source.data[srcIdx + 2];
      output.data[dstIdx + 3] = source.data[srcIdx + 3];
    }
  }

  return output;
}

/**
 * Resize a PixelBuffer using bilinear interpolation.
 * Smoother than nearest-neighbor; useful for general scaling.
 */
export function resizeBilinear(
  source: PixelBuffer,
  targetWidth: number,
  targetHeight: number
): PixelBuffer {
  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error("Target dimensions must be positive");
  }
  const output = createPixelBuffer(targetWidth, targetHeight);
  const xRatio = source.width / targetWidth;
  const yRatio = source.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const srcY = y * yRatio;
    const y0 = Math.floor(srcY);
    const y1 = Math.min(source.height - 1, y0 + 1);
    const yFrac = srcY - y0;

    for (let x = 0; x < targetWidth; x++) {
      const srcX = x * xRatio;
      const x0 = Math.floor(srcX);
      const x1 = Math.min(source.width - 1, x0 + 1);
      const xFrac = srcX - x0;

      const i00 = pixelIndex(source, x0, y0);
      const i10 = pixelIndex(source, x1, y0);
      const i01 = pixelIndex(source, x0, y1);
      const i11 = pixelIndex(source, x1, y1);

      const dstIdx = pixelIndex(output, x, y);
      for (let c = 0; c < 4; c++) {
        const v0 = source.data[i00 + c];
        const v1 = source.data[i10 + c];
        const v2 = source.data[i01 + c];
        const v3 = source.data[i11 + c];
        const top = v0 + (v1 - v0) * xFrac;
        const bottom = v2 + (v3 - v2) * xFrac;
        output.data[dstIdx + c] = Math.round(top + (bottom - top) * yFrac);
      }
    }
  }

  return output;
}
