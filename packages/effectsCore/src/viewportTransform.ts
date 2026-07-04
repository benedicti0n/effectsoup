import type { CropConfig, PixelBuffer } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";

function parseAspectRatioInternal(ratio: CropConfig["aspectRatio"]): number | null {
  switch (ratio) {
    case "1:1":
      return 1;
    case "4:5":
      return 4 / 5;
    case "9:16":
      return 9 / 16;
    case "16:9":
      return 16 / 9;
    default:
      return null;
  }
}

/**
 * Parse a CropConfig aspect-ratio to a numeric width/height value.
 * Returns null for "original" (caller falls back to source dimensions).
 */
export function parseAspectRatio(
  ratio: CropConfig["aspectRatio"]
): number | null {
  return parseAspectRatioInternal(ratio);
}

/**
 * Compute output dimensions that match the cropped aspect ratio.
 *
 * - "original" returns source dimensions unchanged.
 * - Otherwise returns { width, height } sized to the largest dimension,
 *   preserving crop ratio with a longestEdge ceiling.
 */
export function getCroppedOutputSize(
  sourceWidth: number,
  sourceHeight: number,
  aspectRatio: CropConfig["aspectRatio"],
  longestEdge: number
): { width: number; height: number } {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("Source dimensions must be positive");
  }
  if (!Number.isFinite(longestEdge) || longestEdge <= 0) {
    throw new Error("longestEdge must be a positive number");
  }
  const ratio = parseAspectRatio(aspectRatio);
  if (ratio === null) {
    const longest = Math.max(sourceWidth, sourceHeight);
    const scale = longest > longestEdge ? longestEdge / longest : 1;
    return {
      width: Math.max(1, Math.round(sourceWidth * scale)),
      height: Math.max(1, Math.round(sourceHeight * scale))
    };
  }
  // Fixed aspect ratio: pick height so the longest dimension equals
  // longestEdge (or fewer pixels if source is smaller).
  const sourceLongest = Math.max(sourceWidth, sourceHeight);
  const scale = sourceLongest >= longestEdge ? longestEdge / sourceLongest : 1;
  let width: number;
  let height: number;
  if (ratio >= 1) {
    width = Math.max(1, Math.round(sourceLongest * scale));
    height = Math.max(1, Math.round(width / ratio));
  } else {
    height = Math.max(1, Math.round(sourceLongest * scale));
    width = Math.max(1, Math.round(height * ratio));
  }
  return { width, height };
}

function sampleBilinear(source: PixelBuffer, x: number, y: number): [number, number, number, number] {
  const xf = Math.max(0, Math.min(source.width - 1, x));
  const yf = Math.max(0, Math.min(source.height - 1, y));
  const x0 = Math.floor(xf);
  const y0 = Math.floor(yf);
  const x1 = Math.min(source.width - 1, x0 + 1);
  const y1 = Math.min(source.height - 1, y0 + 1);
  const xFrac = xf - x0;
  const yFrac = yf - y0;

  const i00 = pixelIndex(source, x0, y0);
  const i10 = pixelIndex(source, x1, y0);
  const i01 = pixelIndex(source, x0, y1);
  const i11 = pixelIndex(source, x1, y1);

  const r =
    source.data[i00] * (1 - xFrac) * (1 - yFrac) +
    source.data[i10] * xFrac * (1 - yFrac) +
    source.data[i01] * (1 - xFrac) * yFrac +
    source.data[i11] * xFrac * yFrac;
  const g =
    source.data[i00 + 1] * (1 - xFrac) * (1 - yFrac) +
    source.data[i10 + 1] * xFrac * (1 - yFrac) +
    source.data[i01 + 1] * (1 - xFrac) * yFrac +
    source.data[i11 + 1] * xFrac * yFrac;
  const b =
    source.data[i00 + 2] * (1 - xFrac) * (1 - yFrac) +
    source.data[i10 + 2] * xFrac * (1 - yFrac) +
    source.data[i01 + 2] * (1 - xFrac) * yFrac +
    source.data[i11 + 2] * xFrac * yFrac;
  const a =
    source.data[i00 + 3] * (1 - xFrac) * (1 - yFrac) +
    source.data[i10 + 3] * xFrac * (1 - yFrac) +
    source.data[i01 + 3] * (1 - xFrac) * yFrac +
    source.data[i11 + 3] * xFrac * yFrac;

  return [Math.round(r), Math.round(g), Math.round(b), Math.round(a)];
}

/**
 * Apply a non-destructive viewport transform to a source buffer.
 *
 * Supports:
 * - Fixed aspect ratios (1:1, 4:5, 9:16, 16:9) using a "cover" crop model.
 * - "original" aspect ratio preserving the source dimensions.
 * - Zoom into the source image.
 * - Pan offsets clamped so the crop window never leaves the source bounds.
 *
 * The source buffer is never modified. The output buffer is sampled with
 * bilinear interpolation to the requested dimensions.
 */
export function applyViewportTransform(
  source: PixelBuffer,
  viewport: CropConfig,
  outputWidth: number,
  outputHeight: number
): PixelBuffer {
  if (outputWidth <= 0 || outputHeight <= 0) {
    throw new Error("Output dimensions must be positive");
  }

  const srcAspect = source.width / source.height;
  const targetAspect = parseAspectRatio(viewport.aspectRatio) ?? srcAspect;

  // Compute the "cover" crop window in source coordinates.
  let cropW: number;
  let cropH: number;
  if (srcAspect > targetAspect) {
    cropH = source.height;
    cropW = cropH * targetAspect;
  } else {
    cropW = source.width;
    cropH = cropW / targetAspect;
  }

  // Apply zoom (reduce window size).
  const zoom = Math.max(1, viewport.zoom);
  cropW /= zoom;
  cropH /= zoom;

  // Clamp crop window to source bounds.
  cropW = Math.min(cropW, source.width);
  cropH = Math.min(cropH, source.height);

  // Compute centered origin, then apply offset and clamp.
  const maxOffsetX = (source.width - cropW) / 2;
  const maxOffsetY = (source.height - cropH) / 2;
  const cropX = Math.max(0, Math.min(source.width - cropW, maxOffsetX + viewport.offsetX * maxOffsetX));
  const cropY = Math.max(0, Math.min(source.height - cropH, maxOffsetY + viewport.offsetY * maxOffsetY));

  const output = createPixelBuffer(outputWidth, outputHeight);
  const denomX = Math.max(1, outputWidth - 1);
  const denomY = Math.max(1, outputHeight - 1);

  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      const u = x / denomX;
      const v = y / denomY;
      const srcX = cropX + u * cropW;
      const srcY = cropY + v * cropH;
      const [r, g, b, a] = sampleBilinear(source, srcX, srcY);
      const idx = pixelIndex(output, x, y);
      output.data[idx] = r;
      output.data[idx + 1] = g;
      output.data[idx + 2] = b;
      output.data[idx + 3] = a;
    }
  }

  return output;
}
