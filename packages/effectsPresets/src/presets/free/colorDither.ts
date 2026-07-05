import {
  applyGrain,
  applyOrderedColorDither,
  clonePixelBuffer,
  adjustBrightnessContrast,
  adjustSaturation,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride } from "../shared.js";

/**
 * Color Dither — cell-based ordered (Bayer 4×4) per-channel dithering.
 *
 * The source is partitioned into a cell grid (`cellSize` × `cellSize`).
 * Each cell's average color is computed; a 4×4 Bayer threshold pattern
 * determines which cells are filled (colored / grayscale) vs left black.
 * The result is scaled back up with nearest-neighbour, producing a clean
 * pixel-print texture that preserves source color relationships and
 * major shapes.
 */
export const colorDitherPreset: EffectPreset = {
  id: "colorDither",
  name: "Color Dither",
  description:
    "Cell-based ordered Bayer dither. Coloured pixel-print texture with visible cell blocks, structured pattern, and source color preservation.",
  category: "pixelDither",
  defaultIntensity: 60,
  advancedControlSchema: [
    { id: "cellSize", name: "Cell Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 8 },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 128 },
    { id: "invert", name: "Invert", type: "boolean", defaultValue: false },
    { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
    { id: "contrast", name: "Contrast", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
    { id: "saturation", name: "Saturation", type: "range", min: -100, max: 100, step: 1, defaultValue: 0 },
    { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 5 },
    { id: "monochrome", name: "Monochrome", type: "boolean", defaultValue: false }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 8),
    threshold: resolveOverride(overrides, "threshold", 100 + Math.round((intensity / 100) * 80)),
    invert: resolveOverride(overrides, "invert", false),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 30)),
    brightness: resolveOverride(overrides, "brightness", Math.round((intensity / 100) * -10)),
    saturation: resolveOverride(overrides, "saturation", 0),
    grainAmount: resolveOverride(overrides, "grainAmount", 5),
    monochrome: resolveOverride(overrides, "monochrome", false)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const cellSize = (params.cellSize as number) ?? 8;
      const threshold = (params.threshold as number) ?? 128;
      const invert = (params.invert as boolean) ?? false;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const saturation = ((params.saturation as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const monochrome = (params.monochrome as boolean) ?? false;

      // Apply tonal adjustments to the source before dithering.
      const adjusted = clonePixelBuffer(source);
      if (saturation !== 0) {
        adjustSaturation(adjusted, saturation);
      }
      if (brightness !== 0 || contrast !== 0) {
        adjustBrightnessContrast(adjusted, brightness, contrast);
      }

      // Cell-based Bayer color dither.
      const dithered = applyOrderedColorDither(adjusted, {
        cellSize,
        threshold,
        invert,
        monochrome
      });

      if (grainAmount > 0) {
        applyGrain(dithered, grainAmount);
      }
      return dithered;
    };
  }
};
