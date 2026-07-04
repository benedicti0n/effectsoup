import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer } from "./buffer.js";

const REC709_R = 0.2126;
const REC709_G = 0.7152;
const REC709_B = 0.0722;

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

/**
 * Standard Hermite smoothstep: 0 below edge0, 1 above edge1, smooth between.
 * Caller is responsible for ordering: for a "shadow mask" (peaks at
 * luminance=0) wrap as `1 - smoothstep(0, anchor, lum)`.
 */
function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x <= edge0 ? 0 : 1;
  const t = clampUnit((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export type HighlightMaskOptions = {
  /**
   * Luminance threshold above which a pixel is fully included in the mask.
   * 0..1. Pixels at or above `threshold + knee/2` contribute fully.
   * Default: 0.55.
   */
  threshold?: number;
  /**
   * Width of the smooth transition around the threshold, in luminance units.
   * 0..1. Default: 0.2.
   */
  knee?: number;
  /**
   * Overall multiplier on the mask. Use <1 for a subtler extraction.
   * 0..n. Default: 1.
   */
  intensity?: number;
  /**
   * Floor: minimum mask value even for the darkest pixels. Set slightly
   * above 0 if you want a hint of bloom everywhere. 0..1. Default: 0.
   */
  floor?: number;
};

/**
 * Build a per-pixel "highlight mask" of the source buffer, returned as a
 * fresh PixelBuffer of the same dimensions. The mask uses Rec.709 luminance
 * with a smoothstep soft knee around `threshold`. Dark and midtone pixels
 * produce a value at or near 0 (clamped to `floor`); bright pixels approach
 * 1. The output buffer stores the same mask value in R, G and B (255 for
 * A) so it can be processed downstream with regular primitives.
 *
 * The whole image is O(width*height) with no allocations beyond the
 * result buffer.
 */
export function extractHighlightMask(
  source: PixelBuffer,
  options: HighlightMaskOptions = {}
): PixelBuffer {
  const threshold = clampUnit(options.threshold ?? 0.55);
  const knee = clampUnit(options.knee ?? 0.2);
  const intensity = Math.max(0, options.intensity ?? 1);
  const floor = clampUnit(options.floor ?? 0);

  const t0 = threshold - knee / 2;
  const t1 = threshold + knee / 2;
  const t0c = Math.max(0, t0);
  const t1c = Math.max(t0c + 1e-6, Math.min(1, t1));

  const out = createPixelBuffer(source.width, source.height);
  const { data } = source;
  const oData = out.data;

  for (let i = 0; i < data.length; i += 4) {
    const lum =
      (REC709_R * data[i] +
        REC709_G * data[i + 1] +
        REC709_B * data[i + 2]) /
      255;

    let mask = smoothstep(t0c, t1c, lum);
    if (mask < floor) mask = floor;
    mask *= intensity;
    if (mask > 1) mask = 1;

    const byte = Math.round(mask * 255);
    oData[i] = byte;
    oData[i + 1] = byte;
    oData[i + 2] = byte;
    oData[i + 3] = 255;
  }
  return out;
}

export type SplitToneOptions = {
  /** Color pulled into the shadow regions. */
  shadowColor: RgbaColor;
  /** Color pulled into the highlight regions. */
  highlightColor: RgbaColor;
  /** Strength of the shadow pull. 0..1. Default: 0.6. */
  shadowAmount?: number;
  /** Strength of the highlight pull. 0..1. Default: 0.5. */
  highlightAmount?: number;
  /**
   * Luminance below which shadow influence is full and above which it is zero.
   * Default: 0.45.
   */
  shadowAnchor?: number;
  /**
   * Luminance above which highlight influence is full and below which it is zero.
   * Default: 0.55.
   */
  highlightAnchor?: number;
};

/**
 * Cinematic split-tone grade. Per pixel, compute luminance and build a
 * shadow mask (peaks at luminance=0) and a highlight mask (peaks at
 * luminance=1). For each color channel, pull the source toward
 * `shadowColor` in shadow regions and toward `highlightColor` in highlight
 * regions, simultaneously. Midtone regions are left untouched.
 *
 * Returns a fresh PixelBuffer; the source is not modified. O(width*height).
 */
export function applySplitTone(
  source: PixelBuffer,
  options: SplitToneOptions
): PixelBuffer {
  const shadowAmount = clampUnit(options.shadowAmount ?? 0.6);
  const highlightAmount = clampUnit(options.highlightAmount ?? 0.5);
  const shadowAnchor = clampUnit(options.shadowAnchor ?? 0.45);
  const highlightAnchor = clampUnit(options.highlightAnchor ?? 0.55);
  const { shadowColor, highlightColor } = options;
  const sr = shadowColor[0];
  const sg = shadowColor[1];
  const sb = shadowColor[2];
  const hr = highlightColor[0];
  const hg = highlightColor[1];
  const hb = highlightColor[2];

  const out = createPixelBuffer(source.width, source.height);
  const { data } = source;
  const oData = out.data;

  for (let i = 0; i < data.length; i += 4) {
    const lum =
      (REC709_R * data[i] +
        REC709_G * data[i + 1] +
        REC709_B * data[i + 2]) /
      255;

    // Shadow mask: peaks at lum=0, falls to 0 at lum=shadowAnchor.
    const shadowT = 1 - smoothstep(0, shadowAnchor, lum);
    const s = shadowT * shadowAmount;
    // Highlight mask: 0 at lum=highlightAnchor, rises to 1 at lum=1.
    const highlightT = smoothstep(highlightAnchor, 1, lum);
    const h = highlightT * highlightAmount;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dr = sr - r;
    const dg = sg - g;
    const db = sb - b;
    const hrDelta = hr - r;
    const hgDelta = hg - g;
    const hbDelta = hb - b;

    oData[i] = clampByte(r + dr * s + hrDelta * h);
    oData[i + 1] = clampByte(g + dg * s + hgDelta * h);
    oData[i + 2] = clampByte(b + db * s + hbDelta * h);
    oData[i + 3] = data[i + 3];
  }
  return out;
}
