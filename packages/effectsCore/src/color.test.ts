import { describe, expect, it } from "vitest";
import {
  adjustBrightnessContrast,
  applyDuotone,
  applyPosterize,
  createPixelBuffer,
  reducePalette,
  toGrayscale
} from "./index.js";

describe("color operations", () => {
  it("converts to grayscale", () => {
    const buffer = createPixelBuffer(1, 1, [255, 0, 0, 255]);
    toGrayscale(buffer);
    expect(buffer.data[0]).toBe(76);
  });

  it("adjusts brightness", () => {
    const buffer = createPixelBuffer(1, 1, [100, 100, 100, 255]);
    adjustBrightnessContrast(buffer, 50, 0);
    expect(buffer.data[0]).toBe(150);
  });

  it("applies posterize", () => {
    const buffer = createPixelBuffer(1, 1, [127, 127, 127, 255]);
    applyPosterize(buffer, 2);
    expect(buffer.data[0]).toBe(0);
  });

  it("applies duotone", () => {
    const buffer = createPixelBuffer(1, 1, [128, 128, 128, 255]);
    applyDuotone(buffer, [0, 0, 0, 255], [255, 255, 255, 255]);
    expect(buffer.data[0]).toBeGreaterThan(0);
    expect(buffer.data[0]).toBeLessThan(255);
  });

  it("reduces palette", () => {
    const buffer = createPixelBuffer(2, 2);
    buffer.data[0] = 10;
    buffer.data[1] = 100;
    buffer.data[2] = 200;
    reducePalette(buffer, 8);
    expect(buffer.data[0]).not.toBe(10);
  });
});
