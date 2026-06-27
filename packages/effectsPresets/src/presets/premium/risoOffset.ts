import {
  applyDuotone,
  applyGrain,
  applyPosterize,
  applyRgbShift,
  applyTint,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  hexToRgba,
  resolveOverride
} from "../shared.js";

export const risoOffsetPreset: EffectPreset = {
  id: "risoOffset",
  name: "Riso Offset",
  description: "Imperfect risograph-inspired print effect.",
  category: "printPaper",
  access: "premium",
  defaultIntensity: 70,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "channelShift", name: "Channel Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "inkColor", name: "Ink", type: "color", defaultValue: "#ff5c5c" },
    { id: "paperColor", name: "Paper", type: "color", defaultValue: "#000000" },
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#ffffff" },
    { id: "tintAmount", name: "Tint Amount", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    channelShift: resolveOverride(overrides, "channelShift", Math.round((intensity / 100) * 10)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 35)),
    glowAmount: resolveOverride(overrides, "glowAmount", 0),
    inkColor: resolveOverride(overrides, "inkColor", "#ff5c5c"),
    paperColor: resolveOverride(overrides, "paperColor", "#000000"),
    tintColor: resolveOverride(overrides, "tintColor", "#ffffff"),
    tintAmount: resolveOverride(overrides, "tintAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const channelShift = (params.channelShift as number) ?? 0;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ff5c5c");
      const paperColor = hexToRgba((params.paperColor as string) ?? "#fff8e7");
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ffffff");
      const tintAmount = ((params.tintAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      applyPosterize(result, 3);
      applyDuotone(result, paperColor, inkColor);
      if (channelShift > 0) {
        applyRgbShift(result, channelShift);
      }
      if (tintAmount > 0) {
        applyTint(result, tintColor, tintAmount);
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};
