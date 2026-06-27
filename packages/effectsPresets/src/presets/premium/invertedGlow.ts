import {
  applyInvertedGlow,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";

export const invertedGlowPreset: EffectPreset = {
  id: "invertedGlow",
  name: "Inverted Glow",
  description: "Inverted colors with a blue-cyan grade and stacked glow bloom.",
  category: "lightLab",
  access: "premium",
  defaultIntensity: 100,
  usesIntensity: true,
  advancedControlSchema: [],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    glowIntensity: intensity / 100
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);
      const glowIntensity = (params.glowIntensity as number) ?? 1;
      return applyInvertedGlow(source, { intensity: glowIntensity });
    };
  }
};
