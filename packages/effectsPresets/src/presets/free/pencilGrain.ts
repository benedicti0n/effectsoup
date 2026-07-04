import {
  applyPencilGrain,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const pencilGrainPreset: EffectPreset = {
  id: "pencilGrain",
  name: "Pencil Grain",
  description: "Graphite sketch on textured paper with film grain.",
  category: "printPaper",
  defaultIntensity: 60,
  advancedControlSchema: [
    { id: "paperColor", name: "Paper Color", type: "color", defaultValue: "#f5f2eb" },
    { id: "edgeStrength", name: "Edge Strength", type: "range", min: 0, max: 100, step: 1, defaultValue: 70 },
    { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 25 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    paperColor: resolveOverride(overrides, "paperColor", "#f5f2eb"),
    edgeStrength: resolveOverride(overrides, "edgeStrength", Math.round((intensity / 100) * 80)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 40))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const paperColor = hexToRgba((params.paperColor as string) ?? "#f5f2eb");
      const edgeStrength = ((params.edgeStrength as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      return applyPencilGrain(source, {
        paperColor,
        edgeStrength,
        grainAmount
      });
    };
  }
};
