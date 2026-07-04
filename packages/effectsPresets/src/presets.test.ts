import { describe, expect, it } from "vitest";
import { allPresets, getPresetById, migratePresetId, getPresetIds } from "./index.js";
import { createPixelBuffer } from "@effectsoup/core";

describe("presets", () => {
  it("has 25 presets total", () => {
    expect(allPresets.length).toBe(25);
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
    const preset = allPresets.find((p) => p.id === "noirGrain");
    expect(preset).toBeDefined();
    const resolved = preset!.intensityMapper(50, { contrast: 42 });
    expect(resolved.contrast).toBe(42);
  });

  it("preset ids are unique", () => {
    const ids = getPresetIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every advancedControlSchema has a unique id within its preset", () => {
    for (const preset of allPresets) {
      const ids = preset.advancedControlSchema.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  describe("default configurations", () => {
    it("Pixel Grid defaults to 4% intensity and 50% grid opacity", () => {
      const preset = allPresets.find((p) => p.id === "pixelGrid");
      expect(preset?.defaultIntensity).toBe(4);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(4);
      expect(resolved.gridOpacity).toBe(50);
    });

    it("Dot Halftone defaults to 5% intensity, source color, CMYK palette, dot size 5, dot spacing 2, grain 10", () => {
      const preset = allPresets.find((p) => p.id === "dotHalftone");
      expect(preset?.defaultIntensity).toBe(5);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(5);
      expect(resolved.colorMode).toBe("source");
      expect(resolved.palette).toBe("cmyk");
      expect(resolved.dotSize).toBe(5);
      expect(resolved.dotSpacing).toBe(2);
      expect(resolved.grainAmount).toBe(10);
    });

    it("Error Diffusion defaults to 60% intensity", () => {
      const preset = allPresets.find((p) => p.id === "errorDiffusionDither");
      expect(preset?.defaultIntensity).toBe(60);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(60);
    });

    it("Ordered Dither defaults to 60% intensity", () => {
      const preset = allPresets.find((p) => p.id === "orderedDither");
      expect(preset?.defaultIntensity).toBe(60);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(60);
    });

    it("Classic ASCII defaults to 1% intensity, font size 6, base opacity 40, Standard character set and Original Colors", () => {
      const preset = allPresets.find((p) => p.id === "classicAscii");
      expect(preset?.defaultIntensity).toBe(1);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(1);
      expect(resolved.fontSize).toBe(6);
      expect(resolved.baseOpacity).toBe(40);
      expect(resolved.characterSet).toBe("standard");
      expect(resolved.colorMode).toBe("originalColors");
    });

    it("Blocks ASCII defaults to 1% intensity, blocks character set, font size 6, base opacity 40, grain 15 and glow 0", () => {
      const preset = allPresets.find((p) => p.id === "blocksAscii");
      expect(preset?.defaultIntensity).toBe(1);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.characterSet).toBe("blocks");
      expect(resolved.colorMode).toBe("originalColors");
      expect(resolved.fontSize).toBe(6);
      expect(resolved.baseOpacity).toBe(40);
      expect(resolved.grainAmount).toBe(15);
      expect(resolved.glowAmount).toBe(0);
    });

    it("Minimal ASCII defaults to 1% intensity, minimal character set, font size 6, base opacity 40, density 2, grain 5 and glow 100", () => {
      const preset = allPresets.find((p) => p.id === "minimalAscii");
      expect(preset?.defaultIntensity).toBe(1);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.characterSet).toBe("minimal");
      expect(resolved.colorMode).toBe("originalColors");
      expect(resolved.fontSize).toBe(6);
      expect(resolved.baseOpacity).toBe(40);
      expect(resolved.density).toBe(2);
      expect(resolved.grainAmount).toBe(5);
      expect(resolved.glowAmount).toBe(100);
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
      expect(preset!.defaultIntensity).toBe(100);
    });

    it("Riso Offset defaults to 70% intensity and black paper", () => {
      const preset = allPresets.find((p) => p.id === "risoOffset");
      expect(preset?.defaultIntensity).toBe(70);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(70);
      expect(resolved.paperColor).toBe("#000000");
    });

    it("LED Matrix defaults to glow 100", () => {
      const preset = allPresets.find((p) => p.id === "ledMatrix");
      expect(preset).toBeDefined();
      expect(preset!.usesIntensity).toBe(false);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.glowAmount).toBe(100);
    });

    it("Manga Scanlines defaults to 50% intensity with line spacing 5, width 2, angle 0, threshold 95", () => {
      const preset = allPresets.find((p) => p.id === "mangaScanlines");
      expect(preset).toBeDefined();
      expect(preset!.category).toBe("printPaper");
      expect(preset!.defaultIntensity).toBe(50);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.lineSpacing).toBe(5);
      expect(resolved.lineWidth).toBe(2);
      expect(resolved.angle).toBe(0);
      expect(resolved.threshold).toBe(95);
    });

    it("Dream Glow defaults to a glowy look (glow >= 50, blur >= 8)", () => {
      const preset = allPresets.find((p) => p.id === "dreamGlow");
      expect(preset).toBeDefined();
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.glowAmount).toBeGreaterThanOrEqual(50);
      expect(resolved.blurAmount).toBeGreaterThanOrEqual(8);
    });

    it("Luminous ASCII Bloom defaults to 1% intensity, density 10, bloom radius 24, base opacity 40, grain 5 and glow 6", () => {
      const preset = allPresets.find((p) => p.id === "luminousAsciiBloom");
      expect(preset?.defaultIntensity).toBe(1);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(1);
      expect(resolved.density).toBe(10);
      expect(resolved.bloomRadius).toBe(24);
      expect(resolved.baseOpacity).toBe(40);
      expect(resolved.grainAmount).toBe(5);
      expect(resolved.glowAmount).toBe(6);
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

    it("migrates legacy monoDither to errorDiffusionDither", () => {
      expect(migratePresetId("monoDither")).toBe("errorDiffusionDither");
      expect(getPresetById("monoDither")?.id).toBe("errorDiffusionDither");
    });

    it("migrates legacy mangaGrid to pixelGrid", () => {
      expect(migratePresetId("mangaGrid")).toBe("pixelGrid");
      expect(getPresetById("mangaGrid")?.id).toBe("pixelGrid");
    });

    it("Cubic Glass defaults to 40% intensity and distortionGlass category", () => {
      const preset = allPresets.find((p) => p.id === "cubicGlass");
      expect(preset).toBeDefined();
      expect(preset!.category).toBe("distortionGlass");
      expect(preset!.defaultIntensity).toBe(40);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.tileSize).toBeGreaterThanOrEqual(4);
      expect(resolved.frost).toBeGreaterThanOrEqual(40);
    });

    it("Cyber ASCII keeps dark backgrounds dark on a low-key input", () => {
      const preset = allPresets.find((p) => p.id === "cyberAscii")!;
      const source = createPixelBuffer(60, 60, [25, 25, 25, 255]);
      const resolved = preset.intensityMapper(preset.defaultIntensity, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);

      // True background pixels should remain near the dark background color.
      let hasDarkBackground = false;
      let hasBrightGlyph = false;
      for (let i = 0; i < output.data.length; i += 4) {
        const r = output.data[i];
        const g = output.data[i + 1];
        const b = output.data[i + 2];
        if (r <= 30 && g <= 30 && b <= 35) hasDarkBackground = true;
        if (r > 50 || g > 50 || b > 50) hasBrightGlyph = true;
      }
      expect(hasDarkBackground).toBe(true);
      expect(hasBrightGlyph).toBe(true);
    });

    it("Minimal ASCII places glyphs in dark-detail and edge regions", () => {
      const preset = allPresets.find((p) => p.id === "minimalAscii")!;
      // Mid-gray background with a darker disk; the disk should draw glyphs,
      // while the background should stay mostly empty.
      const source = createPixelBuffer(60, 60, [100, 100, 100, 255]);
      const cx = 30;
      const cy = 30;
      for (let y = 0; y < 60; y++) {
        for (let x = 0; x < 60; x++) {
          if ((x - cx) ** 2 + (y - cy) ** 2 <= 18 ** 2) {
            const idx = (y * 60 + x) * 4;
            source.data[idx] = 50;
            source.data[idx + 1] = 50;
            source.data[idx + 2] = 50;
          }
        }
      }

      // Disable atmosphere glow/grain and base opacity so the test measures glyph placement only.
      const resolved = preset.intensityMapper(preset.defaultIntensity, { glowAmount: 0, grainAmount: 0, baseOpacity: 0 });
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);

      let diskDrawn = 0;
      let backgroundDrawn = 0;
      for (let y = 0; y < 60; y++) {
        for (let x = 0; x < 60; x++) {
          const idx = (y * 60 + x) * 4;
          const inside = (x - cx) ** 2 + (y - cy) ** 2 <= 18 ** 2;
          if (output.data[idx] > 15 || output.data[idx + 1] > 15 || output.data[idx + 2] > 15) {
            if (inside) diskDrawn++;
            else backgroundDrawn++;
          }
        }
      }
      expect(diskDrawn).toBeGreaterThan(backgroundDrawn * 2);
    });

    it("Minimal ASCII stays sparser than Classic ASCII for the same input", () => {
      const minimal = allPresets.find((p) => p.id === "minimalAscii")!;
      const classic = allPresets.find((p) => p.id === "classicAscii")!;
      const source = createPixelBuffer(60, 60, [120, 120, 120, 255]);

      // Disable atmosphere glow/grain and base opacity so the comparison is based on glyph coverage.
      const minimalResolved = minimal.intensityMapper(minimal.defaultIntensity, { glowAmount: 0, grainAmount: 0, baseOpacity: 0 });
      const classicResolved = classic.intensityMapper(classic.defaultIntensity, { glowAmount: 0, grainAmount: 0, baseOpacity: 0 });

      const minimalOutput = minimal.createPipeline(minimalResolved)(source, minimalResolved);
      const classicOutput = classic.createPipeline(classicResolved)(source, classicResolved);

      let minimalDrawn = 0;
      let classicDrawn = 0;
      for (let i = 0; i < source.data.length; i += 4) {
        if (minimalOutput.data[i] > 20 || minimalOutput.data[i + 1] > 20 || minimalOutput.data[i + 2] > 20) {
          minimalDrawn++;
        }
        if (classicOutput.data[i] > 20 || classicOutput.data[i + 1] > 20 || classicOutput.data[i + 2] > 20) {
          classicDrawn++;
        }
      }
      expect(minimalDrawn).toBeLessThan(classicDrawn);
    });
  });
});
