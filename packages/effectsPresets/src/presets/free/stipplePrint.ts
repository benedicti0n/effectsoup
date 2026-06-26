import {
  renderStipple,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const stipplePrintPreset: EffectPreset = {
  id: "stipplePrint",
  name: "Stipple Print",
  description: "Hand-drawn stipple illustration using dot density to model tone.",
  category: "printLab",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "dotSize", name: "Dot Size", type: "range", min: 1, max: 8, step: 1, defaultValue: 2 },
    { id: "spacing", name: "Spacing", type: "range", min: 4, max: 32, step: 1, defaultValue: 12 },
    { id: "inkColor", name: "Ink Color", type: "color", defaultValue: "#1a1a1a" },
    { id: "paperColor", name: "Paper Color", type: "color", defaultValue: "#f5f2eb" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    dotSize: resolveOverride(overrides, "dotSize", 2),
    spacing: resolveOverride(overrides, "spacing", Math.max(4, Math.round(32 - (intensity / 100) * 20))),
    density: intensity / 100,
    inkColor: resolveOverride(overrides, "inkColor", "#1a1a1a"),
    paperColor: resolveOverride(overrides, "paperColor", "#f5f2eb")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const dotSize = (params.dotSize as number) ?? 2;
      const spacing = (params.spacing as number) ?? 12;
      const density = (params.density as number) ?? 0.5;
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
