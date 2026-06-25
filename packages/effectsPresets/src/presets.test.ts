import { describe, expect, it } from "vitest";
import { allPresets, freePresets, premiumPresets } from "./index.js";
import { createPixelBuffer } from "@imageeffects/core";

describe("presets", () => {
  it("has 16 presets total", () => {
    expect(allPresets.length).toBe(16);
  });

  it("has 9 free and 7 premium presets", () => {
    expect(freePresets.length).toBe(9);
    expect(premiumPresets.length).toBe(7);
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
  }, 15000);

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

    it("Classic ASCII defaults to 15% intensity, Standard character set and Original Colors", () => {
      const preset = allPresets.find((p) => p.id === "classicAscii");
      expect(preset?.defaultIntensity).toBe(15);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(15);
      expect(resolved.characterSet).toBe("standard");
      expect(resolved.colorMode).toBe("originalColors");
    });

    it("Blocks ASCII defaults to blocks character set", () => {
      const preset = allPresets.find((p) => p.id === "blocksAscii");
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.characterSet).toBe("blocks");
      expect(resolved.colorMode).toBe("originalColors");
    });

    it("Minimal ASCII defaults to minimal character set", () => {
      const preset = allPresets.find((p) => p.id === "minimalAscii");
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.characterSet).toBe("minimal");
      expect(resolved.colorMode).toBe("originalColors");
    });

    it("Cyber ASCII defaults to 15% intensity, font size 6, and Original Colors", () => {
      const preset = allPresets.find((p) => p.id === "cyberAscii");
      expect(preset?.defaultIntensity).toBe(15);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(15);
      expect(resolved.fontSize).toBe(6);
      expect(resolved.colorMode).toBe("originalColors");
    });

    it("Cyber ASCII Tint mode defaults to terminal green", () => {
      const preset = allPresets.find((p) => p.id === "cyberAscii");
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, { colorMode: "tint" });
      expect(resolved.colorMode).toBe("tint");
      expect(resolved.tintPreset).toBe("terminalGreen");
      expect(resolved.tintColor).toBe("#00FF88");
    });

    it("Symbol Glow appears in the registry under ASCII & Symbols", () => {
      const preset = allPresets.find((p) => p.id === "symbolGlow");
      expect(preset).toBeDefined();
      expect(preset!.category).toBe("asciiSymbols");
      expect(preset!.defaultIntensity).toBe(40);
    });

    it("Riso Offset defaults to 70% intensity and black paper", () => {
      const preset = allPresets.find((p) => p.id === "risoOffset");
      expect(preset?.defaultIntensity).toBe(70);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(70);
      expect(resolved.paperColor).toBe("#000000");
    });

    it("Luminous ASCII Bloom defaults to 5% intensity and density 10", () => {
      const preset = allPresets.find((p) => p.id === "luminousAsciiBloom");
      expect(preset?.defaultIntensity).toBe(5);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(5);
      expect(resolved.density).toBe(10);
    });

    it("Duotone defaults to black shadow", () => {
      const preset = allPresets.find((p) => p.id === "duotone");
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.shadowColor).toBe("#000000");
    });

    it("Noir Grain defaults to 70% grain", () => {
      const preset = allPresets.find((p) => p.id === "noirGrain");
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.grainAmount).toBe(70);
    });

    it("Symbol Glow produces deterministic output for the same input and settings", () => {
      const preset = allPresets.find((p) => p.id === "symbolGlow")!;
      const source = createPixelBuffer(80, 80, [128, 128, 128, 255]);
      const resolved = preset.intensityMapper(preset.defaultIntensity, {});
      const pipeline = preset.createPipeline(resolved);
      const outputA = pipeline(source, resolved);
      const outputB = pipeline(source, resolved);
      expect(outputA.data).toEqual(outputB.data);
    });

    it("Symbol Glow does not crash with custom symbol sets", () => {
      const preset = allPresets.find((p) => p.id === "symbolGlow")!;
      const source = createPixelBuffer(80, 80, [128, 128, 128, 255]);
      const resolved = preset.intensityMapper(preset.defaultIntensity, {
        symbolSet: "custom",
        customSymbols: "XO"
      });
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(output.width).toBe(source.width);
      expect(output.height).toBe(source.height);
    });
  });
});
