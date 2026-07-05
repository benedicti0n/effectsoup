import {
  applyGrain,
  clonePixelBuffer,
  renderLuminousAsciiBloom,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  resolveOverride
} from "../shared.js";

export const luminousAsciiBloomPreset: EffectPreset = {
  id: "luminousAsciiBloom",
  name: "Luminous ASCII Bloom",
  description: "ASCII characters that glow from bright areas with source-colored light. Customize the character array in the advanced controls.",
  category: "asciiSymbols",
  defaultIntensity: 1,
  advancedControlSchema: [
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 8 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "bloomRadius", name: "Bloom Radius", type: "range", min: 2, max: 24, step: 1, defaultValue: 24 },
    { id: "baseOpacity", name: "Base Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 60 },
    { id: "customCharset", name: "Custom Character Array", type: "text", defaultValue: "" },
    { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 6 },
    { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 5 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 8),
    density: resolveOverride(overrides, "density", 10),
    bloomRadius: resolveOverride(overrides, "bloomRadius", 24),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 60),
    customCharset: resolveOverride(overrides, "customCharset", ""),
    glowAmount: resolveOverride(overrides, "glowAmount", 6),
    grainAmount: resolveOverride(overrides, "grainAmount", 5)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 8;
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 10));
      const bloomRadius = (params.bloomRadius as number) ?? 12;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const baseOpacity = ((params.baseOpacity as number) ?? 60) / 100;
      const customCharset = (params.customCharset as string) ?? "";

      const result = renderLuminousAsciiBloom(source, {
        fontSize,
        density,
        bloomRadius,
        glowAmount,
        baseOpacity,
        customCharset: customCharset.trim().length > 0 ? customCharset : undefined,
        minGlyphLuminance: 0.2
      });

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};
