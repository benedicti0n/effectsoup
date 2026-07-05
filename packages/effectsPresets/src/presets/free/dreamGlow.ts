import {
  applyBoxBlur,
  applyDuotone,
  applyGrain,
  blendPixelBuffers,
  clonePixelBuffer,
  extractHighlightMask,
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
 *
 * `goldenDusk` is the reference. The shadow is a deep cinematic indigo
 * so shadows read as "rich violet", not muddy maroon.
 */
export const dreamGlowPalette = {
  goldenDusk: {
    glow: [255, 175, 110, 255] as RgbaColor,
    shadow: [30, 25, 80, 255] as RgbaColor,
    highlight: [255, 200, 160, 255] as RgbaColor
  },
  roseBloom: {
    glow: [255, 165, 180, 255] as RgbaColor,
    shadow: [55, 25, 70, 255] as RgbaColor,
    highlight: [255, 200, 210, 255] as RgbaColor
  },
  coolHaze: {
    glow: [170, 200, 255, 255] as RgbaColor,
    shadow: [25, 30, 80, 255] as RgbaColor,
    highlight: [205, 220, 255, 255] as RgbaColor
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
 * Luminance thresholds + knee widths for the three bloom bands.
 *
 * Tight (small radius, near-white only)   -> eye highlights, specular
 *                                          edges, lash tips.
 * Medium (mid radius, warm mid-brights)     -> warm skin, broad orange
 *                                          regions, rim light.
 * Wide (large radius, soft lower threshold)-> atmospheric spread
 *                                          around large lit regions.
 *
 * The medium threshold is deliberately below 0.5 so warm mid-bright
 * pixels (orange skin, midtone bloom) participate in the bloom rather
 * than only the brightest highlights.
 */
const BAND_THRESHOLDS = {
  tight: 0.7,
  tightKnee: 0.15,
  medium: 0.45,
  mediumKnee: 0.3,
  wide: 0.25,
  wideKnee: 0.35
} as const;

/**
 * Tint a grayscale highlight mask buffer (R=G=B=mask byte) by
 * multiplying each channel by the palette glow color. Mask byte 0
 * collapses to zero contribution; mask byte 255 produces the full
 * glow color. This keeps the bloom contribution strictly local: dark
 * pixels never receive any bloom no matter what.
 */
function tintMaskWithGlow(buf: PixelBuffer, glow: RgbaColor): void {
  const data = buf.data;
  const gr = glow[0];
  const gg = glow[1];
  const gb = glow[2];
  for (let i = 0; i < data.length; i += 4) {
    const m = data[i] / 255;
    data[i] = m * gr;
    data[i + 1] = m * gg;
    data[i + 2] = m * gb;
  }
}

/**
 * Dream Glow.
 *
 * Multi-band selective highlight bloom. The source itself is never
 * blurred; only luminance-masked copies of it are. Intensity scales
 * blur radius, glow strength, and grain together; the Glow slider
 * controls only the bloom energy.
 *
 * Pipeline:
 *   1. Extract three luminance masks at increasing knee widths:
 *        - tight:   threshold 0.70, knee 0.15  (highlights only)
 *        - medium:  threshold 0.45, knee 0.30  (warm mid-brights)
 *        - wide:    threshold 0.25, knee 0.35  (atmospheric spread)
 *   2. Blur each mask at a radius proportional to `blurAmount`:
 *        - tight   = max(1, round(blurAmount * 0.15))
 *        - medium  = max(2, round(blurAmount * 0.45))
 *        - wide    = max(4, round(blurAmount * 0.90))
 *   3. Tint each blurred mask with palette.glow. The mask byte
 *      multiplies the glow color so dark regions contribute 0.
 *   4. Screen-blend the three bands over the source at calibrated
 *      strengths: 0.90 / 0.70 / 0.55 of `glowAmount`. Orange-lit skin
 *      (lum ~0.5) participates via the medium band; bright highlights
 *      get the tight band on top.
 *   5. Duotone-grade the bloomed result toward palette.shadow +
 *      palette.highlight via `soft` blend.
 *   6. Selective final diffusion in lit areas: a lightly blurred
 *      copy of the graded result is masked to mid-brights and
 *      screen-blended back, so the orange beam feels incandescent
 *      without globally softening the image.
 *   7. Apply restrained grain in-place.
 *
 * At intensity 0 the source is returned as an exact clone.
 */
export const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description:
    "Multi-band selective highlight bloom. Tight halo on eye highlights, warm bloom on skin, atmospheric spread from large lit regions; deep cinematic indigo shadows.",
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
      2 + Math.round((intensity / 100) * 18)
    ),
    glowAmount: resolveOverride(overrides, "glowAmount", intensity),
    grainAmount: resolveOverride(
      overrides,
      "grainAmount",
      Math.round((intensity / 100) * 12)
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

      let result: PixelBuffer = source;

      if (glowAmount > 0) {
        // 1+2. Three luminance-keyed highlight masks, each blurred at
        //    a radius proportional to blurAmount.
        const tightMask = extractHighlightMask(source, {
          threshold: BAND_THRESHOLDS.tight,
          knee: BAND_THRESHOLDS.tightKnee,
          intensity: 1
        });
        const mediumMask = extractHighlightMask(source, {
          threshold: BAND_THRESHOLDS.medium,
          knee: BAND_THRESHOLDS.mediumKnee,
          intensity: 1
        });
        const wideMask = extractHighlightMask(source, {
          threshold: BAND_THRESHOLDS.wide,
          knee: BAND_THRESHOLDS.wideKnee,
          intensity: 1
        });

        const tightRadius = Math.max(1, Math.round(blurAmount * 0.15));
        const mediumRadius = Math.max(2, Math.round(blurAmount * 0.45));
        const wideRadius = Math.max(4, Math.round(blurAmount * 0.9));
        applyBoxBlur(tightMask, tightRadius);
        applyBoxBlur(mediumMask, mediumRadius);
        applyBoxBlur(wideMask, wideRadius);

        // 3. Tint each blurred mask with palette.glow. Mask byte
        //    multiplies the glow color: 0 -> 0, 255 -> glowColor.
        tintMaskWithGlow(tightMask, palette.glow);
        tintMaskWithGlow(mediumMask, palette.glow);
        tintMaskWithGlow(wideMask, palette.glow);

        // 4. Screen-blend the three bands over the source.
        //    Calibrated strengths so Glow 100 produces a clearly
        //    multi-scale bloom while Glow 0 produces nothing.
        result = blendPixelBuffers(result, tightMask, "screen", glowAmount * 0.9);
        result = blendPixelBuffers(result, mediumMask, "screen", glowAmount * 0.7);
        result = blendPixelBuffers(result, wideMask, "screen", glowAmount * 0.55);
      }

      // 5. Duotone grade (clone first) + soft blend. Pulls shadows
      //    toward palette.shadow, highlights toward palette.highlight.
      const graded = clonePixelBuffer(result);
      applyDuotone(graded, palette.shadow, palette.highlight);
      result = blendPixelBuffers(result, graded, "soft", 0.16 + glowAmount * 0.2);

      // 6. Selective final diffusion in illuminated areas. A lightly
      //    blurred copy of the graded result is masked to lit regions
      //    (medium-band threshold) and screen-blended back, giving the
      //    orange beam a soft incandescent halo without globally
      //    softening the image.
      if (glowAmount > 0) {
        const soft = clonePixelBuffer(result);
        applyBoxBlur(soft, Math.max(1, Math.round(blurAmount * 0.25)));
        const diffusionMask = extractHighlightMask(source, {
          threshold: BAND_THRESHOLDS.medium,
          knee: BAND_THRESHOLDS.mediumKnee,
          intensity: 1
        });
        const dm = diffusionMask.data;
        const sd = soft.data;
        for (let i = 0; i < sd.length; i += 4) {
          const m = dm[i] / 255;
          sd[i] *= m;
          sd[i + 1] *= m;
          sd[i + 2] *= m;
        }
        result = blendPixelBuffers(result, soft, "screen", glowAmount * 0.2);
      }

      // 7. Restrained film grain. Dark regions get slightly more grain
      //    than highlights due to applyGrain's inverse-luminance
      //    modulation; the small default keeps it cinematic rather than
      //    digital.
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }

      return result;
    };
  }
};
