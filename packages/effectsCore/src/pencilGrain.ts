import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { renderEdgeBuffer } from "./edge.js";
import { applyGrain } from "./noise.js";

export type PencilGrainOptions = {
  paperColor: RgbaColor;
  edgeStrength: number;
  grainAmount: number;
};

/**
 * Convert the image into a pencil-style sketch: edges become dark graphite
 * marks on colored paper, with added film grain for texture.
 */
export function applyPencilGrain(
  source: PixelBuffer,
  options: PencilGrainOptions
): PixelBuffer {
  const { paperColor, edgeStrength, grainAmount } = options;
  if (edgeStrength < 0 || edgeStrength > 1) {
    throw new Error("edgeStrength must be between 0 and 1");
  }
  if (grainAmount < 0 || grainAmount > 1) {
    throw new Error("grainAmount must be between 0 and 1");
  }

  const { width, height } = source;
  const edges = renderEdgeBuffer(source);
  const output = createPixelBuffer(width, height, paperColor);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = pixelIndex(output, x, y);
      const edge = edges.data[idx] / 255;
      const factor = 1 - edge * edgeStrength;
      output.data[idx] = clampByte(paperColor[0] * factor);
      output.data[idx + 1] = clampByte(paperColor[1] * factor);
      output.data[idx + 2] = clampByte(paperColor[2] * factor);
      output.data[idx + 3] = 255;
    }
  }

  if (grainAmount > 0) {
    applyGrain(output, grainAmount);
  }

  return output;
}
