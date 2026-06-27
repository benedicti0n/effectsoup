import {
  adjustBrightnessContrast,
  applyDuotone,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  applyAtmosphereAdjustments,
  atmosphereAdvancedControls,
  hexToRgba,
  resolveOverride
} from "../shared.js";

export const duotonePreset: EffectPreset = {
  id: "duotone",
  name: "Duotone",
  description: "High-impact two-color palette mapping.",
  category: "atmosphereGlow",
  access: "free",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "shadowColor", name: "Shadow", type: "color", defaultValue: "#000000" },
    { id: "highlightColor", name: "Highlight", type: "color", defaultValue: "#ff006e" },
    { id: "contrast", name: "Contrast", type: "range", min: 0, max: 100, step: 1, defaultValue: 30 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    shadowColor: resolveOverride(overrides, "shadowColor", "#000000"),
    highlightColor: resolveOverride(overrides, "highlightColor", "#ff006e"),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 50)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const shadowColor = hexToRgba((params.shadowColor as string) ?? "#1a0b2e");
      const highlightColor = hexToRgba((params.highlightColor as string) ?? "#ff006e");
      const contrast = ((params.contrast as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      if (contrast > 0) {
        adjustBrightnessContrast(result, 0, contrast);
      }
      applyDuotone(result, shadowColor, highlightColor);
      return applyAtmosphereAdjustments(result, params);
    };
  }
};
