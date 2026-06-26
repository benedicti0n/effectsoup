import {
  applyBoxBlur,
  applyDuotone,
  applyGlow,
  applyGrain,
  blendPixelBuffers,
  clonePixelBuffer,
  type PixelBuffer,
  type RgbaColor
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
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
  category: "atmosphereGlow",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 20, step: 1, defaultValue: 8 },
    { id: "palette", name: "Palette", type: "select", options: ["goldenDusk", "roseBloom", "coolHaze"], defaultValue: "goldenDusk" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", 8),
    glowAmount: resolveOverride(overrides, "glowAmount", 10),
    grainAmount: resolveOverride(overrides, "grainAmount", 10),
    palette: resolveOverride(overrides, "palette", "goldenDusk")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 6;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const paletteName = (params.palette as keyof typeof dreamGlowPalette) ?? "goldenDusk";
      const palette = dreamGlowPalette[paletteName] ?? dreamGlowPalette.goldenDusk;

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
