import { describe, expect, it } from "vitest";
import { applyBloom, applyGlow, createPixelBuffer } from "./index.js";

describe("applyGlow", () => {
  it("brightens image with screen glow", () => {
    const buffer = createPixelBuffer(10, 10, [100, 100, 100, 255]);
    applyGlow(buffer, { radius: 2, amount: 0.5, mode: "screen" });
    expect(buffer.data[0]).toBeGreaterThan(100);
  });

  it("leaves buffer unchanged when amount is zero", () => {
    const buffer = createPixelBuffer(10, 10, [100, 100, 100, 255]);
    applyGlow(buffer, { radius: 2, amount: 0, mode: "screen" });
    expect(buffer.data[0]).toBe(100);
  });
});

describe("applyBloom", () => {
  it("brightens bright areas only", () => {
    const buffer = createPixelBuffer(10, 10, [50, 50, 50, 255]);
    // Set one bright pixel.
    buffer.data[0] = 255;
    buffer.data[1] = 255;
    buffer.data[2] = 255;
    applyBloom(buffer, { radius: 2, threshold: 0.5, amount: 0.8 });
    const brightPixel = buffer.data[0];
    const darkPixel = buffer.data[4];
    expect(brightPixel).toBeGreaterThan(200);
    expect(darkPixel).toBeLessThan(100);
  });
});
