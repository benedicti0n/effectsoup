import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyBoxBlur,
  applyDuotone,
  applyGrain,
  applyHeadroomBloom,
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
 * `glow`      -> tint painted on the bloom / highlight halo. Use a
 *                SATURATED color so screen-blending the bloom layer
 *                over a warm-orange highlight lifts G and B only
 *                modestly, keeping the warm chroma instead of bleaching
 *                to white.
 * `shadow`    -> soft duotone shadow end.
 * `highlight` -> soft duotone highlight end. Saturated peach rather
 *                than cream so the duotone reinforces warm chroma in
 *                lit regions rather than neutralizing it.
 *
 * `goldenDusk` is the reference. The shadow is a deep cinematic indigo
 * so shadows read as "rich violet", not muddy maroon.
 */
export const dreamGlowPalette = {
  goldenDusk: {
    glow: [255, 130, 60, 255] as RgbaColor,
    shadow: [30, 25, 80, 255] as RgbaColor,
    highlight: [255, 170, 100, 255] as RgbaColor
  },
  roseBloom: {
    glow: [255, 130, 140, 255] as RgbaColor,
    shadow: [55, 25, 70, 255] as RgbaColor,
    highlight: [255, 170, 170, 255] as RgbaColor
  },
  coolHaze: {
    glow: [140, 170, 240, 255] as RgbaColor,
    shadow: [25, 30, 80, 255] as RgbaColor,
    highlight: [160, 200, 255, 255] as RgbaColor
  }
};

/**
 * Standard advanced-control schema shared by Atmosphere-family presets.
 * Brightness / Contrast / Saturation / Grain / Glow, in that order.
 */
