import {
  normalizeCustomCharset,
  renderSymbolGlow,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  resolveOverride
} from "../shared.js";

export const symbolGlowPreset: EffectPreset = {
  id: "symbolGlow",
  name: "Symbol Glow",
  description: "Glowing symbols over a dreamy blurred image.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 40,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "symbolSet", name: "Symbol Set", type: "select", options: ["bloomSymbols", "softMath", "technical", "minimal", "custom"], defaultValue: "bloomSymbols" },
    { id: "customSymbols", name: "Custom Symbols", type: "text", defaultValue: "" },
    { id: "baseBlur", name: "Base Blur", type: "range", min: 0, max: 32, step: 1, defaultValue: 10 },
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 32, step: 1, defaultValue: 10 },
    { id: "glowIntensity", name: "Glow Intensity", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
    { id: "threshold", name: "Highlight Threshold", type: "range", min: 0, max: 100, step: 1, defaultValue: 55 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["colored", "monochrome"], defaultValue: "colored" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 12),
    symbolSet: resolveOverride(overrides, "symbolSet", "bloomSymbols"),
    customSymbols: resolveOverride(overrides, "customSymbols", ""),
    baseBlur: resolveOverride(overrides, "baseBlur", 10),
    glowRadius: resolveOverride(overrides, "glowRadius", 10),
    glowIntensity: resolveOverride(overrides, "glowIntensity", 50),
    threshold: resolveOverride(overrides, "threshold", 55),
    colorMode: resolveOverride(overrides, "colorMode", "colored"),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const symbolSetName = (params.symbolSet as string) ?? "bloomSymbols";
      const customSymbols = (params.customSymbols as string) ?? "";
      const baseBlur = (params.baseBlur as number) ?? 10;
      const glowRadius = (params.glowRadius as number) ?? 10;
      const glowIntensity = ((params.glowIntensity as number) ?? 50) / 100;
      const threshold = ((params.threshold as number) ?? 55) / 100;
      const colorMode = (params.colorMode as string) ?? "colored";

      const symbolSets: Record<string, string> = {
        bloomSymbols: "2*+/=e",
        softMath: "+-*/=∞∑√",
        technical: "01/\\|<>[]",
        minimal: "·•"
      };
      let symbolSet = symbolSets[symbolSetName] ?? symbolSets.bloomSymbols;
      if (symbolSetName === "custom") {
        symbolSet = normalizeCustomCharset(customSymbols, symbolSets.bloomSymbols);
      }

      return renderSymbolGlow(source, {
        fontSize,
        symbolSet,
        baseBlur,
        glowRadius,
        glowAmount: glowIntensity,
        threshold,
        falloff: 0.35,
        edgeStrength: 0.5,
        colorMode: colorMode === "monochrome" ? "monochrome" : "colored"
      });
    };
  }
};
