import {
  applyGlow,
  applyGrain,
  clonePixelBuffer,
  resizeBilinear,
  resizeNearestNeighbor,
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
  const fallback: RgbaColor = [0, 0, 0, 255];
  if (typeof hex !== "string") return fallback;
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length !== 6 && clean.length !== 8) return fallback;
  if (!/^[0-9a-fA-F]+$/.test(clean)) return fallback;
  const bigint = parseInt(clean, 16);
  if (Number.isNaN(bigint)) return fallback;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const a = clean.length === 8 ? (bigint >> 24) & 255 : 255;
  return [r, g, b, a];
}

export function applyAtmosphereAdjustments(
  buffer: PixelBuffer,
  params: ResolvedPresetParameters
): PixelBuffer {
  const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
  const glowAmount = ((params.glowAmount as number) ?? 0) / 100;

  const result = clonePixelBuffer(buffer);
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

/**
 * Run a per-pixel effect at a manageable working size, then upscale back to
 * the source dimensions with nearest-neighbor. Keeps dithering/halftone/bitmap
 * visually consistent at any input resolution and avoids O(W*H) cost on huge
 * images, which would otherwise produce cluttered noise on every pixel.
 */
export function runAtWorkingResolution(
  source: PixelBuffer,
  maxLongest: number,
  apply: (small: PixelBuffer) => PixelBuffer
): PixelBuffer {
  const longest = Math.max(source.width, source.height);
  if (longest <= maxLongest) {
    return apply(source);
  }
  const scale = maxLongest / longest;
  const smallW = Math.max(1, Math.round(source.width * scale));
  const smallH = Math.max(1, Math.round(source.height * scale));
  const small = resizeBilinear(source, smallW, smallH);
  const processed = apply(small);
  return resizeNearestNeighbor(processed, source.width, source.height);
}
