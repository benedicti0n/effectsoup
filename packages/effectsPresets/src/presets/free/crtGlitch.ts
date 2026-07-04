import {
  applyCrtGlitch,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride } from "../shared.js";

export const crtGlitchPreset: EffectPreset = {
  id: "crtGlitch",
  name: "CRT Glitch",
  description: "Sliced horizontal shifts, RGB separation, and analog scanlines.",
  category: "retroSignal",
  defaultIntensity: 40,
  advancedControlSchema: [
    { id: "sliceHeight", name: "Slice Height", type: "range", min: 2, max: 24, step: 1, defaultValue: 6 },
    { id: "shiftAmount", name: "Shift", type: "range", min: 0, max: 40, step: 1, defaultValue: 10 },
    { id: "rgbShift", name: "RGB Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 3 },
    { id: "scanlineStrength", name: "Scanlines", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "noiseAmount", name: "Noise", type: "range", min: 0, max: 100, step: 1, defaultValue: 15 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    sliceHeight: resolveOverride(overrides, "sliceHeight", Math.max(2, Math.round(18 - (intensity / 100) * 16))),
    shiftAmount: resolveOverride(overrides, "shiftAmount", Math.round((intensity / 100) * 24)),
    rgbShift: resolveOverride(overrides, "rgbShift", Math.round((intensity / 100) * 8)),
    scanlineStrength: resolveOverride(overrides, "scanlineStrength", Math.round((intensity / 100) * 60)),
    noiseAmount: resolveOverride(overrides, "noiseAmount", Math.round((intensity / 100) * 25))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const sliceHeight = (params.sliceHeight as number) ?? 6;
      const shiftAmount = (params.shiftAmount as number) ?? 0;
      const rgbShift = (params.rgbShift as number) ?? 0;
      const scanlineStrength = ((params.scanlineStrength as number) ?? 0) / 100;
      const noiseAmount = ((params.noiseAmount as number) ?? 0) / 100;

      return applyCrtGlitch(source, {
        sliceHeight,
        shiftAmount,
        rgbShift,
        scanlineStrength,
        noiseAmount
      });
    };
  }
};
