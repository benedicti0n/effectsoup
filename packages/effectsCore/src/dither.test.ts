import { describe, expect, it } from "vitest";
import {
  applyFloydSteinbergDither,
  applyOrderedColorDither,
  applyOrderedDither,
  createPixelBuffer,
  toGrayscale
} from "./index.js";

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

describe("applyOrderedColorDither", () => {
  it("larger cellSize produces larger output cells", () => {
    // Two distinct color halves — left reddish, right bluish — same
    // luminance so the Bayer pattern is identical on both sides.
    const source = createPixelBuffer(32, 32);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const idx = (y * 32 + x) * 4;
        if (x < 16) {
          source.data[idx] = 160; source.data[idx + 1] = 60; source.data[idx + 2] = 60;
        } else {
          source.data[idx] = 60; source.data[idx + 1] = 60; source.data[idx + 2] = 160;
        }
        source.data[idx + 3] = 255;
      }
    }

    const small = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });
    const large = applyOrderedColorDither(source, {
      cellSize: 8, threshold: 128, invert: false, monochrome: false
    });

    const runs = (buf: Uint8ClampedArray): number => {
      let count = 1;
      for (let x = 4; x < buf.length; x += 4) {
        if (buf[x] !== buf[x - 4]) count++;
      }
      return count;
    };
    expect(runs(large.data.subarray(0, 32 * 4))).toBeLessThan(
      runs(small.data.subarray(0, 32 * 4))
    );
  });

  it("output remains colored for a colored source", () => {
    const source = createPixelBuffer(32, 32, [200, 60, 30, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });
    let foundColor = false;
    for (let i = 0; i < output.data.length; i += 4) {
      const r = output.data[i];
      const g = output.data[i + 1];
      const b = output.data[i + 2];
      if (r !== g || g !== b) {
        foundColor = true;
        break;
      }
    }
    expect(foundColor).toBe(true);
  });

  it("produces deterministic output", () => {
    const source = createPixelBuffer(20, 20, [100, 150, 200, 255]);
    const a = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });
    const b = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });
    expect(a.data).toEqual(b.data);
  });

  it("preserves recognizable image structure at default params", () => {
    // 32x32 image: bright white top-left quadrant, black elsewhere.
    const source = createPixelBuffer(32, 32);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const idx = (y * 32 + x) * 4;
        if (x < 16 && y < 16) {
          source.data[idx] = 255;
          source.data[idx + 1] = 255;
          source.data[idx + 2] = 255;
        } else {
          source.data[idx] = 0;
          source.data[idx + 1] = 0;
          source.data[idx + 2] = 0;
        }
        source.data[idx + 3] = 255;
      }
    }

    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });

    let topLeftSum = 0;
    let bottomRightSum = 0;
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const idx = (y * 32 + x) * 4;
        topLeftSum += output.data[idx];
      }
    }
    for (let y = 16; y < 32; y++) {
      for (let x = 16; x < 32; x++) {
        const idx = (y * 32 + x) * 4;
        bottomRightSum += output.data[idx];
      }
    }
    expect(topLeftSum).toBeGreaterThan(bottomRightSum);
  });

  it("monochrome mode produces grayscale output", () => {
    const source = createPixelBuffer(16, 16, [200, 60, 30, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: true
    });
    for (let i = 0; i < output.data.length; i += 4) {
      expect(output.data[i]).toBe(output.data[i + 1]);
      expect(output.data[i + 1]).toBe(output.data[i + 2]);
    }
  });

  it("coloredInactive fills every cell with colour (no black cells)", () => {
    // Uniform mid-brightness source so some cells are active and some inactive.
    const source = createPixelBuffer(16, 16, [160, 100, 60, 255]);
    const standard = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });
    const colored = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false, coloredInactive: true
    });

    // Standard mode has some black cells (R=0 == G=0 == B=0).
    let standardBlack = 0;
    let coloredBlack = 0;
    for (let i = 0; i < standard.data.length; i += 4) {
      if (standard.data[i] === 0 && standard.data[i + 1] === 0 && standard.data[i + 2] === 0) standardBlack++;
      if (colored.data[i] === 0 && colored.data[i + 1] === 0 && colored.data[i + 2] === 0) coloredBlack++;
    }
    expect(standardBlack).toBeGreaterThan(0);
    expect(coloredBlack).toBe(0);
  });
});
