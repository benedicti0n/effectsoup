import type { CropConfig, PixelBuffer } from "@imageeffects/core";
import { createPixelBuffer, resizeBilinear } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import type { ResolvedPresetParameters } from "@imageeffects/presets";

function parseAspectRatio(ratio: CropConfig["aspectRatio"]): number | null {
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

function applyCrop(
  source: PixelBuffer,
  crop: CropConfig,
  targetWidth: number,
  targetHeight: number
): PixelBuffer {
  const srcAspect = source.width / source.height;
  const cropAspect = parseAspectRatio(crop.aspectRatio) ?? srcAspect;

  // Compute crop rectangle in source coordinates based on aspect ratio and zoom.
  let cropW: number;
  let cropH: number;

  if (srcAspect > cropAspect) {
    cropH = source.height / crop.zoom;
    cropW = cropH * cropAspect;
  } else {
    cropW = source.width / crop.zoom;
    cropH = cropW / cropAspect;
  }

  cropW = Math.min(cropW, source.width);
  cropH = Math.min(cropH, source.height);

  const maxOffsetX = (source.width - cropW) / 2;
  const maxOffsetY = (source.height - cropH) / 2;
  const cropX = Math.max(0, Math.min(source.width - cropW, maxOffsetX + crop.offsetX * maxOffsetX));
  const cropY = Math.max(0, Math.min(source.height - cropH, maxOffsetY + crop.offsetY * maxOffsetY));

  const intCropX = Math.round(cropX);
  const intCropY = Math.round(cropY);
  const intCropW = Math.min(source.width - intCropX, Math.round(cropW));
  const intCropH = Math.min(source.height - intCropY, Math.round(cropH));

  const cropped = createPixelBuffer(intCropW, intCropH);
  for (let y = 0; y < intCropH; y++) {
    const srcY = intCropY + y;
    for (let x = 0; x < intCropW; x++) {
      const srcX = intCropX + x;
      const srcIdx = (srcY * source.width + srcX) * 4;
      const dstIdx = (y * intCropW + x) * 4;
      cropped.data[dstIdx] = source.data[srcIdx];
      cropped.data[dstIdx + 1] = source.data[srcIdx + 1];
      cropped.data[dstIdx + 2] = source.data[srcIdx + 2];
      cropped.data[dstIdx + 3] = source.data[srcIdx + 3];
    }
  }

  return resizeBilinear(cropped, targetWidth, targetHeight);
}

export function renderEffectSync(
  source: PixelBuffer,
  crop: CropConfig,
  presetId: string,
  resolvedParameters: ResolvedPresetParameters,
  targetWidth: number,
  targetHeight: number
): PixelBuffer {
  const preset = getPresetById(presetId);
  if (!preset) {
    throw new Error(`Unknown preset: ${presetId}`);
  }

  const cropped = applyCrop(source, crop, targetWidth, targetHeight);
  const pipeline = preset.createPipeline(resolvedParameters);
  return pipeline(cropped, resolvedParameters);
}
