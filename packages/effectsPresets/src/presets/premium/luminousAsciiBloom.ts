import {
  applyGrain,
  clonePixelBuffer,
  renderLuminousAsciiBloom,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  resolveOverride
} from "../shared.js";

export const luminousAsciiBloomPreset: EffectPreset = {
  id: "luminousAsciiBloom",
  name: "Luminous ASCII Bloom",
  description: "ASCII characters that glow from bright areas with source-colored light.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 30,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "bloomRadius", name: "Bloom Radius", type: "range", min: 2, max: 24, step: 1, defaultValue: 12 },
    { id: "baseOpacity", name: "Base Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 10),
    bloomRadius: resolveOverride(overrides, "bloomRadius", 12),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 20),
    glowAmount: resolveOverride(overrides, "glowAmount", 60),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 15))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 10));
      const bloomRadius = (params.bloomRadius as number) ?? 12;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const baseOpacity = ((params.baseOpacity as number) ?? 20) / 100;

      const result = renderLuminousAsciiBloom(source, {
        fontSize,
        density,
        bloomRadius,
        glowAmount,
        baseOpacity,
        minGlyphLuminance: 0.2
      });

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};
