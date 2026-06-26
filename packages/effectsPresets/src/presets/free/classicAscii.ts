import {
  ASCII_CHARSET_PRESETS,
  clonePixelBuffer,
  normalizeCustomCharset,
  renderAscii,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  applyAtmosphereAdjustments,
  hexToRgba,
  resolveOverride
} from "../shared.js";

export const classicAsciiPreset: EffectPreset = {
  id: "classicAscii",
  name: "Classic ASCII",
  description: "ASCII image from a dense luminance-to-glyph mapping.",
  category: "asciiSymbols",
  access: "free",
  defaultIntensity: 15,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "characterSet", name: "Character Set", type: "select", options: ["dense", "standard", "technical", "blocks", "minimal", "custom"], defaultValue: "standard" },
    { id: "customCharset", name: "Custom Character Array", type: "text", defaultValue: "" },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["originalColors", "monochrome", "tint"], defaultValue: "originalColors" },
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#ffffff" },
    { id: "backgroundColor", name: "Background", type: "color", defaultValue: "#000000" },
    { id: "inkColor", name: "Ink", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    characterSet: resolveOverride(overrides, "characterSet", "standard"),
    customCharset: resolveOverride(overrides, "customCharset", ""),
    colorMode: resolveOverride(overrides, "colorMode", "originalColors"),
    tintColor: resolveOverride(overrides, "tintColor", "#ffffff"),
    backgroundColor: resolveOverride(overrides, "backgroundColor", "#000000"),
    inkColor: resolveOverride(overrides, "inkColor", "#ffffff"),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const characterSet = (params.characterSet as string) ?? "standard";
      const customCharset = (params.customCharset as string) ?? "";
      const colorMode = (params.colorMode as string) ?? "originalColors";
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ffffff");
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#000000");
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ffffff");

      let charset = ASCII_CHARSET_PRESETS[characterSet] ?? ASCII_CHARSET_PRESETS.standard;
      if (characterSet === "custom") {
        charset = normalizeCustomCharset(customCharset, ASCII_CHARSET_PRESETS.standard);
      }

      const renderColorMode: "monochrome" | "color" | "source" =
        colorMode === "monochrome" ? "monochrome" : colorMode === "tint" ? "color" : "source";
      const renderInkColor = colorMode === "tint" ? tintColor : inkColor;

      const result = renderAscii(source, {
        fontSize,
        inkColor: renderInkColor,
        backgroundColor,
        charset,
        colorMode: renderColorMode
      });
      return applyAtmosphereAdjustments(result, params);
    };
  }
};
