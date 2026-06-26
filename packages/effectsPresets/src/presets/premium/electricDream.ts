import {
  applyElectricDream,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const electricDreamPreset: EffectPreset = {
  id: "electricDream",
  name: "Electric Dream",
  description: "Neon edge outlines with a soft bloom for a synthwave glow.",
  category: "signalLab",
  access: "premium",
  defaultIntensity: 60,
  advancedControlSchema: [
    { id: "edgeStrength", name: "Edge Strength", type: "range", min: 0, max: 100, step: 1, defaultValue: 60 },
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 40, step: 1, defaultValue: 12 },
    { id: "glowAmount", name: "Glow Amount", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
    { id: "neonColor", name: "Neon Color", type: "color", defaultValue: "#00f0ff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    edgeStrength: resolveOverride(overrides, "edgeStrength", Math.round(intensity)),
    glowRadius: resolveOverride(overrides, "glowRadius", Math.max(1, Math.round((intensity / 100) * 20))),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 80)),
    neonColor: resolveOverride(overrides, "neonColor", "#00f0ff")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const edgeStrength = ((params.edgeStrength as number) ?? 0) / 100;
      const glowRadius = (params.glowRadius as number) ?? 12;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const neonColor = hexToRgba((params.neonColor as string) ?? "#00f0ff");

      return applyElectricDream(source, {
        edgeStrength,
        glowRadius,
        glowAmount,
        neonColor
      });
    };
  }
};
