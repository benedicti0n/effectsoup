import type { PixelBuffer } from "../types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "../buffer.js";
import { smoothstep } from "./utils.js";
import type { AsciiWeightMapOptions } from "./types.js";

/**
 * Compute a grayscale luminance buffer at source dimensions.
 */
export function computeLuminanceBuffer(source: PixelBuffer): PixelBuffer {
  const { width, height } = source;
  const output = createPixelBuffer(width, height);
  for (let i = 0; i < source.data.length; i += 4) {
    const lum = clampByte(
      0.299 * source.data[i] + 0.587 * source.data[i + 1] + 0.114 * source.data[i + 2]
    );
    output.data[i] = lum;
    output.data[i + 1] = lum;
    output.data[i + 2] = lum;
    output.data[i + 3] = 255;
  }
  return output;
}

/**
 * Compute a grayscale Sobel-gradient-magnitude buffer at source dimensions.
 */
export function computeGradientMagnitudeBuffer(source: PixelBuffer): PixelBuffer {
  const gray = computeLuminanceBuffer(source);
  const { width, height } = gray;
  const output = createPixelBuffer(width, height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = pixelIndex(gray, x, y);
      const gx =
        -1 * gray.data[pixelIndex(gray, x - 1, y - 1)] +
        -2 * gray.data[pixelIndex(gray, x - 1, y)] +
        -1 * gray.data[pixelIndex(gray, x - 1, y + 1)] +
        1 * gray.data[pixelIndex(gray, x + 1, y - 1)] +
        2 * gray.data[pixelIndex(gray, x + 1, y)] +
        1 * gray.data[pixelIndex(gray, x + 1, y + 1)];
      const gy =
        -1 * gray.data[pixelIndex(gray, x - 1, y - 1)] +
        -2 * gray.data[pixelIndex(gray, x, y - 1)] +
        -1 * gray.data[pixelIndex(gray, x + 1, y - 1)] +
        1 * gray.data[pixelIndex(gray, x - 1, y + 1)] +
        2 * gray.data[pixelIndex(gray, x, y + 1)] +
        1 * gray.data[pixelIndex(gray, x + 1, y + 1)];
      const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy) / 4);
      output.data[idx] = magnitude;
      output.data[idx + 1] = magnitude;
      output.data[idx + 2] = magnitude;
      output.data[idx + 3] = 255;
    }
  }
  return output;
}

/**
 * Compute a highlight mask for symbol effects.
 * Bright areas and strong edges pass through; midtones and dark/flat regions fall to zero.
 */
export function computeHighlightMask(
  source: PixelBuffer,
  threshold: number,
  falloff: number,
  edgeStrength = 0.5
): PixelBuffer {
  const luminance = computeLuminanceBuffer(source);
  const gradient = computeGradientMagnitudeBuffer(source);
  const { width, height } = source;
  const output = createPixelBuffer(width, height);

  for (let i = 0; i < output.data.length; i += 4) {
    const lum = luminance.data[i] / 255;
    const edge = gradient.data[i] / 255;
    const highlight = smoothstep(threshold, Math.min(1, threshold + falloff), lum);
    const value = Math.max(highlight, edge * edgeStrength);
    const v = clampByte(value * 255);
    output.data[i] = v;
    output.data[i + 1] = v;
    output.data[i + 2] = v;
    output.data[i + 3] = 255;
  }
  return output;
}

/**
 * Compute a sparse weight map for minimal/edge-aware ASCII placement.
 * Highlights, dark details, and edges all contribute; flat midtone backgrounds remain empty.
 */
export function computeAsciiWeightMap(
  source: PixelBuffer,
  options: AsciiWeightMapOptions
): PixelBuffer {
  const { highlightThreshold, shadowThreshold, edgeStrength, shadowStrength } = options;
  const luminance = computeLuminanceBuffer(source);
  const gradient = computeGradientMagnitudeBuffer(source);
  const { width, height } = source;
  const output = createPixelBuffer(width, height);

  for (let i = 0; i < output.data.length; i += 4) {
    const lum = luminance.data[i] / 255;
    const edge = gradient.data[i] / 255;
    const highlight = smoothstep(highlightThreshold, 1, lum);
    const shadow = lum < shadowThreshold ? (shadowThreshold - lum) / shadowThreshold : 0;
    const value = Math.max(highlight, shadow * shadowStrength, edge * edgeStrength);
    const v = clampByte(value * 255);
    output.data[i] = v;
    output.data[i + 1] = v;
    output.data[i + 2] = v;
    output.data[i + 3] = 255;
  }
  return output;
}
