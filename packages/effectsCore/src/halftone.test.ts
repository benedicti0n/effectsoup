import { describe, expect, it } from "vitest";
import { createPixelBuffer, renderHalftoneData } from "./index.js";

describe("renderHalftoneData", () => {
  it("renders monochrome halftone at source size", () => {
    const source = createPixelBuffer(60, 60, [128, 128, 128, 255]);
    const output = renderHalftoneData(source, {
      dotSpacing: 8,
      maxDotSize: 4,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255]
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("renders colored dots in source color mode", () => {
    const source = createPixelBuffer(60, 60, [0, 150, 200, 255]);
    const output = renderHalftoneData(source, {
      dotSpacing: 8,
      maxDotSize: 4,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255],
      colorMode: "source"
    });
    let foundColor = false;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i + 2] > 150) {
        foundColor = true;
        break;
      }
    }
    expect(foundColor).toBe(true);
  });

  it("snaps dots to palette colors", () => {
    const source = createPixelBuffer(60, 60, [200, 50, 50, 255]);
    const output = renderHalftoneData(source, {
      dotSpacing: 8,
      maxDotSize: 4,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255],
      colorMode: "palette",
      palette: [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255]]
    });
    let foundPureRed = false;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] === 255 && output.data[i + 1] === 0 && output.data[i + 2] === 0) {
        foundPureRed = true;
        break;
      }
    }
    expect(foundPureRed).toBe(true);
  });
});
