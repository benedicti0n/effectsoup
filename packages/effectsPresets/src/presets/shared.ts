import {
  applyGlow,
  applyGrain,
  type PixelBuffer,
  type RgbaColor
} from "@effectsoup/core";
import type { AdvancedControlDefinition, ResolvedPresetParameters } from "../types.js";

export const atmosphereAdvancedControls: AdvancedControlDefinition[] = [
  { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
  { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 }
];

export const adjustmentControls: AdvancedControlDefinition[] = [
  { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "contrast", name: "Contrast", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "saturation", name: "Saturation", type: "range", min: -100, max: 100, step: 1, defaultValue: 0 }
];

export function resolveOverride<T extends number | string | boolean>(
  overrides: Record<string, number | string | boolean>,
  key: string,
  defaultValue: T
): T {
  const value = overrides[key];
  if (value === undefined) return defaultValue;
  return value as T;
}

export function hexToRgba(hex: string): RgbaColor {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

export function applyAtmosphereAdjustments(
  buffer: PixelBuffer,
  params: ResolvedPresetParameters
): PixelBuffer {
  const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
  const glowAmount = ((params.glowAmount as number) ?? 0) / 100;

  const result = buffer;
  if (glowAmount > 0) {
    applyGlow(result, {
      radius: Math.max(1, Math.round(glowAmount * 8)),
      amount: glowAmount * 0.4,
      mode: "screen"
    });
  }
  if (grainAmount > 0) {
    applyGrain(result, grainAmount);
  }
  return result;
}

export const CYBER_TINT_PRESETS: Record<string, string> = {
  terminalGreen: "#00FF88",
  electricCyan: "#00f0ff",
  amberCrt: "#FFB000",
  violetCode: "#B388FF"
};

export const ATMOSPHERE_TINT_PRESETS: Record<string, string> = {
  warmPink: "#ff5c9a",
  coolCyan: "#00f0ff",
  amberCrt: "#FFB000",
  mint: "#7CFFC4",
  custom: "#ff5c9a"
};
