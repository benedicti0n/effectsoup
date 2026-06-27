import {
  applyBoxBlur,
  applyGlow,
  applyNoise,
  applyRgbShift,
  applyTint,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  ATMOSPHERE_TINT_PRESETS,
  hexToRgba,
  resolveOverride
} from "../shared.js";

export const vhsBloomPreset: EffectPreset = {
  id: "vhsBloom",
  name: "VHS Bloom",
  description: "Blurry compressed nostalgic digital effect.",
  category: "atmosphereGlow",
  access: "premium",
  defaultIntensity: 1,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 16, step: 1, defaultValue: 1 },
    { id: "chromatic", name: "Chromatic", type: "range", min: 0, max: 20, step: 1, defaultValue: 5 },
    { id: "noise", name: "Noise", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
    { id: "tintPreset", name: "Tint Preset", type: "select", options: ["warmPink", "coolCyan", "amberCrt", "mint", "custom"], defaultValue: "custom" },
    { id: "tintColor", name: "Custom Tint", type: "color", defaultValue: "#000000" },
    { id: "tintAmount", name: "Tint Amount", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", 1),
    chromatic: resolveOverride(overrides, "chromatic", 5),
    noise: resolveOverride(overrides, "noise", 20),
    glowAmount: resolveOverride(overrides, "glowAmount", 100),
    tintPreset: resolveOverride(overrides, "tintPreset", "custom"),
    tintColor: resolveOverride(overrides, "tintColor", "#000000"),
    tintAmount: resolveOverride(overrides, "tintAmount", 20),
    grainAmount: resolveOverride(overrides, "grainAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 5;
      const chromatic = (params.chromatic as number) ?? 0;
      const noise = ((params.noise as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const tintPreset = (params.tintPreset as string) ?? "warmPink";
      const tintHex = tintPreset === "custom"
        ? ((params.tintColor as string) ?? "#ff5c9a")
        : (ATMOSPHERE_TINT_PRESETS[tintPreset] ?? ATMOSPHERE_TINT_PRESETS.warmPink);
      const tintColor = hexToRgba(tintHex);
      const tintAmount = ((params.tintAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      applyBoxBlur(result, blurAmount);
      if (chromatic > 0) {
        applyRgbShift(result, chromatic);
      }
      if (noise > 0) {
        applyNoise(result, noise);
      }
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(glowAmount * 8)),
          amount: glowAmount * 0.5,
          mode: "screen",
          color: tintColor
        });
      }
      if (tintAmount > 0) {
        applyTint(result, tintColor, tintAmount);
      }
      return result;
    };
  }
};
