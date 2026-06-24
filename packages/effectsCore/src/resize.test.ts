import { describe, expect, it } from "vitest";
import { createPixelBuffer, resizeBilinear, resizeNearestNeighbor } from "./index.js";

describe("resize", () => {
  it("resizes with nearest neighbor", () => {
    const buffer = createPixelBuffer(4, 4, [255, 0, 0, 255]);
    const resized = resizeNearestNeighbor(buffer, 2, 2);
    expect(resized.width).toBe(2);
    expect(resized.height).toBe(2);
    expect(resized.data[0]).toBe(255);
  });

  it("resizes with bilinear interpolation", () => {
    const buffer = createPixelBuffer(2, 2, [255, 255, 255, 255]);
    const resized = resizeBilinear(buffer, 4, 4);
    expect(resized.width).toBe(4);
    expect(resized.height).toBe(4);
    expect(resized.data[0]).toBe(255);
  });

  it("rejects invalid dimensions", () => {
    const buffer = createPixelBuffer(2, 2);
    expect(() => resizeNearestNeighbor(buffer, 0, 1)).toThrow();
  });
});
