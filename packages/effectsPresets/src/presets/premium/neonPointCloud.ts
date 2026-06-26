import {
  applyNeonPointCloud,
  blendPixelBuffers,
  clonePixelBuffer,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const neonPointCloudPreset: EffectPreset = {
  id: "neonPointCloud",
  name: "Neon Point Cloud",
  description: "Constellation of bright points connected by neon lines.",
  category: "lightLab",
  access: "premium",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "threshold", name: "Brightness Threshold", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "density", name: "Density", type: "range", min: 1, max: 100, step: 1, defaultValue: 25 },
    { id: "pointSize", name: "Point Size", type: "range", min: 1, max: 10, step: 1, defaultValue: 3 },
    { id: "color", name: "Neon Color", type: "color", defaultValue: "#00f0ff" },
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 60, step: 1, defaultValue: 16 },
    { id: "connectRadius", name: "Connect Radius", type: "range", min: 5, max: 120, step: 1, defaultValue: 40 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    threshold: resolveOverride(overrides, "threshold", Math.round(60 - (intensity / 100) * 40)) / 100,
    density: resolveOverride(overrides, "density", Math.round(10 + (intensity / 100) * 60)),
    pointSize: resolveOverride(overrides, "pointSize", 3),
    color: resolveOverride(overrides, "color", "#00f0ff"),
    glowRadius: resolveOverride(overrides, "glowRadius", Math.round((intensity / 100) * 32)),
    connectRadius: resolveOverride(overrides, "connectRadius", Math.round(20 + (intensity / 100) * 80))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const threshold = (params.threshold as number) ?? 0.4;
      const density = (params.density as number) ?? 25;
      const pointSize = (params.pointSize as number) ?? 3;
      const color = hexToRgba((params.color as string) ?? "#00f0ff");
      const glowRadius = (params.glowRadius as number) ?? 16;
      const connectRadius = (params.connectRadius as number) ?? 40;
      const blendAmount = params.intensity / 100;

      const cloud = applyNeonPointCloud(source, {
        threshold,
        density,
        pointSize,
        color,
        glowRadius,
        connectRadius
      });

      return blendPixelBuffers(source, cloud, "screen", blendAmount);
    };
  }
};
