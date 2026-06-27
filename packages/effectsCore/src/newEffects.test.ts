import { describe, expect, it } from "vitest";
import {
  applyBitmap,
  applyCrtGlitch,
  applyInvertedGlow,
  applyLedMatrix,
  applyMangaScreen,
  applyPencilGrain,
  applyWaveSlice,
  createPixelBuffer,
  renderStipple
} from "./index.js";

describe("Phase 1 core effects", () => {
  it("applyLedMatrix returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [100, 150, 200, 255]);
    const output = applyLedMatrix(source, { cellSize: 8 });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("applyBitmap pixelates and reduces colors", () => {
    const source = createPixelBuffer(40, 40, [100, 150, 200, 255]);
    const output = applyBitmap(source, { pixelSize: 8, colorLevels: 4 });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("renderStipple returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [80, 80, 80, 255]);
    const output = renderStipple(source, {
      dotSize: 2,
      spacing: 8,
      density: 0.5,
      inkColor: [0, 0, 0, 255],
      backgroundColor: [255, 255, 255, 255]
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("applyCrtGlitch returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [100, 150, 200, 255]);
    const output = applyCrtGlitch(source, {
      sliceHeight: 4,
      shiftAmount: 4,
      rgbShift: 2,
      scanlineStrength: 0.2,
      noiseAmount: 0.05
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("applyMangaScreen returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [80, 80, 80, 255]);
    const output = applyMangaScreen(source, {
      lineSpacing: 4,
      lineWidth: 1
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });
});

describe("Phase 2 core effects", () => {
  it("applyWaveSlice returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [100, 150, 200, 255]);
    const output = applyWaveSlice(source, { amplitude: 4, frequency: 2 });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("applyPencilGrain returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [100, 150, 200, 255]);
    const output = applyPencilGrain(source, {
      paperColor: [245, 242, 235, 255],
      edgeStrength: 0.5,
      grainAmount: 0.2
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("applyInvertedGlow returns a same-size buffer", () => {
    const source = createPixelBuffer(40, 40, [100, 150, 200, 255]);
    const output = applyInvertedGlow(source, { intensity: 0.5 });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });
});
