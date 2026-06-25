import { describe, expect, it } from "vitest";
import { applyViewportTransform, createPixelBuffer, clonePixelBuffer } from "./index.js";

describe("applyViewportTransform", () => {
  it("returns the requested output dimensions", () => {
    const source = createPixelBuffer(200, 100, [128, 128, 128, 255]);
    const output = applyViewportTransform(source, { aspectRatio: "1:1", zoom: 1, offsetX: 0, offsetY: 0 }, 80, 80);
    expect(output.width).toBe(80);
    expect(output.height).toBe(80);
  });

  it("preserves source dimensions at original aspect ratio", () => {
    const source = createPixelBuffer(200, 100, [128, 128, 128, 255]);
    const output = applyViewportTransform(source, { aspectRatio: "original", zoom: 1, offsetX: 0, offsetY: 0 }, 200, 100);
    expect(output.width).toBe(200);
    expect(output.height).toBe(100);
  });

  it("does not mutate the source buffer", () => {
    const source = createPixelBuffer(100, 100, [128, 128, 128, 255]);
    const original = clonePixelBuffer(source);
    applyViewportTransform(source, { aspectRatio: "1:1", zoom: 1.5, offsetX: 0.5, offsetY: -0.5 }, 50, 50);
    expect(source.data).toEqual(original.data);
  });

  it("centers the crop window initially", () => {
    const source = createPixelBuffer(200, 100, [255, 0, 0, 255]);
    const output = applyViewportTransform(source, { aspectRatio: "1:1", zoom: 1, offsetX: 0, offsetY: 0 }, 100, 100);
    // Center of a 200x100 source cropped to 1:1 should still be red.
    const centerIdx = (50 * 100 + 50) * 4;
    expect(output.data[centerIdx]).toBe(255);
    expect(output.data[centerIdx + 1]).toBe(0);
    expect(output.data[centerIdx + 2]).toBe(0);
  });

  it("clamps offsets so no empty areas appear", () => {
    const source = createPixelBuffer(100, 100, [128, 128, 128, 255]);
    const output = applyViewportTransform(
      source,
      { aspectRatio: "1:1", zoom: 2, offsetX: 1, offsetY: -1 },
      50,
      50
    );
    // Every pixel should still sample from inside the source.
    for (let i = 0; i < output.data.length; i += 4) {
      expect(output.data[i + 3]).toBe(255);
    }
  });

  it("applies zoom by reducing visible area", () => {
    const source = createPixelBuffer(200, 200, [128, 128, 128, 255]);
    source.data[0] = 255;
    source.data[1] = 255;
    source.data[2] = 255;

    const noZoom = applyViewportTransform(source, { aspectRatio: "1:1", zoom: 1, offsetX: 0, offsetY: 0 }, 100, 100);
    const zoomed = applyViewportTransform(source, { aspectRatio: "1:1", zoom: 2, offsetX: 0, offsetY: 0 }, 100, 100);

    // Zooming should change the sampled content enough that the top-left pixel differs.
    expect(zoomed.data[0]).not.toBe(noZoom.data[0]);
  });

  it("changes output when offset changes", () => {
    const source = createPixelBuffer(200, 100, [128, 128, 128, 255]);
    // Make the left side distinct from the right side.
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < 50; x++) {
        const idx = (y * source.width + x) * 4;
        source.data[idx] = 255;
        source.data[idx + 1] = 0;
        source.data[idx + 2] = 0;
      }
    }
    const left = applyViewportTransform(source, { aspectRatio: "1:1", zoom: 1, offsetX: -1, offsetY: 0 }, 50, 50);
    const right = applyViewportTransform(source, { aspectRatio: "1:1", zoom: 1, offsetX: 1, offsetY: 0 }, 50, 50);
    expect(left.data).not.toEqual(right.data);
  });
});
