import {
  applyGridOverlay,
  clonePixelBuffer,
  resizeNearestNeighbor,
  type PixelBuffer
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  applyAtmosphereAdjustments,
  resolveOverride
} from "../shared.js";

export const pixelGridPreset: EffectPreset = {
  id: "pixelGrid",
  name: "Pixel Grid",
  description: "Deliberate square cells with subtle grid lines while keeping source colors.",
  category: "printGrid",
  access: "free",
  defaultIntensity: 5,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "cellSize", name: "Cell Size", type: "range", min: 4, max: 64, step: 2, defaultValue: 16 },
    { id: "gridOpacity", name: "Grid Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 25 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 4 + Math.round((intensity / 100) * 60)),
    gridOpacity: resolveOverride(overrides, "gridOpacity", Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const cellSize = (params.cellSize as number) ?? 16;
      const gridOpacity = ((params.gridOpacity as number) ?? 0) / 100;

      const smallW = Math.max(1, Math.floor(source.width / cellSize));
      const smallH = Math.max(1, Math.floor(source.height / cellSize));
      // Average down to large cells, then scale back up to keep source-like colors.
      let result = resizeNearestNeighbor(source, smallW, smallH);
      result = resizeNearestNeighbor(result, source.width, source.height);

      result = applyAtmosphereAdjustments(result, params);

      if (gridOpacity > 0) {
        applyGridOverlay(result, { cellSize, opacity: gridOpacity, style: "darken", lineWidth: 1 });
      }

      return result;
    };
  }
};
