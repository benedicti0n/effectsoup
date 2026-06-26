import {
  applyBitmap,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride } from "../shared.js";

export const bitmapPreset: EffectPreset = {
  id: "bitmap",
  name: "Bitmap",
  description: "Heavy pixelation with palette reduction for a retro 8-bit look.",
  category: "printLab",
  access: "premium",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "pixelSize", name: "Pixel Size", type: "range", min: 2, max: 64, step: 1, defaultValue: 12 },
    { id: "colorLevels", name: "Color Levels", type: "range", min: 2, max: 32, step: 1, defaultValue: 8 },
    { id: "ditherThreshold", name: "Dither Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 0 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    pixelSize: resolveOverride(overrides, "pixelSize", Math.max(2, Math.round(32 - (intensity / 100) * 28))),
    colorLevels: resolveOverride(overrides, "colorLevels", Math.max(2, Math.round(2 + (intensity / 100) * 22))),
    ditherThreshold: resolveOverride(overrides, "ditherThreshold", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const pixelSize = (params.pixelSize as number) ?? 12;
      const colorLevels = (params.colorLevels as number) ?? 8;
      const ditherThreshold = (params.ditherThreshold as number) ?? 0;

      return applyBitmap(source, {
        pixelSize,
        colorLevels,
        ditherThreshold: ditherThreshold > 0 ? ditherThreshold : undefined
      });
    };
  }
};
