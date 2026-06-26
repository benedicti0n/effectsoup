import {
  applyGrain,
  clonePixelBuffer,
  renderHalftoneData,
  type PixelBuffer,
  type RgbaColor
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  resolveOverride
} from "../shared.js";

export const dotHalftonePreset: EffectPreset = {
  id: "dotHalftone",
  name: "Dot Halftone",
  description: "Colored dot halftone inspired by newsprint and Risograph screens.",
  category: "printGrid",
  access: "free",
  defaultIntensity: 21,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "dotSize", name: "Dot Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 12 },
    { id: "dotSpacing", name: "Dot Spacing", type: "range", min: 2, max: 48, step: 1, defaultValue: 6 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["monochrome", "source", "palette"], defaultValue: "source" },
    { id: "palette", name: "Palette", type: "select", options: ["cmyk", "warm", "cool", "mono"], defaultValue: "cmyk" },
    { id: "saturationBoost", name: "Saturation", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    // At the default intensity of 21, dotSize should be 12 and dotSpacing 6.
    dotSize: resolveOverride(overrides, "dotSize", Math.min(32, Math.max(2, Math.round(12 + ((intensity - 21) / 79) * 20)))),
    dotSpacing: resolveOverride(overrides, "dotSpacing", Math.min(48, Math.max(2, Math.round(6 + ((intensity - 21) / 79) * 42)))),
    colorMode: resolveOverride(overrides, "colorMode", "source"),
    palette: resolveOverride(overrides, "palette", "cmyk"),
    saturationBoost: resolveOverride(overrides, "saturationBoost", Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const dotSize = (params.dotSize as number) ?? 12;
      const dotSpacing = (params.dotSpacing as number) ?? 16;
      const colorMode = (params.colorMode as string) ?? "source";
      const paletteName = (params.palette as string) ?? "cmyk";
      const saturationBoost = ((params.saturationBoost as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const palettes: Record<string, RgbaColor[]> = {
        cmyk: [
          [0, 174, 239, 255],
          [236, 0, 140, 255],
          [255, 242, 0, 255],
          [35, 31, 32, 255]
        ],
        warm: [
          [255, 100, 50, 255],
          [255, 200, 80, 255],
          [180, 40, 80, 255],
          [60, 20, 20, 255]
        ],
        cool: [
          [30, 60, 120, 255],
          [80, 180, 220, 255],
          [160, 220, 240, 255],
          [10, 20, 40, 255]
        ],
        mono: [
          [0, 0, 0, 255],
          [100, 100, 100, 255],
          [180, 180, 180, 255],
          [255, 255, 255, 255]
        ]
      };

      const result = renderHalftoneData(source, {
        dotSpacing,
        maxDotSize: dotSize,
        inkColor: [0, 0, 0, 255],
        backgroundColor: [255, 255, 255, 255],
        shape: "circle",
        colorMode: colorMode as "monochrome" | "source" | "palette",
        palette: palettes[paletteName] ?? palettes.cmyk,
        saturationBoost
      });

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};
