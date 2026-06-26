import {
  applyFlowlineGlow,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const flowlineGlowPreset: EffectPreset = {
  id: "flowlineGlow",
  name: "Flowline Glow",
  description: "Painterly flow-field smear mixed with a neon color glow.",
  category: "lightLab",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "scale", name: "Flow Scale", type: "range", min: 8, max: 128, step: 1, defaultValue: 32 },
    { id: "length", name: "Smear Length", type: "range", min: 2, max: 60, step: 1, defaultValue: 16 },
    { id: "color", name: "Glow Color", type: "color", defaultValue: "#ff5c9a" },
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 60, step: 1, defaultValue: 12 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    scale: resolveOverride(overrides, "scale", 32),
    length: resolveOverride(overrides, "length", Math.max(2, Math.round((intensity / 100) * 40))),
    color: resolveOverride(overrides, "color", "#ff5c9a"),
    glowRadius: resolveOverride(overrides, "glowRadius", Math.round((intensity / 100) * 24))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const scale = (params.scale as number) ?? 32;
      const length = (params.length as number) ?? 16;
      const color = hexToRgba((params.color as string) ?? "#ff5c9a");
      const glowRadius = (params.glowRadius as number) ?? 12;
      const glowIntensity = params.intensity / 100;

      return applyFlowlineGlow(source, {
        scale,
        length,
        color,
        intensity: glowIntensity,
        glowRadius
      });
    };
  }
};
