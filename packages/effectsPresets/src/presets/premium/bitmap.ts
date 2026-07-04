import {
  applyBitmap,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride, runAtWorkingResolution } from "../shared.js";

const WORKING_LONGEST = 800;

export const bitmapPreset: EffectPreset = {
  id: "bitmap",
  name: "Bitmap",
  description: "Heavy pixelation with palette reduction for a retro 8-bit look.",
  category: "pixelDither",
  defaultIntensity: 100,
  usesIntensity: false,
  advancedControlSchema: [
    { id: "pixelSize", name: "Pixel Size", type: "range", min: 2, max: 64, step: 1, defaultValue: 2 },
    { id: "colorLevels", name: "Color Levels", type: "range", min: 2, max: 32, step: 1, defaultValue: 32 },
    { id: "ditherThreshold", name: "Dither Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 200 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    pixelSize: resolveOverride(overrides, "pixelSize", 2),
    colorLevels: resolveOverride(overrides, "colorLevels", 32),
    ditherThreshold: resolveOverride(overrides, "ditherThreshold", 200)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const pixelSize = (params.pixelSize as number) ?? 2;
      const colorLevels = (params.colorLevels as number) ?? 32;
      const ditherThreshold = (params.ditherThreshold as number) ?? 200;

      return runAtWorkingResolution(source, WORKING_LONGEST, (small) =>
        applyBitmap(small, {
          pixelSize,
          colorLevels,
          ditherThreshold: ditherThreshold > 0 ? ditherThreshold : undefined
        })
      );
    };
  }
};
