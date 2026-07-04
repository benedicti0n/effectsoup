import {
  applyBoxBlur,
  applyDuotone,
  applyGlow,
  applyGrain,
  blendPixelBuffers,
  clampByte,
  clonePixelBuffer,
  type PixelBuffer,
  type RgbaColor
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  resolveOverride
} from "../shared.js";

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

export const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description: "Soft, hazy, nostalgic image treatment with palette presets.",
  category: "colorGlow",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
    { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 70 },
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 20, step: 1, defaultValue: 12 },
    { id: "palette", name: "Palette", type: "select", options: ["goldenDusk", "roseBloom", "coolHaze"], defaultValue: "goldenDusk" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", 12),
    glowAmount: resolveOverride(overrides, "glowAmount", 70),
    grainAmount: resolveOverride(overrides, "grainAmount", 10),
    palette: resolveOverride(overrides, "palette", "goldenDusk")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 12;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const paletteName = (params.palette as keyof typeof dreamGlowPalette) ?? "goldenDusk";
      const palette = dreamGlowPalette[paletteName] ?? dreamGlowPalette.goldenDusk;

      // Two blurred glow layers: a wide diffuse bloom + a tighter bright bloom,
      // stacked for a richer halo. Both tinted toward the palette glow color.
      const glowLayer = clonePixelBuffer(source);
      applyBoxBlur(glowLayer, Math.max(2, Math.round(blurAmount)));
      const tightGlowLayer = clonePixelBuffer(source);
      applyBoxBlur(tightGlowLayer, Math.max(1, Math.round(blurAmount * 0.4)));

      // Boost and tint the diffuse glow toward the palette glow color.
      const tintMix = 0.5;
      for (const buf of [glowLayer, tightGlowLayer]) {
        const data = buf.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = clampByte(data[i] * (1 - tintMix) + palette.glow[0] * tintMix);
          data[i + 1] = clampByte(data[i + 1] * (1 - tintMix) + palette.glow[1] * tintMix);
          data[i + 2] = clampByte(data[i + 2] * (1 - tintMix) + palette.glow[2] * tintMix);
        }
      }

      // Stack the glow on the source — wider first, tighter on top.
      let result = blendPixelBuffers(source, glowLayer, "screen", Math.min(1, glowAmount * 0.7));
      result = blendPixelBuffers(result, tightGlowLayer, "screen", Math.min(1, glowAmount * 0.55));
      // Brighten the result with additive glow.
      result = blendPixelBuffers(source, result, "screen", glowAmount * 0.4);

      // Soft color-grade using duotone to keep tonal range intact.
      const graded = clonePixelBuffer(result);
      applyDuotone(graded, palette.shadow, palette.highlight);
      result = blendPixelBuffers(result, graded, "soft", 0.2 + glowAmount * 0.25);

      // Final glow pass on the highlights.
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(blurAmount * 0.5)),
          amount: glowAmount * 0.5,
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
