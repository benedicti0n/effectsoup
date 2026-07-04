import {
  ASCII_CHARSET_PRESETS,
  clonePixelBuffer,
  createPixelBuffer,
  normalizeCustomCharset,
  renderAscii,
  type PixelBuffer
} from "@effectsoup/core";
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
  defaultIntensity: 1,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 6 },
    { id: "characterSet", name: "Character Set", type: "select", options: ["dense", "standard", "technical", "blocks", "minimal", "custom"], defaultValue: "standard" },
    { id: "customCharset", name: "Custom Character Array", type: "text", defaultValue: "" },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["originalColors", "monochrome", "tint"], defaultValue: "originalColors" },
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#ffffff" },
    { id: "backgroundColor", name: "Background", type: "color", defaultValue: "#000000" },
    { id: "baseOpacity", name: "Base Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "inkColor", name: "Ink", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6),
    characterSet: resolveOverride(overrides, "characterSet", "standard"),
    customCharset: resolveOverride(overrides, "customCharset", ""),
    colorMode: resolveOverride(overrides, "colorMode", "originalColors"),
    tintColor: resolveOverride(overrides, "tintColor", "#ffffff"),
    backgroundColor: resolveOverride(overrides, "backgroundColor", "#000000"),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 40),
    inkColor: resolveOverride(overrides, "inkColor", "#ffffff"),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 6;
      const characterSet = (params.characterSet as string) ?? "standard";
      const customCharset = (params.customCharset as string) ?? "";
      const colorMode = (params.colorMode as string) ?? "originalColors";
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ffffff");
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#000000");
      const baseOpacity = ((params.baseOpacity as number) ?? 40) / 100;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ffffff");

      let charset = ASCII_CHARSET_PRESETS[characterSet] ?? ASCII_CHARSET_PRESETS.standard;
      if (characterSet === "custom") {
        charset = normalizeCustomCharset(customCharset, ASCII_CHARSET_PRESETS.standard);
      }

      const renderColorMode: "monochrome" | "color" | "source" =
        colorMode === "monochrome" ? "monochrome" : colorMode === "tint" ? "color" : "source";
      const renderInkColor = colorMode === "tint" ? tintColor : inkColor;

      // Build the background layer: solid color or a dimmed copy of the source.
      const { width, height } = source;
      let backgroundLayer: PixelBuffer;
      if (baseOpacity > 0) {
        backgroundLayer = clonePixelBuffer(source);
        for (let i = 0; i < backgroundLayer.data.length; i += 4) {
          backgroundLayer.data[i] = Math.round(backgroundLayer.data[i] * baseOpacity);
          backgroundLayer.data[i + 1] = Math.round(backgroundLayer.data[i + 1] * baseOpacity);
          backgroundLayer.data[i + 2] = Math.round(backgroundLayer.data[i + 2] * baseOpacity);
        }
      } else {
        backgroundLayer = createPixelBuffer(width, height, backgroundColor);
      }

      // Render glyphs from the original source so luminance mapping is not affected by base opacity.
      const glyphLayer = renderAscii(source, {
        fontSize,
        inkColor: renderInkColor,
        backgroundColor: [0, 0, 0, 0],
        charset,
        colorMode: renderColorMode,
        backgroundMode: "transparent"
      });

      const result = clonePixelBuffer(backgroundLayer);
      for (let i = 0; i < result.data.length; i += 4) {
        const alpha = glyphLayer.data[i + 3] / 255;
        if (alpha > 0) {
          for (let c = 0; c < 3; c++) {
            // glyphLayer RGB is already premultiplied by alpha from renderAscii.
            result.data[i + c] = Math.round(
              glyphLayer.data[i + c] + backgroundLayer.data[i + c] * (1 - alpha)
            );
          }
        }
        result.data[i + 3] = 255;
      }

      return applyAtmosphereAdjustments(result, params);
    };
  }
};
