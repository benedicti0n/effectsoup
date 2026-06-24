import { describe, expect, it } from "vitest";
import { applyFloydSteinbergDither, applyOrderedDither, createPixelBuffer, toGrayscale } from "./index.js";

describe("dither", () => {
  it("applies ordered dither", () => {
    const buffer = createPixelBuffer(4, 4, [128, 128, 128, 255]);
    toGrayscale(buffer);
    applyOrderedDither(buffer, 128);
    expect([0, 255]).toContain(buffer.data[0]);
  });

  it("applies Floyd-Steinberg dither", () => {
    const buffer = createPixelBuffer(8, 8, [128, 128, 128, 255]);
    toGrayscale(buffer);
    applyFloydSteinbergDither(buffer, 128);
    expect([0, 255]).toContain(buffer.data[0]);
  });
});
