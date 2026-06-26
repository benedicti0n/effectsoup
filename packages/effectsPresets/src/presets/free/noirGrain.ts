import {
  adjustBrightnessContrast,
  applyGrain,
  applyVignette,
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

export const noirGrainPreset: EffectPreset = {
  id: "noirGrain",
  name: "Noir Grain",
  description: "Moody black-and-white contrast and film texture.",
  category: "atmosphereGlow",
  access: "free",
  defaultIntensity: 65,
  advancedControlSchema: [
    ...adjustmentControls,
    ...atmosphereAdvancedControls,
    { id: "vignette", name: "Vignette", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "contrast", name: "Contrast", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    contrast: resolveOverride(overrides, "contrast", 30 + Math.round((intensity / 100) * 50)),
    brightness: resolveOverride(overrides, "brightness", Math.round((intensity / 100) * -15)),
    saturation: resolveOverride(overrides, "saturation", 0),
    vignette: resolveOverride(overrides, "vignette", Math.round((intensity / 100) * 70)),
    grainAmount: resolveOverride(overrides, "grainAmount", 70),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const vignette = ((params.vignette as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      toGrayscale(result);
      adjustBrightnessContrast(result, brightness, contrast);
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      if (vignette > 0) {
        applyVignette(result, vignette);
      }
      return result;
    };
  }
};
