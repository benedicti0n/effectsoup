import type { PixelBuffer, RgbaColor } from "./types.js";
import { createPixelBuffer } from "./buffer.js";
import { computeGradientField } from "./flow.js";
import { drawLine } from "./draw.js";

export type ContourHatchOptions = {
  lineLength: number;
  spacing: number;
  inkColor: RgbaColor;
  paperColor: RgbaColor;
  threshold: number;
};

/**
 * Draw short hatch strokes perpendicular to the local image gradient. Stronger
 * edges produce longer, more opaque strokes, creating a contour-hatching
 * illustration effect.
 */
export function applyContourHatch(
  source: PixelBuffer,
  options: ContourHatchOptions
): PixelBuffer {
  const { lineLength, spacing, inkColor, paperColor, threshold } = options;
  if (spacing <= 0 || lineLength <= 0) {
    throw new Error("spacing and lineLength must be positive");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, paperColor);
  const { magnitude, angle } = computeGradientField(source);

  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const i = y * width + x;
      const mag = magnitude[i];
      if (mag < threshold) continue;

      const strokeAngle = angle[i] + Math.PI / 2;
      const len = lineLength * (mag / 255);
      const opacity = mag / 255;

      const x0 = x - Math.cos(strokeAngle) * len * 0.5;
      const y0 = y - Math.sin(strokeAngle) * len * 0.5;
      const x1 = x + Math.cos(strokeAngle) * len * 0.5;
      const y1 = y + Math.sin(strokeAngle) * len * 0.5;

      drawLine(output, x0, y0, x1, y1, inkColor, opacity);
    }
  }

  return output;
}
