import {
  applyBoxBlur,
  applyCubicGlass,
  applyDuotone,
  applyGlow,
  applyGrain,
  applyGridOverlay,
  applyNoise,
  applyPosterize,
  applyRgbShift,
  applyScanlines,
  applyTint,
  applyVignette,
  clampByte,
  clonePixelBuffer,
  normalizeCustomCharset,
  renderAscii,
  renderLuminousAsciiBloom,
  renderSymbolGlow,
  resizeNearestNeighbor,
  type PixelBuffer,
  type RgbaColor
} from "@imageeffects/core";
import type {
  AdvancedControlDefinition,
  EffectPipeline,
  EffectPreset,
  ResolvedPresetParameters
} from "./types.js";

const atmosphereAdvancedControls: AdvancedControlDefinition[] = [
  { id: "grainAmount", name: "Grain", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
  { id: "glowAmount", name: "Glow", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 }
];

function resolveOverride<T extends number | string | boolean>(
  overrides: Record<string, number | string | boolean>,
  key: string,
  defaultValue: T
): T {
  const value = overrides[key];
  if (value === undefined) return defaultValue;
  return value as T;
}

function hexToRgba(hex: string): RgbaColor {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

const CYBER_TINT_PRESETS: Record<string, string> = {
  terminalGreen: "#00FF88",
  electricCyan: "#00f0ff",
  amberCrt: "#FFB000",
  violetCode: "#B388FF"
};

const ATMOSPHERE_TINT_PRESETS: Record<string, string> = {
  warmPink: "#ff5c9a",
  coolCyan: "#00f0ff",
  amberCrt: "#FFB000",
  mint: "#7CFFC4",
  custom: "#ff5c9a"
};

const cyberAsciiPreset: EffectPreset = {
  id: "cyberAscii",
  name: "Cyber ASCII",
  description: "Colored terminal-like character image with a technical glyph set and neon glow.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 15,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 6 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["originalColors", "tint", "monochrome"], defaultValue: "originalColors" },
    { id: "tintPreset", name: "Tint Preset", type: "select", options: ["terminalGreen", "electricCyan", "amberCrt", "violetCode"], defaultValue: "terminalGreen" },
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#00FF88" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => {
    const tintPreset = resolveOverride(overrides, "tintPreset", "terminalGreen");
    const defaultTintColor = CYBER_TINT_PRESETS[tintPreset] ?? CYBER_TINT_PRESETS.terminalGreen;
    return {
      intensity,
      advancedOverrides: overrides,
      fontSize: resolveOverride(overrides, "fontSize", 6),
      density: resolveOverride(overrides, "density", 2 + Math.round((intensity / 100) * 8)),
      colorMode: resolveOverride(overrides, "colorMode", "originalColors"),
      tintPreset,
      tintColor: resolveOverride(overrides, "tintColor", defaultTintColor),
      glowAmount: resolveOverride(overrides, "glowAmount", 40 + Math.round((intensity / 100) * 30)),
      grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 20))
    };
  },
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 10;
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 10));
      const colorMode = (params.colorMode as string) ?? "originalColors";
      const tintColor = hexToRgba((params.tintColor as string) ?? "#00FF88");
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      // Technical glyph set with more symbols for detail.
      const charset = " .:-=+*#%@01/\\|<>[]{}";
      const trimmedCharset = charset.slice(0, Math.max(2, density + 12));

      const renderColorMode: "monochrome" | "color" | "source" =
        colorMode === "monochrome" ? "monochrome" : colorMode === "tint" ? "color" : "source";
      const inkColor = colorMode === "tint" ? tintColor : [100, 200, 255, 255] as RgbaColor;

      const result = renderAscii(source, {
        fontSize,
        inkColor,
        backgroundColor: [2, 2, 8, 255],
        charset: trimmedCharset,
        colorMode: renderColorMode,
        minGlyphLuminance: 0.25
      });

      // Subtle scanline grid.
      applyGridOverlay(result, {
        cellSize: Math.max(2, Math.round(fontSize * 1.4)),
        opacity: 0.08,
        style: "darken",
        lineWidth: 1
      });

      if (glowAmount > 0) {
        // Build a glow layer from the glyphs alone so the dark background
        // is not lifted by a global screen pass. The blurred glyph mask is
        // thresholded to remove low-level bleed, then colorized and screened
        // only where glyphs actually exist.
        const glyphGlow = renderAscii(source, {
          fontSize,
          inkColor: [255, 255, 255, 255],
          backgroundColor: [0, 0, 0, 255],
          charset: trimmedCharset,
          colorMode: "monochrome",
          backgroundMode: "solid"
        });
        const radius = Math.max(1, Math.round(glowAmount * 8));
        applyBoxBlur(glyphGlow, radius);

        const glowColor = colorMode === "originalColors" ? [100, 200, 255, 255] : tintColor;
        const floor = 40;
        for (let i = 0; i < glyphGlow.data.length; i += 4) {
          const lum = Math.max(glyphGlow.data[i], glyphGlow.data[i + 1], glyphGlow.data[i + 2]);
          if (lum < floor) {
            glyphGlow.data[i] = 0;
            glyphGlow.data[i + 1] = 0;
            glyphGlow.data[i + 2] = 0;
          } else {
            const scale = (lum - floor) / (255 - floor);
            glyphGlow.data[i] = clampByte(glowColor[0] * scale);
            glyphGlow.data[i + 1] = clampByte(glowColor[1] * scale);
            glyphGlow.data[i + 2] = clampByte(glowColor[2] * scale);
          }
        }

        // Add the localized glow back over the crisp glyph result.
        for (let i = 0; i < result.data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            const base = result.data[i + c];
            const glow = glyphGlow.data[i + c];
            result.data[i + c] = clampByte(
              255 - ((255 - base) * (255 - glow)) / 255
            );
          }
        }
      }

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const symbolGlowPreset: EffectPreset = {
  id: "symbolGlow",
  name: "Symbol Glow",
  description: "Glowing symbols over a dreamy blurred image.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 40,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "symbolSet", name: "Symbol Set", type: "select", options: ["bloomSymbols", "softMath", "technical", "minimal", "custom"], defaultValue: "bloomSymbols" },
    { id: "customSymbols", name: "Custom Symbols", type: "text", defaultValue: "" },
    { id: "baseBlur", name: "Base Blur", type: "range", min: 0, max: 32, step: 1, defaultValue: 10 },
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 32, step: 1, defaultValue: 10 },
    { id: "glowIntensity", name: "Glow Intensity", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
    { id: "threshold", name: "Highlight Threshold", type: "range", min: 0, max: 100, step: 1, defaultValue: 55 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["colored", "monochrome"], defaultValue: "colored" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 12),
    symbolSet: resolveOverride(overrides, "symbolSet", "bloomSymbols"),
    customSymbols: resolveOverride(overrides, "customSymbols", ""),
    baseBlur: resolveOverride(overrides, "baseBlur", 10),
    glowRadius: resolveOverride(overrides, "glowRadius", 10),
    glowIntensity: resolveOverride(overrides, "glowIntensity", 50),
    threshold: resolveOverride(overrides, "threshold", 55),
    colorMode: resolveOverride(overrides, "colorMode", "colored"),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const symbolSetName = (params.symbolSet as string) ?? "bloomSymbols";
      const customSymbols = (params.customSymbols as string) ?? "";
      const baseBlur = (params.baseBlur as number) ?? 10;
      const glowRadius = (params.glowRadius as number) ?? 10;
      const glowIntensity = ((params.glowIntensity as number) ?? 50) / 100;
      const threshold = ((params.threshold as number) ?? 55) / 100;
      const colorMode = (params.colorMode as string) ?? "colored";

      const symbolSets: Record<string, string> = {
        bloomSymbols: "2*+/=e",
        softMath: "+-*/=∞∑√",
        technical: "01/\\|<>[]",
        minimal: "·•"
      };
      let symbolSet = symbolSets[symbolSetName] ?? symbolSets.bloomSymbols;
      if (symbolSetName === "custom") {
        symbolSet = normalizeCustomCharset(customSymbols, symbolSets.bloomSymbols);
      }

      return renderSymbolGlow(source, {
        fontSize,
        symbolSet,
        baseBlur,
        glowRadius,
        glowAmount: glowIntensity,
        threshold,
        falloff: 0.35,
        edgeStrength: 0.5,
        colorMode: colorMode === "monochrome" ? "monochrome" : "colored"
      });
    };
  }
};

