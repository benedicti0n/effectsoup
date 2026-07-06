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
    // Two distinct colour halves so Bayer‑driven luminance offsets
    // produce different visible patterns at cellSize 4 vs 8.
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
    // 32×32 image: bright orange top‑left, dull gray‑blue elsewhere.
    // Both halves get the same Bayer offset but the underlying colours
    // are different, so the bright half has a higher R sum.
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

  it("every cell is source-derived (no fixed background colour)", () => {
    const source = createPixelBuffer(16, 16, [160, 100, 60, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });

    // No cell is 235,235,235 (the old neutral background value).
    for (let i = 0; i < output.data.length; i += 4) {
      const r = output.data[i];
      const g = output.data[i + 1];
      const b = output.data[i + 2];
      expect(r === 235 && g === 235 && b === 235).toBe(false);
    }

    // Every pixel carries source‑derived hue (R≠G for this warm source).
    let hasHue = false;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] !== output.data[i + 1]) { hasHue = true; break; }
    }
    expect(hasHue).toBe(true);
  });

  it("dark source produces dark cells (no light gaps)", () => {
    const source = createPixelBuffer(16, 16, [12, 10, 8, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });

    // Every cell should remain dark (nothing close to the old 235 bg).
    for (let i = 0; i < output.data.length; i += 4) {
      expect(output.data[i]).toBeLessThan(60);
    }
  });

  it("activated cells preserve source hue", () => {
    const source = createPixelBuffer(16, 16, [200, 60, 30, 255]);
    const output = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 128, invert: false, monochrome: false
    });

    // Find at least one pixel with the source's warm hue (R >> G).
    let foundHue = false;
    for (let i = 0; i < output.data.length; i += 4) {
      const r = output.data[i];
      const g = output.data[i + 1];
      if (r > g + 50) { foundHue = true; break; }
    }
    expect(foundHue).toBe(true);
  });

  it("larger cellSize produces larger visible square cells", () => {
    // Two distinct colour halves create horizontal colour transitions.
    // The Bayer luminance offsets produce different patterns at
    // cellSize 4 vs 8; the runs are coarser at larger cellSize.
    const source = createPixelBuffer(64, 64);
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const idx = (y * 64 + x) * 4;
        if (x < 32) {
          source.data[idx] = 200; source.data[idx + 1] = 100; source.data[idx + 2] = 40;
        } else {
          source.data[idx] = 130; source.data[idx + 1] = 125; source.data[idx + 2] = 140;
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
    expect(runs(large.data.subarray(0, 64 * 4))).toBeLessThan(
      runs(small.data.subarray(0, 64 * 4))
    );
  });

  it("threshold controls dither amplitude (higher = more variation)", () => {
    const source = createPixelBuffer(16, 16, [128, 128, 128, 255]);

    // At threshold = 0 there is NO luminance offset → all cells identical.
    const none = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 0, invert: false, monochrome: false
    });
    const firstVal = none.data[0];
    for (let i = 4; i < none.data.length; i += 4) {
      expect(none.data[i]).toBe(firstVal);
    }

    // At threshold = 255 the maximum dither offset (±30) creates
    // many distinct luminance values across the 4×4 Bayer grid.
    const max = applyOrderedColorDither(source, {
      cellSize: 4, threshold: 255, invert: false, monochrome: false
    });
    const uniqueVals = new Set<number>();
    for (let i = 0; i < max.data.length; i += 4) uniqueVals.add(max.data[i]);
    expect(uniqueVals.size).toBeGreaterThan(8);
  });
});
