import { describe, expect, it } from "vitest";
import { applyGridOverlay, createPixelBuffer } from "./index.js";

describe("applyGridOverlay", () => {
  it("darkens grid lines", () => {
    const buffer = createPixelBuffer(20, 20, [200, 200, 200, 255]);
    applyGridOverlay(buffer, { cellSize: 10, opacity: 0.5, style: "darken" });
    const idx = (1 * 20 + 0) * 4; // vertical grid line pixel, not an intersection
    expect(buffer.data[idx]).toBe(100);
    expect(buffer.data[idx + 1]).toBe(100);
    expect(buffer.data[idx + 2]).toBe(100);
  });

  it("leaves buffer unchanged when opacity is zero", () => {
    const buffer = createPixelBuffer(10, 10, [200, 200, 200, 255]);
    applyGridOverlay(buffer, { cellSize: 5, opacity: 0, style: "darken" });
    expect(buffer.data[0]).toBe(200);
  });
});
