import {
  renderStipple,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const stipplePrintPreset: EffectPreset = {
  id: "stipplePrint",
  name: "Stipple Print",
  description: "Hand-drawn stipple illustration using dot density to model tone.",
  category: "printPaper",
  defaultIntensity: 100,
  usesIntensity: false,
  advancedControlSchema: [
    { id: "dotSize", name: "Dot Size", type: "range", min: 1, max: 8, step: 1, defaultValue: 1 },
    { id: "spacing", name: "Spacing", type: "range", min: 2, max: 32, step: 1, defaultValue: 4 },
    { id: "density", name: "Density", type: "range", min: 0, max: 100, step: 1, defaultValue: 100 },
    { id: "inkColor", name: "Ink Color", type: "color", defaultValue: "#1a1a1a" },
    { id: "paperColor", name: "Paper Color", type: "color", defaultValue: "#f5f2eb" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    dotSize: resolveOverride(overrides, "dotSize", 1),
    spacing: resolveOverride(overrides, "spacing", 4),
    density: resolveOverride(overrides, "density", 100) / 100,
    inkColor: resolveOverride(overrides, "inkColor", "#1a1a1a"),
    paperColor: resolveOverride(overrides, "paperColor", "#f5f2eb")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const dotSize = (params.dotSize as number) ?? 1;
      const spacing = (params.spacing as number) ?? 4;
      const density = (params.density as number) ?? 1;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#1a1a1a");
      const paperColor = hexToRgba((params.paperColor as string) ?? "#f5f2eb");

      return renderStipple(source, {
        dotSize,
        spacing,
        density,
        inkColor,
        backgroundColor: paperColor
      });
    };
  }
};
