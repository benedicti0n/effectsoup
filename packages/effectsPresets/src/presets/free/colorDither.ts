import {
  applyGrain,
  applyOrderedDither,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride, runAtWorkingResolution } from "../shared.js";

const WORKING_LONGEST = 800;

/**
 * Per-channel 4x4 Bayer ordered dither.
 *
 * Same threshold pattern as `applyOrderedDither` (so the visible
 * structure lines up channel-to-channel), but each color channel is
 * snapped independently so hue and saturation survive at high
 * thresholds. Result: a colorful retro pattern with crisp dot
 * structure that maintains the original color information.
 */
function applyOrderedDitherColor(
  buffer: PixelBuffer,
  threshold: number
): void {
  const { data, width, height } = buffer;
  // 4x4 Bayer threshold map, 0..15. Identical to applyOrderedDither so
  // structure lines up across channels.
  const bayer = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  const step = 255 / 15;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const t = bayer[y % 4][x % 4] * step;
      // Snap each channel around `threshold` using the Bayer offset.
      // value < threshold + t - halfStep -> 0, otherwise 255.
      data[idx] = data[idx] + t < threshold ? 0 : 255;
      data[idx + 1] = data[idx + 1] + t < threshold ? 0 : 255;
      data[idx + 2] = data[idx + 2] + t < threshold ? 0 : 255;
    }
  }
}

/**
 * Color Dither — ordered (Bayer 4x4) per-channel dithering.
 *
 * Pattern is structured rather than organic (no error diffusion), so
 * colors land on deterministic dot shapes while preserving hue and
 * saturation at higher thresholds. Tunable inversion for negative looks.
 */
export const colorDitherPreset: EffectPreset = {
  id: "colorDither",
  name: "Color Dither",
  description:
    "Per-channel 4x4 Bayer ordered dither. Preserves hue and saturation, structured retro dot pattern.",
  category: "pixelDither",
  defaultIntensity: 60,
  advancedControlSchema: [
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
    grainAmount: resolveOverride(overrides, "grainAmount", 5),
    monochrome: resolveOverride(overrides, "monochrome", false)
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
      const monochrome = (params.monochrome as boolean) ?? false;

      const processed = runAtWorkingResolution(source, WORKING_LONGEST, (small) => {
        const result = clonePixelBuffer(small);
        if (saturation !== 0) {
          applySaturationInPlace(result, saturation);
        }
        applyContrastBrightnessInPlace(result, contrast, brightness);
        if (monochrome) {
          applyOrderedDither(result, threshold);
        } else {
          applyOrderedDitherColor(result, threshold);
        }
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
