import {
  applyGlow,
  applyRgbShift,
  applyScanlines,
  applyTint,
  applyVignette,
  clonePixelBuffer,
  resizeNearestNeighbor,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  ATMOSPHERE_TINT_PRESETS,
  hexToRgba,
  resolveOverride
} from "../shared.js";

export const crtDreamPreset: EffectPreset = {
  id: "crtDream",
  name: "CRT Dream",
  description: "Soft retro display effect.",
  category: "retroSignal",
  defaultIntensity: 1,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "pixelCellSize", name: "Pixel Cell", type: "range", min: 2, max: 16, step: 1, defaultValue: 3 },
    { id: "scanlineStrength", name: "Scanlines", type: "range", min: 0, max: 100, step: 1, defaultValue: 35 },
    { id: "rgbShift", name: "RGB Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "tintPreset", name: "Tint Preset", type: "select", options: ["warmPink", "coolCyan", "amberCrt", "mint", "custom"], defaultValue: "warmPink" },
    { id: "tintColor", name: "Custom Tint", type: "color", defaultValue: "#ff5c9a" },
    { id: "tintAmount", name: "Tint Amount", type: "range", min: 0, max: 100, step: 1, defaultValue: 15 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    pixelCellSize: resolveOverride(overrides, "pixelCellSize", 3),
    scanlineStrength: resolveOverride(overrides, "scanlineStrength", 35),
    rgbShift: resolveOverride(overrides, "rgbShift", 4),
    glowAmount: resolveOverride(overrides, "glowAmount", 10),
    vignette: resolveOverride(overrides, "vignette", Math.round((intensity / 100) * 40)),
    tintPreset: resolveOverride(overrides, "tintPreset", "warmPink"),
    tintColor: resolveOverride(overrides, "tintColor", "#ff5c9a"),
    tintAmount: resolveOverride(overrides, "tintAmount", 15),
    grainAmount: resolveOverride(overrides, "grainAmount", 20)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const pixelCellSize = (params.pixelCellSize as number) ?? 4;
      const scanlineStrength = ((params.scanlineStrength as number) ?? 0) / 100;
      const rgbShift = (params.rgbShift as number) ?? 0;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const vignette = ((params.vignette as number) ?? 0) / 100;
      const tintPreset = (params.tintPreset as string) ?? "warmPink";
      const tintHex = tintPreset === "custom"
        ? ((params.tintColor as string) ?? "#ff5c9a")
        : (ATMOSPHERE_TINT_PRESETS[tintPreset] ?? ATMOSPHERE_TINT_PRESETS.warmPink);
      const tintColor = hexToRgba(tintHex);
      const tintAmount = ((params.tintAmount as number) ?? 0) / 100;

      const smallW = Math.max(1, Math.floor(source.width / pixelCellSize));
      const smallH = Math.max(1, Math.floor(source.height / pixelCellSize));
      let result = resizeNearestNeighbor(source, smallW, smallH);
      result = resizeNearestNeighbor(result, source.width, source.height);

      if (rgbShift > 0) {
        applyRgbShift(result, rgbShift);
      }
      if (scanlineStrength > 0) {
        applyScanlines(result, scanlineStrength);
      }
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(glowAmount * 6)),
          amount: glowAmount * 0.4,
          mode: "screen",
          color: tintColor
        });
      }
      if (vignette > 0) {
        applyVignette(result, vignette);
      }
      if (tintAmount > 0) {
        applyTint(result, tintColor, tintAmount);
      }
      return result;
    };
  }
};
