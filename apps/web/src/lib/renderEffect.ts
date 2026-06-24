import type { CropConfig, PixelBuffer } from "@imageeffects/core";
import { createPixelBuffer } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import type { ResolvedPresetParameters } from "@imageeffects/presets";
import { resizeBilinear } from "@imageeffects/core";

function applyCrop(source: PixelBuffer, targetWidth: number, targetHeight: number): PixelBuffer {
  const srcAspect = source.width / source.height;
  const dstAspect = targetWidth / targetHeight;
  let cropW = source.width;
  let cropH = source.height;
  let cropX = 0;
  let cropY = 0;

  if (srcAspect > dstAspect) {
    cropW = Math.round(source.height * dstAspect);
    cropX = Math.round((source.width - cropW) / 2);
  } else {
    cropH = Math.round(source.width / dstAspect);
    cropY = Math.round((source.height - cropH) / 2);
  }

  const cropped = createPixelBuffer(cropW, cropH);
  for (let y = 0; y < cropH; y++) {
    const srcY = cropY + y;
    for (let x = 0; x < cropW; x++) {
      const srcX = cropX + x;
      const srcIdx = (srcY * source.width + srcX) * 4;
      const dstIdx = (y * cropW + x) * 4;
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

  const cropped = applyCrop(source, targetWidth, targetHeight);
  const pipeline = preset.createPipeline(resolvedParameters);
  return pipeline(cropped, resolvedParameters);
}
