import type { CropConfig, PixelBuffer } from "@effectsoup/core";
import { applyViewportTransform } from "@effectsoup/core";
import { getPresetById } from "@effectsoup/presets";
import type { ResolvedPresetParameters } from "@effectsoup/presets";

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

  const cropped = applyViewportTransform(source, crop, targetWidth, targetHeight);
  const pipeline = preset.createPipeline(resolvedParameters);
  return pipeline(cropped, resolvedParameters);
}
