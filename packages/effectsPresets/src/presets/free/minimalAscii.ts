import {
  clonePixelBuffer,
  computeAsciiWeightMap,
  createPixelBuffer,
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
  defaultIntensity: 1,
  advancedControlSchema: [
    ...classicAsciiPreset.advancedControlSchema,
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 2 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    ...classicAsciiPreset.intensityMapper(intensity, overrides),
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6),
    characterSet: resolveOverride(overrides, "characterSet", "minimal"),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 40),
    density: resolveOverride(overrides, "density", 2),
    grainAmount: resolveOverride(overrides, "grainAmount", 5),
    glowAmount: resolveOverride(overrides, "glowAmount", 100)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 6;
      const colorMode = (params.colorMode as string) ?? "originalColors";
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ffffff");
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#000000");
      const baseOpacity = ((params.baseOpacity as number) ?? 40) / 100;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ffffff");
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 2));

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

      const weightMap = computeAsciiWeightMap(source, {
        highlightThreshold: 0.6,
        shadowThreshold: 0.35,
        edgeStrength: 0.55,
        shadowStrength: 0.5
      });

      // Density scales how much of the weight map passes through as glyph placement.
      const densityScale = density / 2;
      for (let i = 0; i < weightMap.data.length; i += 4) {
        const v = Math.min(255, Math.round(weightMap.data[i] * densityScale));
        weightMap.data[i] = v;
        weightMap.data[i + 1] = v;
        weightMap.data[i + 2] = v;
      }

      // Render glyphs from the original source so luminance mapping is not affected by base opacity.
      const glyphLayer = renderAscii(source, {
        fontSize,
        inkColor: renderInkColor,
        backgroundColor: [0, 0, 0, 0],
        charset: "#",
        colorMode: renderColorMode,
        densityMap: weightMap,
        minGlyphLuminance: 0.25,
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