const luminousAsciiBloomPreset: EffectPreset = {
  id: "luminousAsciiBloom",
  name: "Luminous ASCII Bloom",
  description: "ASCII characters that glow from bright areas with source-colored light.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 30,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "bloomRadius", name: "Bloom Radius", type: "range", min: 2, max: 24, step: 1, defaultValue: 12 },
    { id: "baseOpacity", name: "Base Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 10),
    bloomRadius: resolveOverride(overrides, "bloomRadius", 12),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 20),
    glowAmount: resolveOverride(overrides, "glowAmount", 60),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 15))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 10));
      const bloomRadius = (params.bloomRadius as number) ?? 12;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const baseOpacity = ((params.baseOpacity as number) ?? 20) / 100;

      const result = renderLuminousAsciiBloom(source, {
        fontSize,
        density,
        bloomRadius,
        glowAmount,
        baseOpacity,
        minGlyphLuminance: 0.2
      });

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const crtDreamPreset: EffectPreset = {
  id: "crtDream",
  name: "CRT Dream",
  description: "Soft retro display effect.",
  category: "atmosphereGlow",
  access: "premium",
  defaultIntensity: 55,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "pixelCellSize", name: "Pixel Cell", type: "range", min: 2, max: 16, step: 1, defaultValue: 4 },
    { id: "scanlineStrength", name: "Scanlines", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "rgbShift", name: "RGB Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 3 },
    { id: "tintPreset", name: "Tint Preset", type: "select", options: ["warmPink", "coolCyan", "amberCrt", "mint", "custom"], defaultValue: "warmPink" },
    { id: "tintColor", name: "Custom Tint", type: "color", defaultValue: "#ff5c9a" },
    { id: "tintAmount", name: "Tint Amount", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    pixelCellSize: resolveOverride(overrides, "pixelCellSize", 2 + Math.round((intensity / 100) * 14)),
    scanlineStrength: resolveOverride(overrides, "scanlineStrength", Math.round((intensity / 100) * 60)),
    rgbShift: resolveOverride(overrides, "rgbShift", Math.round((intensity / 100) * 6)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 40)),
    vignette: resolveOverride(overrides, "vignette", Math.round((intensity / 100) * 40)),
    tintPreset: resolveOverride(overrides, "tintPreset", "warmPink"),
    tintColor: resolveOverride(overrides, "tintColor", "#ff5c9a"),
    tintAmount: resolveOverride(overrides, "tintAmount", Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const pixelCellSize = (params.pixelCellSize as number) ?? 4;
      const scanlineStrength = ((params.scanlineStrength as number) ?? 0) / 100;
      const rgbShift = (params.rgbShift as number) ?? 0;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const vignette = ((params.vignette as number) ?? 0) / 100;
      const tintPreset = (params.tintPreset as string) ?? "warmPink";
      const tintHex = tintPreset === "custom"
        ? ((params.tintColor as string) ?? "#ff5c9a")
        : (ATMOSPHERE_TINT_PRESETS[tintPreset] ?? ATMOSPHERE_TINT_PRESETS.warmPink);
      const tintColor = hexToRgba(tintHex);
      const tintAmount = ((params.tintAmount as number) ?? 0) / 100;

      const smallW = Math.max(1, Math.floor(source.width / pixelCellSize));
      const smallH = Math.max(1, Math.floor(source.height / pixelCellSize));
      let result = resizeNearestNeighbor(source, smallW, smallH);
      result = resizeNearestNeighbor(result, source.width, source.height);

      if (rgbShift > 0) {
        applyRgbShift(result, rgbShift);
      }
      if (scanlineStrength > 0) {
        applyScanlines(result, scanlineStrength);
      }
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(glowAmount * 6)),
          amount: glowAmount * 0.4,
          mode: "screen",
          color: tintColor
        });
      }
      if (vignette > 0) {
        applyVignette(result, vignette);
      }
      if (tintAmount > 0) {
        applyTint(result, tintColor, tintAmount);
      }
      return result;
    };
  }
};

