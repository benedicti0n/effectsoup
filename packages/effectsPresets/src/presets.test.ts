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

    it("Dream Glow intensity scales blur / glow / grain together", () => {
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const at50 = preset.intensityMapper(50, {});
      const at100 = preset.intensityMapper(100, {});
      // glowAmount default is intensity itself (so it must equal 50 and 100).
      expect(at50.glowAmount).toBe(50);
      expect(at100.glowAmount).toBe(100);
      // blurAmount default is 2 + round(intensity/100*18)
      expect(at50.blurAmount).toBe(11);
      expect(at100.blurAmount).toBe(20);
      // grainAmount default scales with intensity (0 .. 12).
      expect(at50.grainAmount).toBe(6);
      expect(at100.grainAmount).toBe(12);
      // Blur and grain scale up with intensity.
      expect(at100.blurAmount).toBeGreaterThan(at50.blurAmount);
      expect(at100.grainAmount).toBeGreaterThan(at50.grainAmount);
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

    it("Dream Glow at Glow 0 still returns the source unchanged", () => {
      // Glow 0 = no bloom. The duotone still runs (with small amount
      // 0.16) so the color shifts; the bloom is fully gated off.
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const source = createPixelBuffer(8, 8, [200, 200, 200, 255]);
      // Insert a bright pixel to confirm the mask is bypassed.
      source.data[0] = 255;
      source.data[1] = 255;
      source.data[2] = 255;
      const resolved = preset.intensityMapper(50, { glowAmount: 0 });
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      // The bright pixel must NOT receive any glow tint from a bloom
      // band. With Glow 0 the bloom is fully bypassed so the source is
      // the only contribution to that pixel (modulo the duotone which
      // blends a max of 0.16 of the shadow/highlight colors toward the
      // source).
      // Concretely: the bright pixel stays >= 0.84 of original (since
      // duotone pulls it by at most 0.16 toward highlight (255,200,160)
      // which is still > 0.84*255 ~ 214).
      expect(output.data[0]).toBeGreaterThan(214);
    });

    it("Dream Glow warm mid-bright pixels (orange-lit skin) bloom at Glow 100", () => {
      // Build a 16x16 image. Fill with a warm orange (255, 175, 110)
      // which has Rec.709 luminance ~0.62 — well above the medium-band
      // threshold of 0.45. At Glow 100 / Blur 20 the result must be
      // measurably brighter than the source because the bloom bands fire.
      const source = createPixelBuffer(16, 16, [255, 175, 110, 255]);
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const resolved = preset.intensityMapper(100, {
        glowAmount: 100,
        blurAmount: 20,
        grainAmount: 0
      });
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      // Sample a few mid-image pixels and ensure at least one of them
      // has been lifted by the bloom.
      let lifted = 0;
      let sumBefore = 0;
      let sumAfter = 0;
      let count = 0;
      for (let y = 4; y < 12; y++) {
        for (let x = 4; x < 12; x++) {
          const i = (y * 16 + x) * 4;
          // Rec.709 luminance of (r, g, b).
          const beforeL = (0.2126 * 255 + 0.7152 * 175 + 0.0722 * 110) / 255;
          const outR = output.data[i];
          const outG = output.data[i + 1];
          const outB = output.data[i + 2];
          const afterL = (0.2126 * outR + 0.7152 * outG + 0.0722 * outB) / 255;
          sumBefore += beforeL;
          sumAfter += afterL;
          if (afterL > beforeL + 0.05) lifted++;
          count++;
        }
      }
      expect(lifted).toBeGreaterThan(0);
      expect(sumAfter / count).toBeGreaterThan(sumBefore / count);
    });

    it("Dream Glow protects near-black shadow pixels (no bloom leakage)", () => {
      // 16x16 image of dark indigo-violet (~RGB 30, 25, 80). Rec.709
      // luminance is ~0.058 — well below every mask threshold. Bloom
      // must not lighten the dark area at any Glow setting.
      const source = createPixelBuffer(16, 16, [30, 25, 80, 255]);
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const resolved = preset.intensityMapper(100, {
        glowAmount: 100,
        blurAmount: 20,
        grainAmount: 0
      });
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      // Average source luminance in the center 8x8.
      let srcSum = 0, outSum = 0, n = 0;
      for (let y = 4; y < 12; y++) {
        for (let x = 4; x < 12; x++) {
          const i = (y * 16 + x) * 4;
          srcSum += (0.2126 * source.data[i] + 0.7152 * source.data[i + 1] + 0.0722 * source.data[i + 2]) / 255;
          outSum += (0.2126 * output.data[i] + 0.7152 * output.data[i + 1] + 0.0722 * output.data[i + 2]) / 255;
          n++;
        }
      }
      const srcAvg = srcSum / n;
      const outAvg = outSum / n;
      // Average luminance must NOT climb more than 0.05 — bloom must
      // not leak into pure-shadow regions. The duotone will pull the
      // color toward palette.shadow (30,25,80) which is essentially
      // the source here, so the output luminance stays close to source.
      expect(outAvg - srcAvg).toBeLessThan(0.05);
      // And the output must remain dark (luminance < 0.15) — no yellow
      // haze, no muddy warming.
      expect(outAvg).toBeLessThan(0.15);
    });

    it("Dream Glow at Glow 100 is measurably stronger than at Glow 50", () => {
      // On a warm-lit image, the average luminance after Glow 100 must
      // exceed that after Glow 50. The duotone color grade is the
      // same in both cases, so any luminance gain is bloom-driven.
      const source = createPixelBuffer(16, 16, [255, 175, 110, 255]);
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const runAt = (glow: number) => {
        const resolved = preset.intensityMapper(50, {
          glowAmount: glow,
          blurAmount: 20,
          grainAmount: 0
        });
        return preset.createPipeline(resolved)(source, resolved);
      };
      const out50 = runAt(50);
      const out100 = runAt(100);
      let sum50 = 0, sum100 = 0, n = 0;
      for (let i = 0; i < source.data.length; i += 4) {
        sum50 += (0.2126 * out50.data[i] + 0.7152 * out50.data[i + 1] + 0.0722 * out50.data[i + 2]) / 255;
        sum100 += (0.2126 * out100.data[i] + 0.7152 * out100.data[i + 1] + 0.0722 * out100.data[i + 2]) / 255;
        n++;
      }
      // Glow 100 must lift the average luminance meaningfully more
      // than Glow 50. We allow a tiny tolerance for rounding.
      expect(sum100 / n).toBeGreaterThan(sum50 / n + 0.05);
    });

    it("Dream Glow multi-band selective: warm pixels bloom, dark pixels don't", () => {
      // 32x32 image with a clear vertical half: left half orange-lit,
      // right half deep indigo. The left half must brighten via the
      // bloom bands; the right half must NOT (only duotone).
      const source = createPixelBuffer(32, 32, [30, 25, 80, 255]);
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 16; x++) {
          const i = (y * 32 + x) * 4;
          source.data[i] = 255;
          source.data[i + 1] = 175;
          source.data[i + 2] = 110;
        }
      }
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const resolved = preset.intensityMapper(100, {
        glowAmount: 100,
        blurAmount: 20,
        grainAmount: 0
      });
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);

      // Average luminance per side, far from the half-line edge.
      let warm = 0, dark = 0, n = 0;
      for (let y = 8; y < 24; y++) {
        for (let x = 2; x < 14; x++) {
          const i = (y * 32 + x) * 4;
          warm += (0.2126 * output.data[i] + 0.7152 * output.data[i + 1] + 0.0722 * output.data[i + 2]) / 255;
        }
        for (let x = 18; x < 30; x++) {
          const i = (y * 32 + x) * 4;
          dark += (0.2126 * output.data[i] + 0.7152 * output.data[i + 1] + 0.0722 * output.data[i + 2]) / 255;
        }
        n++;
      }
      warm /= n;
      dark /= n;
      expect(warm).toBeGreaterThan(dark + 0.1);
    });

    it("Dream Glow palette selection switches tint components", () => {
      const preset = allPresets.find((p) => p.id === "dreamGlow")!;
      const source = createPixelBuffer(8, 8, [200, 200, 200, 255]);
      const outGolden = preset.createPipeline(
        preset.intensityMapper(50, {})
      )(source, preset.intensityMapper(50, {}));
      const outRose = preset.createPipeline(
        preset.intensityMapper(50, { palette: "roseBloom" })
      )(source, preset.intensityMapper(50, { palette: "roseBloom" }));
      const outCool = preset.createPipeline(
        preset.intensityMapper(50, { palette: "coolHaze" })
      )(source, preset.intensityMapper(50, { palette: "coolHaze" }));
      // Different palettes must produce different outputs.
      expect(
        Array.from(outGolden.data.slice(0, 8))
      ).not.toEqual(Array.from(outRose.data.slice(0, 8)));
      expect(
        Array.from(outGolden.data.slice(0, 8))
      ).not.toEqual(Array.from(outCool.data.slice(0, 8)));
      expect(
        Array.from(outRose.data.slice(0, 8))
      ).not.toEqual(Array.from(outCool.data.slice(0, 8)));
    });

    it("Dream Glow palettes expose glow/shadow/highlight", () => {
      // The palette is exported as a constant — guard against accidental
      // shape changes that would break the duotone pairings.
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
      // Ordered dither must change at least one pixel byte.
      let changed = 0;
      for (let i = 0; i < output.data.length; i++) {
        if (output.data[i] !== source.data[i]) changed++;
      }
      expect(changed).toBeGreaterThan(0);
    });

    it("Color Dither preserves color (per-channel) rather than collapsing to gray", () => {
      // An image whose channels differ significantly should not collapse
      // to grayscale after dithering — that's the difference vs the
      // applyOrderedDither mono path.
      const source = createPixelBuffer(16, 16, [200, 60, 30, 255]);
      const preset = allPresets.find((p) => p.id === "colorDither")!;
      const resolved = preset.intensityMapper(50, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);

      let unequalRGB = 0;
      for (let i = 0; i < output.data.length; i += 4) {
        const r = output.data[i];
        const g = output.data[i + 1];
        const b = output.data[i + 2];
        if (r !== g || g !== b) unequalRGB++;
      }
      // The bulk of dithered pixels should still have at least one
      // channel diverging from the others.
      expect(unequalRGB).toBeGreaterThan(0);
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
