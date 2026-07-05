import { describe, expect, it } from "vitest";
import {
  applyHeadroomBloom,
  blendPixelBuffers,
  createPixelBuffer
} from "./index.js";

describe("applyHeadroomBloom", () => {
  it("preserves highlight chroma with a saturated bloom tint", () => {
    // Orange beam (255, 175, 110) under a saturated orange bloom
    // (255, 130, 60) at amount 1.0. R is already maxed so its
    // headroom is 0 -> zero contribution -> R stays at 255. G and B
    // lift but not all the way to 255. The pixel stays warm orange,
    // not bleached white.
    const source = createPixelBuffer(1, 1, [255, 175, 110, 255]);
    const bloom = createPixelBuffer(1, 1, [255, 130, 60, 255]);
    const out = applyHeadroomBloom(source, bloom, { amount: 1.0 });
    expect(out.data[0]).toBe(255); // R unchanged (headroom 0)
    expect(out.data[1]).toBeGreaterThan(175);
    expect(out.data[1]).toBeLessThan(255);
    expect(out.data[2]).toBeGreaterThan(110);
    expect(out.data[2]).toBeLessThan(255);
  });

  it("mathematically matches `screen` (same per-channel formula)", () => {
    // The headroom formula and the standard screen formula are
    // identical:  source + (255 - source) * bloom / 255  is
    // algebraically the same as  255 - (255 - source)(255 - bloom) / 255.
    // Confirm with several inputs to make this property explicit so
    // no one accidentally changes the formula.
    const inputs = [
      { source: [0, 0, 0, 255], bloom: [200, 100, 50, 255] },
      { source: [255, 175, 110, 255], bloom: [255, 130, 60, 255] },
      { source: [128, 64, 32, 255], bloom: [200, 200, 200, 255] },
      { source: [40, 80, 120, 255], bloom: [255, 255, 255, 255] }
    ];
    for (const { source: s, bloom: b } of inputs) {
      const src = createPixelBuffer(1, 1, s as [number, number, number, number]);
      const blm = createPixelBuffer(1, 1, b as [number, number, number, number]);
      const headroom = applyHeadroomBloom(src, blm, { amount: 1.0 });
      const screen = blendPixelBuffers(src, blm, "screen", 1.0);
      expect(Array.from(headroom.data)).toEqual(Array.from(screen.data));
    }
  });

  it("dark pixels receive the full bloom tint", () => {
    // Source (0, 0, 0), bloom (200, 100, 50) -> full additive at
    // amount 1.0 should reach the bloom color.
    const source = createPixelBuffer(1, 1, [0, 0, 0, 255]);
    const bloom = createPixelBuffer(1, 1, [200, 100, 50, 255]);
    const out = applyHeadroomBloom(source, bloom, { amount: 1.0 });
    expect(out.data[0]).toBe(200);
    expect(out.data[1]).toBe(100);
    expect(out.data[2]).toBe(50);
  });

  it("amount=0 is identity", () => {
    const source = createPixelBuffer(2, 1, [200, 100, 50, 255]);
    const bloom = createPixelBuffer(2, 1, [10, 200, 80, 255]);
    const out = applyHeadroomBloom(source, bloom, { amount: 0 });
    expect(Array.from(out.data)).toEqual(Array.from(source.data));
  });

  it("does not mutate the source", () => {
    const source = createPixelBuffer(2, 1, [80, 80, 80, 255]);
    const before = new Uint8ClampedArray(source.data);
    applyHeadroomBloom(source, createPixelBuffer(2, 1, [200, 200, 200, 255]), {
      amount: 1.0
    });
    expect(Array.from(source.data)).toEqual(Array.from(before));
  });

  it("preserves the alpha channel", () => {
    const source = createPixelBuffer(1, 1, [100, 100, 100, 200]);
    const bloom = createPixelBuffer(1, 1, [200, 200, 200, 100]);
    const out = applyHeadroomBloom(source, bloom, { amount: 0.5 });
    expect(out.data[3]).toBe(200);
  });
});
