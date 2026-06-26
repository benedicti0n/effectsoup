import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyGrain,
  applyOrderedDither,
  clonePixelBuffer,
  toGrayscale,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  adjustmentControls,
  atmosphereAdvancedControls,
  resolveOverride
} from "../shared.js";

export const orderedDitherPreset: EffectPreset = {
  id: "orderedDither",
  name: "Ordered Dither",
  description: "Structured monochrome dithering built from a repeating threshold grid.",
  category: "printGrid",
  access: "free",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...adjustmentControls,
    ...atmosphereAdvancedControls,
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 128 },
    { id: "invert", name: "Invert", type: "boolean", defaultValue: false }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    threshold: resolveOverride(overrides, "threshold", 100 + Math.round((intensity / 100) * 80)),
    invert: resolveOverride(overrides, "invert", false),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 30)),
    brightness: resolveOverride(overrides, "brightness", Math.round((intensity / 100) * -10)),
    saturation: resolveOverride(overrides, "saturation", 0),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 10)),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const result = clonePixelBuffer(source);
      const saturation = ((params.saturation as number) ?? 0) / 100;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const threshold = (params.threshold as number) ?? 128;
      const invert = (params.invert as boolean) ?? false;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      if (saturation !== 0) {
        adjustSaturation(result, saturation);
      }
      toGrayscale(result);
      if (brightness !== 0 || contrast !== 0) {
        adjustBrightnessContrast(result, brightness, contrast);
      }
      applyOrderedDither(result, threshold);
      if (invert) {
        for (let i = 0; i < result.data.length; i += 4) {
          result.data[i] = 255 - result.data[i];
          result.data[i + 1] = 255 - result.data[i + 1];
          result.data[i + 2] = 255 - result.data[i + 2];
        }
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};
