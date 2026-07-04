import {
  applyFloydSteinbergColorDither,
  applyGrain,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride, runAtWorkingResolution } from "../shared.js";

const WORKING_LONGEST = 800;

export const colorDitherPreset: EffectPreset = {
  id: "colorDither",
  name: "Color Dither",
  description: "Per-channel Floyd–Steinberg error diffusion dither, preserves hue and saturation.",
  category: "pixelDither",
  defaultIntensity: 60,
  advancedControlSchema: [
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
    threshold: resolveOverride(
      overrides,
      "threshold",
      100 + Math.round((intensity / 100) * 80)
    ),
    invert: resolveOverride(overrides, "invert", false),
    contrast: resolveOverride(
      overrides,
      "contrast",
      Math.round((intensity / 100) * 30)
    ),
    brightness: resolveOverride(
      overrides,
      "brightness",
      Math.round((intensity / 100) * -10)
    ),
    saturation: resolveOverride(overrides, "saturation", 0),
    grainAmount: resolveOverride(
      overrides,
      "grainAmount",
      5
    )
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const threshold = (params.threshold as number) ?? 128;
      const invert = (params.invert as boolean) ?? false;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const saturation = ((params.saturation as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const processed = runAtWorkingResolution(source, WORKING_LONGEST, (small) => {
        const result = clonePixelBuffer(small);
        if (saturation !== 0) {
          applySaturationInPlace(result, saturation);
        }
        applyContrastBrightnessInPlace(result, contrast, brightness);
        applyFloydSteinbergColorDither(result, threshold);
        if (invert) {
          for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = 255 - result.data[i];
            result.data[i + 1] = 255 - result.data[i + 1];
            result.data[i + 2] = 255 - result.data[i + 2];
          }
        }
        return result;
      });

      if (grainAmount > 0) {
        applyGrain(processed, grainAmount);
      }
      return processed;
    };
  }
};

function applySaturationInPlace(buffer: PixelBuffer, saturation: number): void {
  if (saturation === 0) return;
  const { data } = buffer;
  const factor = 1 + saturation;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    data[i] = clamp255(luminance + (r - luminance) * factor);
    data[i + 1] = clamp255(luminance + (g - luminance) * factor);
    data[i + 2] = clamp255(luminance + (b - luminance) * factor);
  }
}

function applyContrastBrightnessInPlace(
  buffer: PixelBuffer,
  contrast: number,
  brightness: number
): void {
  const { data } = buffer;
  const contrastFactor = (1 + contrast) * (1 + contrast);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = data[i + c] + brightness;
      value = (value - 128) * contrastFactor + 128;
      data[i + c] = clamp255(value);
    }
  }
}

function clamp255(value: number): number {
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return Math.round(value);
}
