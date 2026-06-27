import {
  applyLedMatrix,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

const shapeOptions = ["circle", "square"];
const colorModeOptions = ["source", "white", "tint"];

export const ledMatrixPreset: EffectPreset = {
  id: "ledMatrix",
  name: "LED Matrix",
  description: "Glowing LED dot matrix with color, white, or tinted dots.",
  category: "lightLab",
  access: "free",
  defaultIntensity: 100,
  usesIntensity: false,
  advancedControlSchema: [
    { id: "cellSize", name: "Cell Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 10 },
    { id: "shape", name: "Shape", type: "select", options: shapeOptions, defaultValue: "circle" },
    { id: "colorMode", name: "Color Mode", type: "select", options: colorModeOptions, defaultValue: "source" },
    { id: "tintColor", name: "Tint Color", type: "color", defaultValue: "#00f0ff" },
    { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 1 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 10),
    shape: resolveOverride(overrides, "shape", "circle"),
    colorMode: resolveOverride(overrides, "colorMode", "source"),
    tintColor: resolveOverride(overrides, "tintColor", "#00f0ff"),
    glowAmount: resolveOverride(overrides, "glowAmount", 1)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const cellSize = (params.cellSize as number) ?? 10;
      const shape = (params.shape as string) ?? "circle";
      const colorMode = (params.colorMode as string) ?? "source";
      const tint = hexToRgba((params.tintColor as string) ?? "#00f0ff");
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;

      return applyLedMatrix(source, {
        cellSize,
        shape: shape as "circle" | "square",
        colorMode: colorMode as "source" | "white" | "tint",
        tint,
        glowAmount
      });
    };
  }
};