const vhsBloomPreset: EffectPreset = {
  id: "vhsBloom",
  name: "VHS Bloom",
  description: "Blurry compressed nostalgic digital effect.",
  category: "atmosphereGlow",
  access: "premium",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 16, step: 1, defaultValue: 5 },
    { id: "chromatic", name: "Chromatic", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "noise", name: "Noise", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
    { id: "tintPreset", name: "Tint Preset", type: "select", options: ["warmPink", "coolCyan", "amberCrt", "mint", "custom"], defaultValue: "warmPink" },
    { id: "tintColor", name: "Custom Tint", type: "color", defaultValue: "#ff5c9a" },
    { id: "tintAmount", name: "Tint Amount", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", Math.round((intensity / 100) * 12)),
    chromatic: resolveOverride(overrides, "chromatic", Math.round((intensity / 100) * 10)),
    noise: resolveOverride(overrides, "noise", Math.round((intensity / 100) * 40)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 40)),
    tintPreset: resolveOverride(overrides, "tintPreset", "warmPink"),
    tintColor: resolveOverride(overrides, "tintColor", "#ff5c9a"),
    tintAmount: resolveOverride(overrides, "tintAmount", Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 5;
      const chromatic = (params.chromatic as number) ?? 0;
      const noise = ((params.noise as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const tintPreset = (params.tintPreset as string) ?? "warmPink";
      const tintHex = tintPreset === "custom"
        ? ((params.tintColor as string) ?? "#ff5c9a")
        : (ATMOSPHERE_TINT_PRESETS[tintPreset] ?? ATMOSPHERE_TINT_PRESETS.warmPink);
      const tintColor = hexToRgba(tintHex);
      const tintAmount = ((params.tintAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      applyBoxBlur(result, blurAmount);
      if (chromatic > 0) {
        applyRgbShift(result, chromatic);
      }
      if (noise > 0) {
        applyNoise(result, noise);
      }
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(glowAmount * 8)),
          amount: glowAmount * 0.5,
          mode: "screen",
          color: tintColor
        });
      }
      if (tintAmount > 0) {
        applyTint(result, tintColor, tintAmount);
      }
      return result;
    };
  }
};

