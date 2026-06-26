import type { PixelBuffer } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";

/**
 * Apply a simple Sobel edge-detection and blend edges back into the image.
 * strength: 0 to 1
 */
export function applyEdgeDetect(buffer: PixelBuffer, strength: number): void {
  if (strength < 0 || strength > 1) {
    throw new Error("strength must be between 0 and 1");
  }
  const { data, width, height } = buffer;
  const edges = createPixelBuffer(width, height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = pixelIndex(buffer, x, y);
      const gx =
        -1 * data[pixelIndex(buffer, x - 1, y - 1)] +
        -2 * data[pixelIndex(buffer, x - 1, y)] +
        -1 * data[pixelIndex(buffer, x - 1, y + 1)] +
        1 * data[pixelIndex(buffer, x + 1, y - 1)] +
        2 * data[pixelIndex(buffer, x + 1, y)] +
        1 * data[pixelIndex(buffer, x + 1, y + 1)];
      const gy =
        -1 * data[pixelIndex(buffer, x - 1, y - 1)] +
        -2 * data[pixelIndex(buffer, x, y - 1)] +
        -1 * data[pixelIndex(buffer, x + 1, y - 1)] +
        1 * data[pixelIndex(buffer, x - 1, y + 1)] +
        2 * data[pixelIndex(buffer, x, y + 1)] +
        1 * data[pixelIndex(buffer, x + 1, y + 1)];
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const edge = clampByte(magnitude / 4);
      edges.data[idx] = edge;
      edges.data[idx + 1] = edge;
      edges.data[idx + 2] = edge;
      edges.data[idx + 3] = 255;
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      data[i + c] = clampByte(
        data[i + c] * (1 - strength) + edges.data[i + c] * strength
      );
    }
  }
}

/**
 * Return a pure edge image: black background with white edges based on Sobel
 * magnitude. Useful as a starting point for neon/outline effects.
 */
export function renderEdgeBuffer(buffer: PixelBuffer): PixelBuffer {
  const { data, width, height } = buffer;
  const edges = createPixelBuffer(width, height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = pixelIndex(buffer, x, y);
      const gx =
        -1 * data[pixelIndex(buffer, x - 1, y - 1)] +
        -2 * data[pixelIndex(buffer, x - 1, y)] +
        -1 * data[pixelIndex(buffer, x - 1, y + 1)] +
        1 * data[pixelIndex(buffer, x + 1, y - 1)] +
        2 * data[pixelIndex(buffer, x + 1, y)] +
        1 * data[pixelIndex(buffer, x + 1, y + 1)];
      const gy =
        -1 * data[pixelIndex(buffer, x - 1, y - 1)] +
        -2 * data[pixelIndex(buffer, x, y - 1)] +
        -1 * data[pixelIndex(buffer, x + 1, y - 1)] +
        1 * data[pixelIndex(buffer, x - 1, y + 1)] +
        2 * data[pixelIndex(buffer, x, y + 1)] +
        1 * data[pixelIndex(buffer, x + 1, y + 1)];
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const edge = clampByte(magnitude / 4);
      edges.data[idx] = edge;
      edges.data[idx + 1] = edge;
      edges.data[idx + 2] = edge;
      edges.data[idx + 3] = 255;
    }
  }

  return edges;
}
