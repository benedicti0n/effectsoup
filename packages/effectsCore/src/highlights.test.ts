import { describe, expect, it } from "vitest";
import { applySplitTone, createPixelBuffer, extractHighlightMask } from "./index.js";

describe("extractHighlightMask", () => {
  it("returns a same-sized buffer with luminance-encoded highlight mask", () => {
    const source = createPixelBuffer(4, 4, [0, 0, 0, 255]);
    const mask = extractHighlightMask(source);
    expect(mask.width).toBe(4);
    expect(mask.height).toBe(4);
    expect(mask.data.length).toBe(4 * 4 * 4);
    // Dark input -> mask should be at or near floor (0).
    expect(mask.data[0]).toBe(0);
  });

  it("isolates bright pixels and preserves dark ones", () => {
    const source = createPixelBuffer(2, 1, [10, 10, 10, 255]);
    // Pixel 0 stays dark; pixel 1 is white.
    source.data[4] = 250;
    source.data[5] = 250;
    source.data[6] = 250;
    const mask = extractHighlightMask(source, { threshold: 0.7, knee: 0.2 });
    const darkM = mask.data[0];
    const brightM = mask.data[4];
    expect(darkM).toBeLessThan(40);
    expect(brightM).toBeGreaterThan(200);
  });

  it("honors floor so dark pixels still contribute a small amount", () => {
    const source = createPixelBuffer(1, 1, [10, 10, 10, 255]);
    const mask = extractHighlightMask(source, { threshold: 0.7, floor: 0.2 });
    // floor=0.2 -> byte 51
    expect(mask.data[0]).toBe(51);
  });

  it("scales via intensity", () => {
    const a = extractHighlightMask(createPixelBuffer(1, 1, [200, 200, 200, 255]), {
      threshold: 0.5,
      intensity: 1
    });
    const b = extractHighlightMask(createPixelBuffer(1, 1, [200, 200, 200, 255]), {
      threshold: 0.5,
      intensity: 0.5
    });
    // Half intensity -> ~half byte on bright pixels.
    expect(Math.abs(a.data[0] - b.data[0])).toBeGreaterThan(40);
    expect(b.data[0]).toBeLessThan(a.data[0]);
  });

  it("alphas are 255", () => {
    const mask = extractHighlightMask(createPixelBuffer(2, 2, [50, 50, 50, 255]));
    for (let i = 3; i < mask.data.length; i += 4) {
      expect(mask.data[i]).toBe(255);
    }
  });

  it("warm mid-bright orange contributes to the medium-band mask", () => {
    // RGB (255, 175, 110) — Rec.709 luminance ~0.62. Must cross the
    // medium-band threshold of 0.45 with knee 0.30 (range 0.30..0.60)
    // and produce a non-zero mask.
    const source = createPixelBuffer(1, 1, [255, 175, 110, 255]);
    const mask = extractHighlightMask(source, {
      threshold: 0.45,
      knee: 0.3,
      intensity: 1
    });
    // lum=0.62 is past edge1=0.60 -> smoothstep returns 1.
    expect(mask.data[0]).toBe(255);
    expect(mask.data[1]).toBe(255);
    expect(mask.data[2]).toBe(255);
  });

  it("deep shadow contributes zero to the wide-band mask", () => {
    // RGB (5, 5, 5) — Rec.709 luminance ~0.021. Below every band
    // threshold, so the mask must be exactly 0.
    const source = createPixelBuffer(1, 1, [5, 5, 5, 255]);
    const mask = extractHighlightMask(source, {
      threshold: 0.25,
      knee: 0.35,
      intensity: 1
    });
    expect(mask.data[0]).toBe(0);
    expect(mask.data[1]).toBe(0);
    expect(mask.data[2]).toBe(0);
  });
});

describe("applySplitTone", () => {
  it("pulls shadows toward the shadow color and highlights toward the highlight color", () => {
    const source = createPixelBuffer(2, 1, [40, 40, 40, 255]);
    // Pixel 1 = bright white, pixel 0 = dark.
    const out = applySplitTone(source, {
      shadowColor: [80, 30, 110, 255],
      highlightColor: [255, 200, 160, 255],
      shadowAmount: 1,
      highlightAmount: 1
    });
    // Dark pixel -> heavily mixed with shadowColor (indigo).
    expect(out.data[0]).toBeGreaterThan(40); // pulled up toward 80
    expect(out.data[2]).toBeGreaterThan(40); // blue channel up toward 110
    expect(out.data[1]).toBeLessThan(40); // red-green mostly unchanged since lum 0.157 is below shadowAnchor
    // Bright pixel -> pulled toward warm highlight.
    expect(out.data[5]).toBeLessThan(255); // green pulled DOWN to ~200
    // midtone (set lum=128): no shift expected.
  });

  it("leaves true midtones untouched", () => {
    // lum = 0.5 sits in the middle (default anchors 0.45/0.55).
    const source = createPixelBuffer(1, 1, [128, 128, 128, 255]);
    const out = applySplitTone(source, {
      shadowColor: [80, 30, 110, 255],
      highlightColor: [255, 200, 160, 255],
      shadowAmount: 1,
      highlightAmount: 1
    });
    // Both masks near 0 at lum=0.5 -> effectively unchanged.
    expect(Math.abs(out.data[0] - 128)).toBeLessThanOrEqual(2);
  });

  it("respects amount=0 (identity)", () => {
    const source = createPixelBuffer(2, 2, [10, 120, 230, 255]);
    const out = applySplitTone(source, {
      shadowColor: [80, 30, 110, 255],
      highlightColor: [255, 200, 160, 255],
      shadowAmount: 0,
      highlightAmount: 0
    });
    expect(Array.from(out.data)).toEqual(Array.from(source.data));
  });

  it("does not mutate the source", () => {
    const source = createPixelBuffer(2, 2, [80, 80, 80, 255]);
    const before = new Uint8ClampedArray(source.data);
    applySplitTone(source, {
      shadowColor: [10, 10, 60, 255],
      highlightColor: [255, 220, 200, 255],
      shadowAmount: 1,
      highlightAmount: 1
    });
    expect(Array.from(source.data)).toEqual(Array.from(before));
  });
});
