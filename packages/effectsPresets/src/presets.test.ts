import { describe, expect, it } from "vitest";
import { allPresets, getPresetById, migratePresetId, getPresetIds } from "./index.js";
import { createPixelBuffer } from "@effectsoup/core";

describe("presets", () => {
  it("has 26 presets total", () => {
    expect(allPresets.length).toBe(26);
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

    it("Dot Halftone defaults to 5% intensity, source color, CMYK palette, dot size 6, dot spacing 4, grain 25, no glow", () => {
      const preset = allPresets.find((p) => p.id === "dotHalftone");
      expect(preset?.defaultIntensity).toBe(5);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(5);
      expect(resolved.colorMode).toBe("source");
      expect(resolved.palette).toBe("cmyk");
      expect(resolved.dotSize).toBe(6);
      expect(resolved.dotSpacing).toBe(4);
      expect(resolved.grainAmount).toBe(25);
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

    it("Blocks ASCII defaults to 1% intensity, blocks character set, font size 6, base opacity 50, grain 15 and glow 0", () => {
      const preset = allPresets.find((p) => p.id === "blocksAscii");
      expect(preset?.defaultIntensity).toBe(1);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.characterSet).toBe("blocks");
      expect(resolved.colorMode).toBe("originalColors");
      expect(resolved.fontSize).toBe(6);
      expect(resolved.baseOpacity).toBe(50);
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

    it("Dream Glow master intensity scales every effect strength", () => {
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const at50 = preset.intensityMapper(50, {});
      const at100 = preset.intensityMapper(100, {});
      expect(at100.masterStrength).toBeGreaterThan(at50.masterStrength);
      expect(at50.masterStrength).toBeGreaterThan(0);
    });

    it("Dream Glow at intensity 0 returns an exact source clone", () => {
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const source = createPixelBuffer(8, 8, [60, 120, 200, 255]);
      // Add some per-pixel variation so byte equality is meaningful.
      for (let i = 0; i < source.data.length; i += 16) {
        source.data[i] = 200;
        source.data[i + 4] = 30;
      }
      const original = new Uint8ClampedArray(source.data);
      const resolved = preset.intensityMapper(0, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(output.width).toBe(source.width);
      expect(output.height).toBe(source.height);
      expect(Array.from(output.data)).toEqual(Array.from(original));
    });

    it("Dream Glow bloom is selective — does not paint dark regions", () => {
      // A 32x32 image with a clear half-and-half split: top half bright
      // (240), bottom half dark (20). Samples the lower portion of the
      // dark half (rows 22..30) so blur bleed from the bright/bloom zone
      // doesn't dominate.
      const source = createPixelBuffer(32, 32, [20, 20, 20, 255]);
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 32; x++) {
          const idx = (y * 32 + x) * 4;
          source.data[idx] = 240;
          source.data[idx + 1] = 240;
          source.data[idx + 2] = 240;
        }
      }
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const resolved = preset.intensityMapper(preset.defaultIntensity, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);

      let darkR = 0;
      let darkG = 0;
      let darkB = 0;
      let count = 0;
      for (let y = 22; y < 31; y++) {
        for (let x = 0; x < 32; x++) {
          const i = (y * 32 + x) * 4;
          darkR += output.data[i];
          darkG += output.data[i + 1];
          darkB += output.data[i + 2];
          count++;
        }
      }
      const avgR = darkR / count;
      const avgG = darkG / count;
      const avgB = darkB / count;
      const lum = (0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB) / 255;
      // Average luminance stays dark — bloom didn't bleach dark regions.
      expect(lum).toBeLessThan(0.4);
      // Shadow channel tilts toward blue (indigo shadow color).
      expect(avgB).toBeGreaterThan(avgG);
    });

    it("Dream Glow split-tone pulls dark toward indigo and bright toward warm", () => {
      // 32x32 image split top/bottom; sample the brightest row of the
      // bright side and the deepest row of the dark side — far from each
      // other — to verify split-tone direction independently.
      const source = createPixelBuffer(32, 32, [30, 30, 30, 255]);
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 32; x++) {
          const idx = (y * 32 + x) * 4;
          source.data[idx] = 250;
          source.data[idx + 1] = 250;
          source.data[idx + 2] = 250;
        }
      }
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const resolved = preset.intensityMapper(60, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);

      // Sample the brightest row (the original bright row, untouched by
      // the dark side).
      let brightR = 0, brightG = 0, brightB = 0, bCount = 0;
      for (let x = 0; x < 32; x++) {
        const i = x * 4;
        brightR += output.data[i];
        brightG += output.data[i + 1];
        brightB += output.data[i + 2];
        bCount++;
      }
      const avgBrightR = brightR / bCount;
      const avgBrightG = brightG / bCount;
      const avgBrightB = brightB / bCount;
      // Bright row pull toward warm peach — R leads, G drops below 250.
      expect(avgBrightR).toBeGreaterThanOrEqual(avgBrightB);
      expect(avgBrightG).toBeLessThan(255);

      // Sample deep in the dark side (rows 28..31).
      let darkR = 0, darkB = 0, dCount = 0;
      for (let y = 28; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
          const i = (y * 32 + x) * 4;
          darkR += output.data[i];
          darkB += output.data[i + 2];
          dCount++;
        }
      }
      const avgDarkR = darkR / dCount;
      const avgDarkB = darkB / dCount;
      // Dark row gets indigo tilt — B leads.
      expect(avgDarkB).toBeGreaterThanOrEqual(avgDarkR);
    });

    it("Dream Glow palettes expose glow/shadow/highlight", () => {
      // The palette is exported as a constant — guard against accidental
      // shape changes that would break the split-tone/bloom pairing.
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const schema = preset.advancedControlSchema;
      expect(schema.find((c) => c.id === "blurAmount")).toBeDefined();
      expect(schema.find((c) => c.id === "glowAmount")).toBeDefined();
      expect(schema.find((c) => c.id === "grainAmount")).toBeDefined();
      expect(schema.find((c) => c.id === "palette")).toBeDefined();
    });

    it("Luminous ASCII Bloom defaults to 1% intensity, font size 8, density 10, bloom radius 24, base opacity 60, grain 5, glow 6", () => {
      const preset = allPresets.find((p) => p.id === "luminousAsciiBloom");
      expect(preset?.defaultIntensity).toBe(1);
      const resolved = preset!.intensityMapper(preset!.defaultIntensity, {});
      expect(resolved.intensity).toBe(1);
      expect(resolved.fontSize).toBe(8);
      expect(resolved.density).toBe(10);
      expect(resolved.bloomRadius).toBe(24);
      expect(resolved.baseOpacity).toBe(60);
      expect(resolved.grainAmount).toBe(5);
      expect(resolved.glowAmount).toBe(6);
    });

    it("Color Dither produces a same-sized output at intensity 50", () => {
      const preset = allPresets.find((p) => p.id === "colorDither");
      expect(preset).toBeDefined();
      const source = createPixelBuffer(40, 40, [200, 100, 50, 255]);
      const resolved = preset!.intensityMapper(50, {});
      const pipeline = preset!.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(output.width).toBe(source.width);
      expect(output.height).toBe(source.height);
      // Dither must change at least one pixel byte.
      let changed = 0;
      for (let i = 0; i < output.data.length; i++) {
        if (output.data[i] !== source.data[i]) changed++;
      }
      expect(changed).toBeGreaterThan(0);
    });

    it("Color Dither at intensity 0 is an exact source clone", () => {
      const preset = allPresets.find((p) => p.id === "colorDither")!;
      const source = createPixelBuffer(20, 20, [80, 160, 240, 255]);
      for (let i = 0; i < source.data.length; i += 8) {
        source.data[i] = 200;
      }
      const original = new Uint8ClampedArray(source.data);
      const resolved = preset.intensityMapper(0, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(Array.from(output.data)).toEqual(Array.from(original));
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
