import type { PixelBuffer } from "./types.js";
import { clampByte, pixelIndex } from "./buffer.js";

/**
 * Apply a subtle vignette in-place.
 * strength: 0 to 1
 */
export function applyVignette(buffer: PixelBuffer, strength: number): void {
  if (strength < 0 || strength > 1) {
    throw new Error("strength must be between 0 and 1");
  }
  const { data, width, height } = buffer;
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = 1 - strength * (dist / maxDist);
      const idx = pixelIndex(buffer, x, y);
      for (let c = 0; c < 3; c++) {
        data[idx + c] = clampByte(data[idx + c] * factor);
      }
    }
  }
}
