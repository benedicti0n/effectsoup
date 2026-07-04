import {
  applyBoxBlur,
  applyDuotone,
  applyGlow,
  applyGrain,
  blendPixelBuffers,
  clonePixelBuffer,
  type PixelBuffer,
  type RgbaColor
} from "@effectsoup/core";
import type {
  AdvancedControlDefinition,
  EffectPipeline,
  EffectPreset,
  ResolvedPresetParameters
} from "../../types.js";
import { resolveOverride } from "../shared.js";

/**
 * Three-color palette driving Dream Glow's color grade.
 * `glow`      -> tint painted on the bloom / highlight halo.
 * `shadow`    -> soft duotone shadow end.
 * `highlight` -> soft duotone highlight end.
 */
export const dreamGlowPalette = {
  goldenDusk: {
    glow: [255, 180, 80, 255] as RgbaColor,
    shadow: [60, 30, 40, 255] as RgbaColor,
    highlight: [255, 220, 180, 255] as RgbaColor
  },
  roseBloom: {
    glow: [255, 140, 180, 255] as RgbaColor,
    shadow: [60, 20, 40, 255] as RgbaColor,
    highlight: [255, 210, 220, 255] as RgbaColor
  },
  coolHaze: {
    glow: [120, 180, 255, 255] as RgbaColor,
    shadow: [20, 30, 60, 255] as RgbaColor,
    highlight: [200, 230, 255, 255] as RgbaColor
  }
};

/**
 * Standard advanced-control schema shared by Atmosphere-family presets.
 * Brightness / Contrast / Saturation / Grain / Glow, in that order.
 */
const universalAdvancedControls: AdvancedControlDefinition[] = [
  { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "contrast", name: "Contrast", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "saturation", name: "Saturation", type: "range", min: -100, max: 100, step: 1, defaultValue: 0 },
  { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
  { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 }
];

/**
 * Dream Glow.
 *
 * Pipeline (intensity scales blur, glow, and grain together):
 *   1. Full-image BoxBlur of the source at `blurAmount`.
 *   2. Screen-blend that blurry copy over the source at 0.4 * glowAmount.
 *   3. Duotone-grade the bloomed result (clone first) toward shadow and
 *      highlight colors, then soft-blend back at 0.2 + 0.25 * glowAmount.
 *   4. If glowAmount > 0, an additional tinted glow pass at
 *      `blurAmount * 0.75` radius tinted toward palette.glow.
 *   5. Apply grain in-place if grainAmount > 0.
 *
 * At intensity 0 the source is returned as an exact clone.
 */
export const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description: "Soft, hazy, nostalgic image treatment with palette presets.",
  category: "atmosphereGlow",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 20, step: 1, defaultValue: 6 },
    {
      id: "palette",
      name: "Palette",
      type: "select",
      options: ["goldenDusk", "roseBloom", "coolHaze"],
      defaultValue: "goldenDusk"
    }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(
      overrides,
      "blurAmount",
      2 + Math.round((intensity / 100) * 14)
    ),
    glowAmount: resolveOverride(overrides, "glowAmount", intensity),
    grainAmount: resolveOverride(
      overrides,
      "grainAmount",
      Math.round((intensity / 100) * 20)
    ),
    palette: resolveOverride(overrides, "palette", "goldenDusk")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 6;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const paletteName =
        (params.palette as keyof typeof dreamGlowPalette) ?? "goldenDusk";
      const palette =
        dreamGlowPalette[paletteName] ?? dreamGlowPalette.goldenDusk;

      const blur = clonePixelBuffer(source);
      applyBoxBlur(blur, blurAmount);
      let result = blendPixelBuffers(source, blur, "screen", glowAmount * 0.4);

      // Soft color-grade using duotone to keep tonal range intact.
      const graded = clonePixelBuffer(result);
      applyDuotone(graded, palette.shadow, palette.highlight);
      result = blendPixelBuffers(result, graded, "soft", 0.2 + glowAmount * 0.25);

      // Tinted glow on highlights.
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(blurAmount * 0.75)),
          amount: glowAmount * 0.25,
          mode: "soft",
          color: palette.glow
        });
      }

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};
