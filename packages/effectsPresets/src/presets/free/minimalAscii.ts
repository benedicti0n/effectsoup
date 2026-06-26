import {
  clonePixelBuffer,
  computeAsciiWeightMap,
  renderAscii,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  applyAtmosphereAdjustments,
  hexToRgba,
  resolveOverride
} from "../shared.js";
import { classicAsciiPreset } from "./classicAscii.js";

export const minimalAsciiPreset: EffectPreset = {
  id: "minimalAscii",
  name: "Minimal ASCII",
  description: "Sparse ASCII image using just a few high-contrast glyphs.",
  category: "asciiSymbols",
  access: "free",
  defaultIntensity: 15,
  advancedControlSchema: classicAsciiPreset.advancedControlSchema,
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    ...classicAsciiPreset.intensityMapper(intensity, overrides),
    advancedOverrides: overrides,
    characterSet: resolveOverride(overrides, "characterSet", "minimal")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const colorMode = (params.colorMode as string) ?? "originalColors";
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ffffff");
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#000000");
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ffffff");

      const renderColorMode: "monochrome" | "color" | "source" =
        colorMode === "monochrome" ? "monochrome" : colorMode === "tint" ? "color" : "source";
      const renderInkColor = colorMode === "tint" ? tintColor : inkColor;

      const weightMap = computeAsciiWeightMap(source, {
        highlightThreshold: 0.6,
        shadowThreshold: 0.35,
        edgeStrength: 0.55,
        shadowStrength: 0.5
      });

      const result = renderAscii(source, {
        fontSize,
        inkColor: renderInkColor,
        backgroundColor,
        charset: "#",
        colorMode: renderColorMode,
        densityMap: weightMap,
        minGlyphLuminance: 0.25
      });
      return applyAtmosphereAdjustments(result, params);
    };
  }
};
