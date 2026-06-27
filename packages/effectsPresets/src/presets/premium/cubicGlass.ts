import {
  applyCubicGlass,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  resolveOverride
} from "../shared.js";

export const cubicGlassPreset: EffectPreset = {
  id: "cubicGlass",
  name: "Cubic Glass",
  description: "Frosted translucent cubic tiles refracting the image beneath a soft glass grid.",
  category: "glassFrost",
  access: "premium",
  defaultIntensity: 40,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "tileSize", name: "Tile Size", type: "range", min: 4, max: 64, step: 1, defaultValue: 16 },
    { id: "distortion", name: "Distortion", type: "range", min: 0, max: 32, step: 1, defaultValue: 4 },
    { id: "frost", name: "Frost", type: "range", min: 0, max: 100, step: 1, defaultValue: 60 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    tileSize: resolveOverride(overrides, "tileSize", 4 + Math.round((intensity / 100) * 60)),
    distortion: resolveOverride(overrides, "distortion", Math.round((intensity / 100) * 16)),
    frost: resolveOverride(overrides, "frost", 40 + Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const tileSize = Math.max(1, (params.tileSize as number) ?? 16);
      const distortion = (params.distortion as number) ?? 0;
      const frost = ((params.frost as number) ?? 60) / 100;

      return applyCubicGlass(source, tileSize, distortion, frost);
    };
  }
};