const cubicGlassPreset: EffectPreset = {
  id: "cubicGlass",
  name: "Cubic Glass",
  description: "Frosted translucent cubic tiles refracting the image beneath a soft glass grid.",
  category: "glassFrost",
  access: "premium",
  defaultIntensity: 40,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "tileSize", name: "Tile Size", type: "range", min: 4, max: 64, step: 1, defaultValue: 16 },
    { id: "distortion", name: "Distortion", type: "range", min: 0, max: 32, step: 1, defaultValue: 4 },
    { id: "frost", name: "Frost", type: "range", min: 0, max: 100, step: 1, defaultValue: 60 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    tileSize: resolveOverride(overrides, "tileSize", 4 + Math.round((intensity / 100) * 60)),
    distortion: resolveOverride(overrides, "distortion", Math.round((intensity / 100) * 16)),
    frost: resolveOverride(overrides, "frost", 40 + Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const tileSize = Math.max(1, (params.tileSize as number) ?? 16);
      const distortion = (params.distortion as number) ?? 0;
      const frost = ((params.frost as number) ?? 60) / 100;

      return applyCubicGlass(source, tileSize, distortion, frost);
    };
  }
};

const risoOffsetPreset: EffectPreset = {
  id: "risoOffset",
  name: "Riso Offset",
  description: "Imperfect risograph-inspired print effect.",
  category: "printGrid",
  access: "premium",
  defaultIntensity: 70,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "channelShift", name: "Channel Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "inkColor", name: "Ink", type: "color", defaultValue: "#ff5c5c" },
    { id: "paperColor", name: "Paper", type: "color", defaultValue: "#000000" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    channelShift: resolveOverride(overrides, "channelShift", Math.round((intensity / 100) * 10)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 35)),
    glowAmount: resolveOverride(overrides, "glowAmount", 0),
    inkColor: resolveOverride(overrides, "inkColor", "#ff5c5c"),
    paperColor: resolveOverride(overrides, "paperColor", "#000000")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const channelShift = (params.channelShift as number) ?? 0;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ff5c5c");
      const paperColor = hexToRgba((params.paperColor as string) ?? "#fff8e7");

      const result = clonePixelBuffer(source);
      applyPosterize(result, 3);
      applyDuotone(result, paperColor, inkColor);
      if (channelShift > 0) {
        applyRgbShift(result, channelShift);
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

export const premiumPresets: EffectPreset[] = [
  cyberAsciiPreset,
  luminousAsciiBloomPreset,
  symbolGlowPreset,
  crtDreamPreset,
  vhsBloomPreset,
  risoOffsetPreset,
  cubicGlassPreset
];
