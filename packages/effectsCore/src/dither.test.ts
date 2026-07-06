import { describe, expect, it } from "vitest";
import {
  applyFloydSteinbergDither,
  applyOrderedColorDither,
  applyOrderedDither,
  createPixelBuffer,
  toGrayscale,
  type PixelBuffer
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
    // Left half: high chroma orange, right half: medium chroma purple.
    // Different chroma → different activation density → more horizontal
    // transitions with smaller cells.
    const source = createPixelBuffer(32, 32);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const idx = (y * 32 + x) * 4;
        if (x < 16) {
          source.data[idx] = 220; source.data[idx + 1] = 100; source.data[idx + 2] = 40;
        } else {
          source.data[idx] = 80;  source.data[idx + 1] = 70;  source.data[idx + 2] = 140;
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
    // 32×32 image: high-chroma red/orange top-left, low-chroma gray-blue
    // elsewhere.  Chroma‑driven activation should produce far more colored
    // cells in the top-left quadrant.
    const source = createPixelBuffer(32, 32);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const idx = (y * 32 + x) * 4;
        if (x < 16 && y < 16) {
          source.data[idx] = 220; source.data[idx + 1] = 90;  source.data[idx + 2] = 40;
        } else {
          source.data[idx] = 100; source.data[idx + 1] = 104; source.data[idx + 2] = 110;
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
    // Top-left has many more coloured active cells → higher R sum.
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

  it("inactive cells are neutral background (no source colour, no black)", () => {
    // Low-chroma source so many cells stay inactive.
    const source = createPixelBuffer(16, 16, [120, 118, 115, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 200, invert: false, monochrome: false
    });

    // No black pixels.
    for (let i = 0; i < output.data.length; i += 4) {
      expect(output.data[i]).not.toBe(0);
    }

    // Inactive cells are neutral (R=G=B=235).  Check for at least one.
    let hasBg = false;
    for (let i = 0; i < output.data.length; i += 4) {
      const r = output.data[i];
      const g = output.data[i + 1];
      const b = output.data[i + 2];
      if (r === 235 && g === 235 && b === 235) { hasBg = true; break; }
    }
    expect(hasBg).toBe(true);
  });

  it("dark source areas do not produce a solid dark base", () => {
    // Nearly black low-chroma source — very few cells should activate.
    const source = createPixelBuffer(16, 16, [12, 10, 8, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 50, invert: false, monochrome: false
    });

    // Most pixels should be checkerboard (≥190), not dark.
    let lightCount = 0;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] >= 190) lightCount++;
    }
    const totalPixels = output.data.length / 4;
    expect(lightCount).toBeGreaterThan(totalPixels * 0.75);
  });

  it("activated cells preserve source hue", () => {
    // Very saturated source — chroma high, so many cells activate.
    const source = createPixelBuffer(16, 16, [200, 60, 30, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });

    // Find at least one pixel that matches the source hue (R >> G, B).
    const expectedHue = 200 - 60; // approximate red dominance
    let foundHue = false;
    for (let i = 0; i < output.data.length; i += 4) {
      const r = output.data[i];
      const g = output.data[i + 1];
      if (r > g + 50) { foundHue = true; break; }
    }
    expect(foundHue).toBe(true);
  });

  it("larger cellSize produces larger visible square cells", () => {
    // Dual-colour source: high-chroma orange left, high-chroma purple right.
    // Both have chroma ~160 so activation is similar, but the two colours
    // create horizontal transitions that let us measure block size.
    const source = createPixelBuffer(64, 64);
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const idx = (y * 64 + x) * 4;
        if (x < 32) {
          source.data[idx] = 200; source.data[idx + 1] = 100; source.data[idx + 2] = 40;
        } else {
          source.data[idx] = 100; source.data[idx + 1] = 60;  source.data[idx + 2] = 180;
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

    // Count horizontal colour transitions along the first row.
    const runs = (buf: Uint8ClampedArray): number => {
      let count = 1;
      for (let x = 4; x < buf.length; x += 4) {
        if (buf[x] !== buf[x - 4]) count++;
      }
      return count;
    };
    expect(runs(large.data.subarray(0, 64 * 4))).toBeLessThan(
      runs(small.data.subarray(0, 64 * 4))
    );
  });

  it("lower threshold produces fewer active cells", () => {
    const source = createPixelBuffer(16, 16, [160, 80, 40, 255]);
    const low  = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 30, invert: false, monochrome: false
    });
    const high = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 200, invert: false, monochrome: false
    });

    // Count active (non-background) pixels.
    const activeCount = (buf: PixelBuffer): number => {
      let count = 0;
      for (let i = 0; i < buf.data.length; i += 4) {
        // Background is R=G=B=235; anything else is an active cell.
        if (buf.data[i] !== 235 || buf.data[i + 1] !== 235 || buf.data[i + 2] !== 235) {
          count++;
        }
      }
      return count;
    };
    expect(activeCount(low)).toBeLessThan(activeCount(high));
  });
});
