import { describe, expect, it } from "vitest";
import { applyCubicGlass, createPixelBuffer } from "./index.js";

describe("applyCubicGlass", () => {
  it("returns source-sized output", () => {
    const source = createPixelBuffer(50, 50, [128, 128, 128, 255]);
    const output = applyCubicGlass(source, 10);
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
    expect(output.data.length).toBe(source.data.length);
  });

  it("returns a copy when tile size is 1", () => {
    const source = createPixelBuffer(20, 20, [100, 150, 200, 255]);
    const output = applyCubicGlass(source, 1);
    expect(output.data).toEqual(source.data);
  });

  it("preserves overall image dimensions and opacity", () => {
    const source = createPixelBuffer(32, 32, [80, 80, 80, 255]);
    const output = applyCubicGlass(source, 8);
    for (let i = 3; i < output.data.length; i += 4) {
      expect(output.data[i]).toBe(255);
    }
  });
});
