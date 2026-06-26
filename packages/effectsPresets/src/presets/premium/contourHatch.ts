import {
  applyContourHatch,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const contourHatchPreset: EffectPreset = {
  id: "contourHatch",
  name: "Contour Hatch",
  description: "Gradient-aligned hatching strokes that follow image contours.",
  category: "printLab",
  access: "premium",
  defaultIntensity: 55,
  advancedControlSchema: [
    { id: "lineLength", name: "Line Length", type: "range", min: 2, max: 40, step: 1, defaultValue: 12 },
    { id: "spacing", name: "Spacing", type: "range", min: 2, max: 24, step: 1, defaultValue: 6 },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 30 },
    { id: "inkColor", name: "Ink Color", type: "color", defaultValue: "#1a1a1a" },
    { id: "paperColor", name: "Paper Color", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    lineLength: resolveOverride(overrides, "lineLength", Math.max(2, Math.round((intensity / 100) * 24))),
    spacing: resolveOverride(overrides, "spacing", Math.max(2, Math.round(16 - (intensity / 100) * 10))),
    threshold: resolveOverride(overrides, "threshold", Math.round(80 - (intensity / 100) * 60)),
    inkColor: resolveOverride(overrides, "inkColor", "#1a1a1a"),
    paperColor: resolveOverride(overrides, "paperColor", "#ffffff")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const lineLength = (params.lineLength as number) ?? 12;
      const spacing = (params.spacing as number) ?? 6;
      const threshold = (params.threshold as number) ?? 30;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#1a1a1a");
      const paperColor = hexToRgba((params.paperColor as string) ?? "#ffffff");

      return applyContourHatch(source, {
        lineLength,
        spacing,
        threshold,
        inkColor,
        paperColor
      });
    };
  }
};
