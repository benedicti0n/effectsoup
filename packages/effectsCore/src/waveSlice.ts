import type { PixelBuffer } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";

export type WaveSliceDirection = "horizontal" | "vertical";

export type WaveSliceOptions = {
  amplitude: number;
  frequency: number;
  direction?: WaveSliceDirection;
};

/**
 * Displace the image with a sine-wave slice. Horizontal waves shift pixels
 * left/right based on their y coordinate; vertical waves shift them up/down
 * based on their x coordinate.
 */
export function applyWaveSlice(
  source: PixelBuffer,
  options: WaveSliceOptions
): PixelBuffer {
  const { amplitude, frequency, direction = "horizontal" } = options;
  if (amplitude < 0 || frequency < 0) {
    throw new Error("amplitude and frequency must be non-negative");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height);
  const twoPi = Math.PI * 2;
  const size = direction === "horizontal" ? height : width;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const coord = direction === "horizontal" ? y : x;
      const normalized = size > 0 ? coord / size : 0;
      const wave = Math.sin(normalized * frequency * twoPi) * amplitude;

      const sx = Math.max(
        0,
        Math.min(width - 1, Math.round(x + (direction === "horizontal" ? wave : 0)))
      );
      const sy = Math.max(
        0,
        Math.min(height - 1, Math.round(y + (direction === "vertical" ? wave : 0)))
      );

      const srcIdx = pixelIndex(source, sx, sy);
      const dstIdx = pixelIndex(output, x, y);
      output.data[dstIdx] = source.data[srcIdx];
      output.data[dstIdx + 1] = source.data[srcIdx + 1];
      output.data[dstIdx + 2] = source.data[srcIdx + 2];
      output.data[dstIdx + 3] = source.data[srcIdx + 3];
    }
  }

  return output;
}
