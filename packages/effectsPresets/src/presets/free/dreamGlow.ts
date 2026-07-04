import {
  applyBoxBlur,
  applyGrain,
  applySplitTone,
  blendPixelBuffers,
  clonePixelBuffer,
  createPixelBuffer,
  extractHighlightMask,
  type PixelBuffer,
  type RgbaColor
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride } from "../shared.js";

/**
 * Three-color palette for the cinematic split-tone grade. `glow` is the tint
 * applied to the extracted bloom layer; `shadow` is pulled into dark
 * regions; `highlight` is pulled into bright regions. Defaults target the
 * "goldenDusk" reference: deep indigo shadows + warm peach/orange
 * highlights with a peach-amber bloom.
 */
export type DreamGlowPaletteEntry = {
  glow: RgbaColor;
  shadow: RgbaColor;
  highlight: RgbaColor;
};

export const dreamGlowPalette: Record<string, DreamGlowPaletteEntry> = {
  goldenDusk: {
    // Warm peach/amber bloom that paints over the bright areas.
    glow: [255, 175, 110, 255],
    // Deep cinematic indigo/violet for shadows — never muddy brown.
    shadow: [55, 35, 95, 255],
    // Saturated warm peach for highlights.
    highlight: [255, 195, 160, 255]
  },
  roseBloom: {
    glow: [255, 165, 180, 255],
    shadow: [60, 25, 70, 255],
    highlight: [255, 200, 210, 255]
  },
  coolHaze: {
    glow: [170, 200, 255, 255],
    shadow: [25, 30, 80, 255],
    highlight: [205, 220, 255, 255]
  }
};

/**
 * Cinematic Dream Glow.
 *
 * Pipeline:
 *   1. Extract a luminance-keyed highlight mask from the source.
 *   2. Blur the mask at wide + tight radii — never blur the source itself.
 *   3. Tint both blurred masks moderately toward palette.glow, then take
 *      a per-channel max so the brightest contribution dominates.
 *   4. Screen-blend the bloom onto the source. Conservative strength so
 *      source detail stays dominant.
 *   5. Apply a split-tone grade (palette.shadow / palette.highlight) to
 *      the bloom-blended result so shadows recede into indigo and
 *      highlights push warm. Animated by master intensity.
 *   6. Apply subtle film grain (default = low).
 *
 * The source is never subject to a full-frame blur, so eyelashes, hair
 * strands, and high-frequency detail stay crisp at default settings.
 */
export const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description:
    "Cinematic split-tone with selective highlight bloom. Deep indigo shadows, warm peach bloom on bright areas, hair-and-eye detail preserved.",
  category: "colorGlow",
  defaultIntensity: 60,
  advancedControlSchema: [
    {
      id: "grainAmount",
      name: "Grain",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 8
    },
    {
      id: "glowAmount",
      name: "Glow",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 65
    },
    {
      id: "blurAmount",
      name: "Blur",
      type: "range",
      min: 0,
      max: 20,
      step: 1,
      defaultValue: 14
    },
    {
      id: "palette",
      name: "Palette",
      type: "select",
      options: Object.keys(dreamGlowPalette),
      defaultValue: "goldenDusk"
    }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    // Master intensity (0..1) scales glow, split-tone, and grain together
    // so that intensity meaningfully drives the overall look.
    masterStrength: Math.max(0, Math.min(1, intensity / 100)),
    blurAmount: resolveOverride(overrides, "blurAmount", 14),
    glowAmount: resolveOverride(overrides, "glowAmount", 65),
    grainAmount: resolveOverride(overrides, "grainAmount", 8),
    palette: resolveOverride(overrides, "palette", "goldenDusk")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const master = ((params.masterStrength as number) ?? 1);
      const blurAmount = (params.blurAmount as number) ?? 14;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const paletteName =
        (params.palette as keyof typeof dreamGlowPalette) ?? "goldenDusk";
      const palette =
        dreamGlowPalette[paletteName] ?? dreamGlowPalette.goldenDusk;

      // Scale each strength by master so the intensity slider has a
      // clear, continuous effect from no-effect at 0% up to full at 100%.
      const scaledGlow = Math.max(0, Math.min(1, glowAmount * master));
      const scaledShadowAmt = Math.max(0, Math.min(0.85, 0.55 * master));
      const scaledHighlightAmt = Math.max(0, Math.min(0.7, 0.42 * master));
      const scaledGrain = Math.max(0, Math.min(0.6, grainAmount * master));

      // 1+2. Build a luminance-thresholded highlight mask and blur it at
      //    wide + tight radii. Crucially we blur the MASK, not the source,
      //    so source detail stays sharp.
      const mask = extractHighlightMask(source, {
        threshold: 0.6,
        knee: 0.22,
        floor: 0,
        intensity: 1
      });
      const wideRadius = Math.max(2, Math.round(blurAmount * 0.55));
      const tightRadius = Math.max(1, Math.round(blurAmount * 0.28));

      const wideMask = clonePixelBuffer(mask);
      applyBoxBlur(wideMask, wideRadius);
      const tightMask = clonePixelBuffer(mask);
      applyBoxBlur(tightMask, tightRadius);

      // 3. Apply the mask byte as a brightness multiplier onto the glow
      //    color. Where mask = 0 (dark, no bloom), the contribution
      //    collapses to 0; where mask = 255 (full bright), the bloom
      //    is the full glow color. Linear multiplicative tint preserves
      //    the mask semantics instead of leaking glow into shadows.
      const tintBuffer = (buf: PixelBuffer): void => {
        const data = buf.data;
        const gr = palette.glow[0];
        const gg = palette.glow[1];
        const gb = palette.glow[2];
        for (let i = 0; i < data.length; i += 4) {
          data[i] = (data[i] * gr) / 255;
          data[i + 1] = (data[i + 1] * gg) / 255;
          data[i + 2] = (data[i + 2] * gb) / 255;
          data[i + 3] = 255;
        }
      };
      tintBuffer(wideMask);
      tintBuffer(tightMask);

      // Per-channel max of the two blurred masks. Where neither mask
      // contributes (i.e. dark areas of the source) the result is black,
      // so screen blending the bloom with source adds nothing in shadows.
      const bloom = createPixelBuffer(source.width, source.height);
      {
        const w = wideMask.data;
        const t = tightMask.data;
        const b = bloom.data;
        for (let i = 0; i < b.length; i += 4) {
          b[i] = Math.max(w[i], t[i]);
          b[i + 1] = Math.max(w[i + 1], t[i + 1]);
          b[i + 2] = Math.max(w[i + 2], t[i + 2]);
          b[i + 3] = 255;
        }
      }

      // 4. Screen-blend the bloom onto the source at the user-tunable
      //    strength. Capped so dark areas stay dark even at high glow.
      const bloomStrength = Math.min(1, scaledGlow * 0.85);
      let result = blendPixelBuffers(source, bloom, "screen", bloomStrength);

      // 5. Cinematic split-tone over the bloom result. Anchor choices keep
      //    midtone regions unchanged so detail survives.
      result = applySplitTone(result, {
        shadowColor: palette.shadow,
        highlightColor: palette.highlight,
        shadowAmount: scaledShadowAmt,
        highlightAmount: scaledHighlightAmt,
        shadowAnchor: 0.42,
        highlightAnchor: 0.6
      });

      // 6. Subtle monochrome grain modulated by inverse luminance so it
      //    sits visibly in midtones/shadows but never in highlights.
      if (scaledGrain > 0) {
        applyGrain(result, scaledGrain);
      }

      return result;
    };
  }
};