const universalAdvancedControls: AdvancedControlDefinition[] = [
  { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "contrast", name: "Contrast", type: "range", min: -50, max: 50, step: 1, defaultValue: 5 },
  { id: "saturation", name: "Saturation", type: "range", min: -100, max: 100, step: 1, defaultValue: 30 },
  { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
  { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 100 }
];

/**
 * Luminance thresholds + knee widths for the three bloom bands.
 *
 * Tight   (small radius, near-white only)  -> eye highlights,
 *                                            specular, lash tips.
 * Medium  (mid radius, warm mid-brights)    -> warm skin, broad
 *                                            orange regions, rim light.
 * Wide    (large radius, soft lower threshold)-> atmospheric spread
 *                                            from large lit regions.
 */
const BAND_THRESHOLDS = {
  tight: 0.7,
  tightKnee: 0.15,
  medium: 0.45,
  mediumKnee: 0.3,
  wide: 0.25,
  wideKnee: 0.35
} as const;

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
 * Apply brightness/contrast/saturation from the universal advanced
 * controls to the source. Called once at the start of the pipeline so
 * the bloom and duotone operate on the user-tuned base image.
 */
function applyBaseAdjustments(
  buf: PixelBuffer,
  brightness: number,
  contrast: number,
  saturation: number
): void {
  if (brightness !== 0 || contrast !== 0) {
    adjustBrightnessContrast(buf, brightness, contrast);
  }
  if (saturation !== 0) {
    adjustSaturation(buf, saturation);
  }
}

/**
 * Dream Glow.
 *
 * Multi-band selective highlight bloom + cinematic split-tone. The
 * source itself is never blurred; only luminance-masked copies of it
 * are. Intensity scales blur radius, glow strength, and grain
 * together; the Glow slider controls only the bloom energy.
 *
 * The three key tuning choices that prevent the previous "pale white
 * bleach" and make the result more colorful:
 *
 *   1. The bloom tint is a SATURATED warm color (255, 130, 60 for
 *      goldenDusk). Headroom-additive composite on a warm source lifts
 *      G and B only modestly and zero on R, so highlights stay warm
 *      rather than bleaching.
 *   2. A three-band bloom (tight + medium + wide) layered at
 *      different radii gives a true dream-like bloom: tight halos
 *      around eye highlights, a visible warm halo around the orange
 *      beam, and a soft atmospheric spread around large lit regions.
 *   3. The duotone amount is small (max 0.25 at glow=1) so the
 *      bloom's chroma dominates the final look.
 *
 *   1. Apply the universal brightness/contrast/saturation from the
 *      user-set advanced overrides. This is the "color enrichment"
 *      entry point — user-set Saturation > 0 makes the result
 *      noticeably more vivid.
 *   2. Extract three luminance masks at increasing knee widths.
 *   3. Blur each mask at a radius proportional to `blurAmount`.
 *   4. Tint each blurred mask with palette.glow.
 *   5. Headroom-additive composite the three bands.
 *   6. Duotone grade + soft blend. Small amount so the bloom's
 *      chroma dominates the final look.
 *   7. Selective final diffusion in lit areas.
 *   8. Restrained film grain.
 *
 * At intensity 0 the source is returned as an exact clone.
 */
export const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description:
    "Multi-band selective highlight bloom with a saturated warm tint that preserves orange chroma in highlights. Color-enrich + selective saturation in lit areas. Tight halo on eye highlights, warm bloom on skin, atmospheric spread from large lit regions; deep cinematic indigo shadows.",
  category: "atmosphereGlow",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 20, step: 1, defaultValue: 20 },
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
    blurAmount: resolveOverride(overrides, "blurAmount", 20),
    glowAmount: resolveOverride(overrides, "glowAmount", 100),
    grainAmount: resolveOverride(overrides, "grainAmount", 20),
    palette: resolveOverride(overrides, "palette", "goldenDusk"),
    brightness: resolveOverride(overrides, "brightness", 0),
    contrast: resolveOverride(overrides, "contrast", 5),
    saturation: resolveOverride(overrides, "saturation", 30)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 6;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const saturation = ((params.saturation as number) ?? 0) / 100;
      const paletteName =
        (params.palette as keyof typeof dreamGlowPalette) ?? "goldenDusk";
      const palette =
        dreamGlowPalette[paletteName] ?? dreamGlowPalette.goldenDusk;

      // 1. Apply the universal brightness/contrast/saturation from the
      //    user-set advanced overrides. We work on a clone so the source
      //    buffer (passed by the worker) is never mutated.
      const base = clonePixelBuffer(source);
      applyBaseAdjustments(base, brightness, contrast, saturation);

      let result: PixelBuffer = base;

      if (glowAmount > 0) {
        // 2+3. Three luminance-keyed highlight masks, each blurred at
        //    a radius proportional to blurAmount. The medium band has
        //    a deliberately low threshold (0.45) and a wide knee
        //    (0.30) so warm mid-brights (orange skin, lum ~0.5)
        //    participate strongly.
        const tightMask = extractHighlightMask(base, {
          threshold: BAND_THRESHOLDS.tight,
          knee: BAND_THRESHOLDS.tightKnee,
          intensity: 1
        });
        const mediumMask = extractHighlightMask(base, {
          threshold: BAND_THRESHOLDS.medium,
          knee: BAND_THRESHOLDS.mediumKnee,
          intensity: 1
        });
        const wideMask = extractHighlightMask(base, {
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

        // 4. Tint each blurred mask with palette.glow. The mask byte
        //    multiplies the glow color: 0 -> 0, 255 -> full glow color.
        //    The glow color is SATURATED warm so the lift on already-bright
        //    warm pixels keeps their chroma.
        tintMaskWithGlow(tightMask, palette.glow);
        tintMaskWithGlow(mediumMask, palette.glow);
        tintMaskWithGlow(wideMask, palette.glow);

        // 5. Headroom-additive composite the three bands. The bloom
        //    adds energy only where the source has headroom in each
        //    channel, so bright channels (R at 255 for an orange beam)
        //    receive zero contribution and preserve the highlight
        //    chroma. The three-band composite is the primary color-
        //    enrich path: a saturated orange bloom (255, 130, 60) over
        //    a peach-orange source (255, 175, 110) lifts G only from
        //    175 to ~233 and B from 110 to ~187 (headroom-limited), so
        //    the result reads as a richer, more saturated orange — not
        //    a 255/255/255 whiteout.
        result = applyHeadroomBloom(result, tightMask, {
          amount: glowAmount * 0.9
        });
        result = applyHeadroomBloom(result, mediumMask, {
          amount: glowAmount * 0.7
        });
        result = applyHeadroomBloom(result, wideMask, {
          amount: glowAmount * 0.45
        });
      }

      // 8. Duotone grade (clone first) + soft blend. Small amount so
      //    the bloom's chroma dominates. The highlight color is
      //    saturated peach (255, 170, 100) so pulling toward highlight
      //    reinforces warm chroma rather than diluting it.
      const graded = clonePixelBuffer(result);
      applyDuotone(graded, palette.shadow, palette.highlight);
      result = blendPixelBuffers(
        result,
        graded,
        "soft",
        0.10 + glowAmount * 0.15
      );

      // 9. Selective final diffusion in illuminated areas. A lightly
      //    blurred copy of the graded result is masked to lit regions
      //    (medium-band threshold) and screen-blended back, giving the
      //    orange beam a soft incandescent halo without globally
      //    softening the image.
      if (glowAmount > 0) {
        const soft = clonePixelBuffer(result);
        applyBoxBlur(soft, Math.max(1, Math.round(blurAmount * 0.25)));
        const diffusionMask = extractHighlightMask(base, {
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
        result = blendPixelBuffers(result, soft, "screen", glowAmount * 0.5);
      }

      // 10. Restrained film grain.
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }

      return result;
    };
  }
};
