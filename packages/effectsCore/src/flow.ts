import type { PixelBuffer } from "./types.js";
import { pixelIndex } from "./buffer.js";

export type GradientField = {
  magnitude: Float32Array;
  angle: Float32Array;
};

/**
 * Compute per-pixel Sobel gradient magnitude and direction from luminance.
 * Angle is in radians and represents the direction of the gradient (not the
 * edge tangent). Magnitude is normalized roughly to 0-255.
 */
export function computeGradientField(source: PixelBuffer): GradientField {
  const { width, height, data } = source;
  const magnitude = new Float32Array(width * height);
  const angle = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = pixelIndex(source, x, y);
      const luminance = (c: number) =>
        (0.299 * data[c] + 0.587 * data[c + 1] + 0.114 * data[c + 2]);

      const gx =
        -1 * luminance(pixelIndex(source, x - 1, y - 1)) +
        -2 * luminance(pixelIndex(source, x - 1, y)) +
        -1 * luminance(pixelIndex(source, x - 1, y + 1)) +
        1 * luminance(pixelIndex(source, x + 1, y - 1)) +
        2 * luminance(pixelIndex(source, x + 1, y)) +
        1 * luminance(pixelIndex(source, x + 1, y + 1));
      const gy =
        -1 * luminance(pixelIndex(source, x - 1, y - 1)) +
        -2 * luminance(pixelIndex(source, x, y - 1)) +
        -1 * luminance(pixelIndex(source, x + 1, y - 1)) +
        1 * luminance(pixelIndex(source, x - 1, y + 1)) +
        2 * luminance(pixelIndex(source, x, y + 1)) +
        1 * luminance(pixelIndex(source, x + 1, y + 1));

      const mag = Math.sqrt(gx * gx + gy * gy) / 4;
      magnitude[idx / 4] = mag;
      angle[idx / 4] = Math.atan2(gy, gx);
    }
  }

  return { magnitude, angle };
}

/**
 * Compute a flow-field angle per pixel by mixing the image gradient with
 * low-frequency sine/cosine waves. The result is suitable for stylized
 * flow-line and smear effects.
 */
export function computeFlowAngle(
  source: PixelBuffer,
  scale: number = 32
): Float32Array {
  const { width, height } = source;
  const { angle: gradientAngle } = computeGradientField(source);
  const flow = new Float32Array(width * height);
  const twoPi = Math.PI * 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const wave =
        Math.sin((x / scale) * twoPi) + Math.cos((y / scale) * twoPi);
      flow[i] = gradientAngle[i] + wave * Math.PI;
    }
  }

  return flow;
}
