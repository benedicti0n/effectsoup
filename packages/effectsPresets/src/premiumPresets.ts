import {
  applyBloom,
  applyBoxBlur,
  applyDuotone,
  applyGlow,
  applyGrain,
  applyGridOverlay,
  applyNoise,
  applyPosterize,
  applyRgbShift,
  applyScanlines,
  applyVignette,
  clonePixelBuffer,
  normalizeCustomCharset,
  renderAscii,
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
      glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 50)),
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
        backgroundColor: [5, 5, 15, 255],
        charset: trimmedCharset,
        colorMode: renderColorMode
      });

      // Subtle scanline grid.
      applyGridOverlay(result, {
        cellSize: Math.max(2, Math.round(fontSize * 1.4)),
        opacity: 0.08,
        style: "darken",
        lineWidth: 1
      });

      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(glowAmount * 8)),
          amount: glowAmount * 0.25,
          mode: "screen",
          color: colorMode === "originalColors" ? [255, 255, 255, 255] : tintColor
        });
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
    { id: "glowRadius", name: "Glow Radius", type: "range", min: 0, max: 32, step: 1, defaultValue: 8 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["colored", "monochrome"], defaultValue: "colored" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 12),
    symbolSet: resolveOverride(overrides, "symbolSet", "bloomSymbols"),
    customSymbols: resolveOverride(overrides, "customSymbols", ""),
    glowRadius: resolveOverride(overrides, "glowRadius", 8),
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
      const glowRadius = (params.glowRadius as number) ?? 8;
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
        glowRadius,
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
  defaultIntensity: 5,
  advancedControlSchema: [
    ...atmosphereAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "bloomRadius", name: "Bloom Radius", type: "range", min: 2, max: 24, step: 1, defaultValue: 10 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 10),
    bloomRadius: resolveOverride(overrides, "bloomRadius", 2 + Math.round((intensity / 100) * 22)),
    glowAmount: resolveOverride(overrides, "glowAmount", intensity),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 15))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 10));
      const bloomRadius = (params.bloomRadius as number) ?? 10;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const charset = " .:-=+*#%@";
      const trimmedCharset = charset.slice(0, Math.max(2, density));

      const ascii = renderAscii(source, {
        fontSize,
        inkColor: [255, 255, 255, 255],
        backgroundColor: [0, 0, 0, 255],
        charset: trimmedCharset,
        colorMode: "source"
      });

      const result = ascii;
      if (glowAmount > 0) {
        applyBloom(result, {
          radius: bloomRadius,
          threshold: 0.55,
          amount: glowAmount * 0.6
        });
      }
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
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#ff5c9a" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    pixelCellSize: resolveOverride(overrides, "pixelCellSize", 2 + Math.round((intensity / 100) * 14)),
    scanlineStrength: resolveOverride(overrides, "scanlineStrength", Math.round((intensity / 100) * 60)),
    rgbShift: resolveOverride(overrides, "rgbShift", Math.round((intensity / 100) * 6)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 40)),
    vignette: resolveOverride(overrides, "vignette", Math.round((intensity / 100) * 40)),
    tintColor: resolveOverride(overrides, "tintColor", "#ff5c9a"),
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
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ff5c9a");

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
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#ff5c9a" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", Math.round((intensity / 100) * 12)),
    chromatic: resolveOverride(overrides, "chromatic", Math.round((intensity / 100) * 10)),
    noise: resolveOverride(overrides, "noise", Math.round((intensity / 100) * 40)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 40)),
    tintColor: resolveOverride(overrides, "tintColor", "#ff5c9a"),
    grainAmount: resolveOverride(overrides, "grainAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 5;
      const chromatic = (params.chromatic as number) ?? 0;
      const noise = ((params.noise as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ff5c9a");

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
      return result;
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
  risoOffsetPreset
];
