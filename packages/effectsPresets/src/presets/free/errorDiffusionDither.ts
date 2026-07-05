import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyFloydSteinbergDither,
  applyGrain,
  clonePixelBuffer,
  resizeNearestNeighbor,
  toGrayscale,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  adjustmentControls,
  atmosphereAdvancedControls,
  resolveOverride,
  runAtWorkingResolution
} from "../shared.js";

const WORKING_LONGEST = 800;

export const errorDiffusionDitherPreset: EffectPreset = {
  id: "errorDiffusionDither",
  name: "Error Diffusion",
  description: "Organic monochrome dithering with diffused pixel texture. Cell Size controls the visible block size.",
  category: "pixelDither",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...adjustmentControls,
    ...atmosphereAdvancedControls,
    { id: "cellSize", name: "Cell Size", type: "range", min: 1, max: 32, step: 1, defaultValue: 4 },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 128 },
    { id: "invert", name: "Invert", type: "boolean", defaultValue: false }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 4),
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

      const saturation = ((params.saturation as number) ?? 0) / 100;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const threshold = (params.threshold as number) ?? 128;
      const invert = (params.invert as boolean) ?? false;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const cellSize = (params.cellSize as number) ?? 4;

      const processed = runAtWorkingResolution(source, WORKING_LONGEST, (small) => {
        let working = small;
        let needsUpscale = false;
        if (cellSize > 1) {
          const gridW = Math.max(1, Math.round(small.width / cellSize));
          const gridH = Math.max(1, Math.round(small.height / cellSize));
          working = resizeNearestNeighbor(small, gridW, gridH);
          needsUpscale = true;
        }

        const result = clonePixelBuffer(working);
        if (saturation !== 0) {
          adjustSaturation(result, saturation);
        }
        toGrayscale(result);
        if (brightness !== 0 || contrast !== 0) {
          adjustBrightnessContrast(result, brightness, contrast);
        }
        applyFloydSteinbergDither(result, threshold);
        if (invert) {
          for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = 255 - result.data[i];
            result.data[i + 1] = 255 - result.data[i + 1];
            result.data[i + 2] = 255 - result.data[i + 2];
          }
        }

        if (needsUpscale) {
          return resizeNearestNeighbor(result, small.width, small.height);
        }
        return result;
      });

      if (grainAmount > 0) {
        applyGrain(processed, grainAmount);
      }
      return processed;
    };
  }
};
