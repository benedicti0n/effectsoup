import { describe, expect, it } from "vitest";
import { createPixelBuffer } from "./buffer.js";
import { renderStipple } from "./stipple.js";

function countDots(buf: ReturnType<typeof renderStipple>): number {
  // Ink is pure black; background is white. Count pixels where R, G,
  // and B are all below the background (white) value.
  let n = 0;
  for (let i = 0; i < buf.data.length; i += 4) {
    if (buf.data[i] < 255 && buf.data[i + 1] < 255 && buf.data[i + 2] < 255) {
      n++;
    }
  }
  return n;
}

describe("renderStipple", () => {
  it("produces more dots in dark cells than light cells", () => {
    const W = 40;
    const H = 40;
    // Build a source where the top half is dark and the bottom half is
    // light. After stippling, the top half should contain strictly more
    // dots than the bottom half (the per-cell density curve favors
    // dark cells).
    const src = createPixelBuffer(W, H, [255, 255, 255, 255]);
    for (let y = 0; y < H / 2; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        src.data[idx] = 10;
        src.data[idx + 1] = 10;
        src.data[idx + 2] = 10;
      }
    }
    const out = renderStipple(src, {
      dotSize: 1,
      spacing: 4,
      density: 1,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255]
    });
    let darkDots = 0;
    let lightDots = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        if (out.data[idx] < 255 && out.data[idx + 1] < 255 && out.data[idx + 2] < 255) {
          if (y < H / 2) darkDots++;
          else lightDots++;
        }
      }
    }
    expect(darkDots).toBeGreaterThan(lightDots);
  });

  it("never leaves a midtone-dark cell empty", () => {
    // A cell with darkness > 0.45 should always contain at least one
    // dot, so the dark regions never look empty.
    const W = 32;
    const H = 32;
    const src = createPixelBuffer(W, H, [255, 255, 255, 255]);
    // Fill the entire buffer with midtone-dark (~0.55 darkness).
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 100;
      src.data[i + 1] = 100;
      src.data[i + 2] = 100;
    }
    const out = renderStipple(src, {
      dotSize: 1,
      spacing: 4,
      density: 1,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255]
    });
    expect(countDots(out)).toBeGreaterThan(0);
  });

  it("respects the density parameter", () => {
    const W = 32;
    const H = 32;
    const src = createPixelBuffer(W, H, [10, 10, 10, 255]); // all dark
    const low = renderStipple(src, {
      dotSize: 1,
      spacing: 4,
      density: 0.25,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255]
    });
    const high = renderStipple(src, {
      dotSize: 1,
      spacing: 4,
      density: 1.0,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255]
    });
    expect(countDots(high)).toBeGreaterThan(countDots(low));
  });

  it("rejects invalid parameters", () => {
    const src = createPixelBuffer(8, 8);
    expect(() =>
      renderStipple(src, {
        dotSize: 0,
        spacing: 4,
        density: 1,
        inkColor: [0, 0, 0, 255],
        backgroundColor: [255, 255, 255, 255]
      })
    ).toThrow();
    expect(() =>
      renderStipple(src, {
        dotSize: 1,
        spacing: 0,
        density: 1,
        inkColor: [0, 0, 0, 255],
        backgroundColor: [255, 255, 255, 255]
      })
    ).toThrow();
    expect(() =>
      renderStipple(src, {
        dotSize: 1,
        spacing: 4,
        density: 1.5,
        inkColor: [0, 0, 0, 255],
        backgroundColor: [255, 255, 255, 255]
      })
    ).toThrow();
  });
});
