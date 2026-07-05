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
 * Colored Cell Dither — cell-based ordered (Bayer 4×4) dither where
 * both active and inactive cells display the source colour (active
 * cells at full brightness, inactive cells dimmed to ~35 %).
 * The result preserves every pixel's hue while the Bayer pattern
 * controls the brightness gradient — like a colour halftone made of
 * solid squares.
 */
export const coloredCellDitherPreset: EffectPreset = {
  id: "coloredCellDither",
  name: "Colored Cell Dither",
  description:
    "Cell-based ordered Bayer dither where every cell is coloured. Active cells show full source colour, inactive cells show a dimmed version — like a colour halftone of solid squares.",
  category: "pixelDither",
  defaultIntensity: 60,
  advancedControlSchema: [
    { id: "cellSize", name: "Cell Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 2 },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 128 },
    { id: "invert", name: "Invert", type: "boolean", defaultValue: false },
    { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
    { id: "contrast", name: "Contrast", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
    { id: "saturation", name: "Saturation", type: "range", min: -100, max: 100, step: 1, defaultValue: 0 },
    { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 5 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 2),
    threshold: resolveOverride(overrides, "threshold", 100 + Math.round((intensity / 100) * 80)),
    invert: resolveOverride(overrides, "invert", false),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 30)),
    brightness: resolveOverride(overrides, "brightness", Math.round((intensity / 100) * -10)),
    saturation: resolveOverride(overrides, "saturation", 0),
    grainAmount: resolveOverride(overrides, "grainAmount", 5)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const cellSize = (params.cellSize as number) ?? 2;
      const threshold = (params.threshold as number) ?? 128;
      const invert = (params.invert as boolean) ?? false;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const saturation = ((params.saturation as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const adjusted = clonePixelBuffer(source);
      if (saturation !== 0) {
        adjustSaturation(adjusted, saturation);
      }
      if (brightness !== 0 || contrast !== 0) {
        adjustBrightnessContrast(adjusted, brightness, contrast);
      }

      const dithered = applyOrderedColorDither(adjusted, {
        cellSize,
        threshold,
        invert,
        monochrome: false,
        coloredInactive: true
      });

      if (grainAmount > 0) {
        applyGrain(dithered, grainAmount);
      }
      return dithered;
    };
  }
};
