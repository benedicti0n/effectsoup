import { describe, expect, it } from "vitest";
import { allPresets, freePresets, premiumPresets } from "./index.js";
import { createPixelBuffer } from "@imageeffects/core";

describe("presets", () => {
  it("has 13 presets total", () => {
    expect(allPresets.length).toBe(13);
  });

  it("has 7 free and 6 premium presets", () => {
    expect(freePresets.length).toBe(7);
    expect(premiumPresets.length).toBe(6);
  });

  it("every preset resolves valid defaults", () => {
    for (const preset of allPresets) {
      const resolved = preset.intensityMapper(preset.defaultIntensity, {});
      expect(resolved.intensity).toBe(preset.defaultIntensity);
      expect(resolved.advancedOverrides).toEqual({});
    }
  });

  it("every preset pipeline produces output at requested size", () => {
    const source = createPixelBuffer(100, 100, [128, 128, 128, 255]);
    for (const preset of allPresets) {
      const resolved = preset.intensityMapper(50, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(output.width).toBe(source.width);
      expect(output.height).toBe(source.height);
      expect(output.data.length).toBe(source.data.length);
    }
  });

  it("every preset returns source unchanged at 0% intensity", () => {
    const source = createPixelBuffer(100, 100, [128, 128, 128, 255]);
    for (const preset of allPresets) {
      const resolved = preset.intensityMapper(0, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(output.data).toEqual(source.data);
    }
  });

  it("advanced overrides take precedence", () => {
    const preset = allPresets[0];
    if (!preset) return;
    const resolved = preset.intensityMapper(50, { contrast: 42 });
    expect(resolved.contrast).toBe(42);
  });

  describe("default configurations", () => {
    it("Pixel Grid defaults to 5% intensity", () => {
      const preset = allPresets.find((p) => p.id === "pixelGrid");
      expect(preset?.defaultIntensity).toBe(5);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(5);
    });

    it("Dot Halftone defaults to 21% intensity, source color, CMYK palette, dot size 12, dot spacing 6", () => {
      const preset = allPresets.find((p) => p.id === "dotHalftone");
      expect(preset?.defaultIntensity).toBe(21);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(21);
      expect(resolved.colorMode).toBe("source");
      expect(resolved.palette).toBe("cmyk");
      expect(resolved.dotSize).toBe(12);
      expect(resolved.dotSpacing).toBe(6);
    });

    it("Manga Grid defaults to 5% intensity with poster levels 4, edge emphasis 25, grid opacity 20", () => {
      const preset = allPresets.find((p) => p.id === "mangaGrid");
      expect(preset?.defaultIntensity).toBe(5);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(5);
      expect(resolved.posterLevels).toBe(4);
      expect(resolved.edgeStrength).toBe(25);
      expect(resolved.gridOpacity).toBe(20);
    });
  });
});
