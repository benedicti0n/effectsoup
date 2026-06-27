import {
  normalizeCustomCharset,
  renderSymbolGlow,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride } from "../shared.js";

export const symbolGlowPreset: EffectPreset = {
  id: "symbolGlow",
  name: "Symbol Glow",
  description: "Luminous ASCII symbols over a soft blurred image.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 1,
  advancedControlSchema: [
    { id: "cellSize", name: "Cell Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 6 },
    { id: "blur", name: "Background Blur", type: "range", min: 0, max: 24, step: 1, defaultValue: 5 },
    { id: "brightness", name: "Brightness", type: "range", min: 0.5, max: 2, step: 0.05, defaultValue: 0.5 },
    { id: "colorBoost", name: "Color Boost", type: "range", min: 0, max: 120, step: 1, defaultValue: 120 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["colored", "monochrome"], defaultValue: "colored" },
    { id: "symbolSet", name: "Symbol Set", type: "select", options: ["bloomSymbols", "softMath", "technical", "minimal", "custom"], defaultValue: "bloomSymbols" },
    { id: "customSymbols", name: "Custom Symbols", type: "text", defaultValue: "" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 6),
    blur: resolveOverride(overrides, "blur", 5),
    brightness: resolveOverride(overrides, "brightness", 0.5),
    colorBoost: resolveOverride(overrides, "colorBoost", 120),
    colorMode: resolveOverride(overrides, "colorMode", "colored"),
    symbolSet: resolveOverride(overrides, "symbolSet", "bloomSymbols"),
    customSymbols: resolveOverride(overrides, "customSymbols", "")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const cellSize = (params.cellSize as number) ?? 6;
      const blur = (params.blur as number) ?? 5;
      const brightness = (params.brightness as number) ?? 0.5;
      const colorBoost = (params.colorBoost as number) ?? 120;
      const colorMode = (params.colorMode as string) ?? "colored";
      const symbolSetName = (params.symbolSet as string) ?? "bloomSymbols";
      const customSymbols = (params.customSymbols as string) ?? "";

      const symbolSets: Record<string, string> = {
        bloomSymbols: " .e/+*=2",
        softMath: " .:-=+*#%@",
        technical: " .-/\\|[]=",
        minimal: " .·•"
      };
      let charset = symbolSets[symbolSetName] ?? symbolSets.bloomSymbols;
      if (symbolSetName === "custom") {
        charset = normalizeCustomCharset(customSymbols, symbolSets.bloomSymbols);
      }

      return renderSymbolGlow(source, {
        cellSize,
        blur,
        brightness,
        charset,
        colorBoost,
        colorMode: colorMode === "monochrome" ? "monochrome" : "colored"
      });
    };
  }
};
