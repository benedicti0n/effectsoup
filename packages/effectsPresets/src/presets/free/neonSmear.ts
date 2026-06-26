import {
  applyNeonSmear,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const neonSmearPreset: EffectPreset = {
  id: "neonSmear",
  name: "Neon Smear",
  description: "Directional light-trail smear with a neon color glow.",
  category: "lightLab",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "angle", name: "Angle", type: "range", min: 0, max: 360, step: 1, defaultValue: 45 },
    { id: "length", name: "Length", type: "range", min: 0, max: 80, step: 1, defaultValue: 24 },
    { id: "color", name: "Neon Color", type: "color", defaultValue: "#ff5c9a" },
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 60, step: 1, defaultValue: 16 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    angle: resolveOverride(overrides, "angle", 45),
    length: resolveOverride(overrides, "length", Math.round((intensity / 100) * 48)),
    color: resolveOverride(overrides, "color", "#ff5c9a"),
    glowRadius: resolveOverride(overrides, "glowRadius", Math.round((intensity / 100) * 24))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const angle = (params.angle as number) ?? 45;
      const length = (params.length as number) ?? 24;
      const color = hexToRgba((params.color as string) ?? "#ff5c9a");
      const glowRadius = (params.glowRadius as number) ?? 16;
      const smearIntensity = params.intensity / 100;

      return applyNeonSmear(source, {
        angle,
        length,
        color,
        intensity: smearIntensity,
        glowRadius
      });
    };
  }
};
