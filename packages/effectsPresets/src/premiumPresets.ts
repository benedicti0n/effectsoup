import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyBloom,
  applyBoxBlur,
  applyDuotone,
  applyEdgeDetect,
  applyGlow,
  applyGrain,
  applyGridOverlay,
  applyNoise,
  applyPosterize,
  applyRgbShift,
  applyScanlines,
  applyVignette,
  clonePixelBuffer,
  reducePalette,
  renderAscii,
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

const universalAdvancedControls: AdvancedControlDefinition[] = [
  { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "contrast", name: "Contrast", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 },
  { id: "saturation", name: "Saturation", type: "range", min: -100, max: 100, step: 1, defaultValue: 0 },
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
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 10 },
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
      fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
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

const luminousAsciiBloomPreset: EffectPreset = {
  id: "luminousAsciiBloom",
  name: "Luminous ASCII Bloom",
  description: "ASCII characters that glow from bright areas with source-colored light.",
  category: "asciiSymbols",
  access: "premium",
  defaultIntensity: 55,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "bloomRadius", name: "Bloom Radius", type: "range", min: 2, max: 24, step: 1, defaultValue: 10 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 2 + Math.round((intensity / 100) * 8)),
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
    ...universalAdvancedControls,
    { id: "pixelCellSize", name: "Pixel Cell", type: "range", min: 2, max: 16, step: 1, defaultValue: 4 },
    { id: "scanlineStrength", name: "Scanlines", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "rgbShift", name: "RGB Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 3 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    pixelCellSize: resolveOverride(overrides, "pixelCellSize", 2 + Math.round((intensity / 100) * 14)),
    scanlineStrength: resolveOverride(overrides, "scanlineStrength", Math.round((intensity / 100) * 60)),
    rgbShift: resolveOverride(overrides, "rgbShift", Math.round((intensity / 100) * 6)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 40)),
    vignette: resolveOverride(overrides, "vignette", Math.round((intensity / 100) * 40))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const pixelCellSize = (params.pixelCellSize as number) ?? 4;
      const scanlineStrength = ((params.scanlineStrength as number) ?? 0) / 100;
      const rgbShift = (params.rgbShift as number) ?? 0;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const vignette = ((params.vignette as number) ?? 0) / 100;

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
          mode: "screen"
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
    ...universalAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 16, step: 1, defaultValue: 5 },
    { id: "chromatic", name: "Chromatic", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "noise", name: "Noise", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", Math.round((intensity / 100) * 12)),
    chromatic: resolveOverride(overrides, "chromatic", Math.round((intensity / 100) * 10)),
    noise: resolveOverride(overrides, "noise", Math.round((intensity / 100) * 40)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 40)),
    saturation: resolveOverride(overrides, "saturation", Math.round((intensity / 100) * -20))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 5;
      const chromatic = (params.chromatic as number) ?? 0;
      const noise = ((params.noise as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const saturation = ((params.saturation as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      if (saturation !== 0) {
        adjustSaturation(result, saturation);
      }
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
          mode: "screen"
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
  defaultIntensity: 55,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "channelShift", name: "Channel Shift", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "inkColor", name: "Ink", type: "color", defaultValue: "#ff5c5c" },
    { id: "paperColor", name: "Paper", type: "color", defaultValue: "#fff8e7" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    channelShift: resolveOverride(overrides, "channelShift", Math.round((intensity / 100) * 10)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 35)),
    inkColor: resolveOverride(overrides, "inkColor", "#ff5c5c"),
    paperColor: resolveOverride(overrides, "paperColor", "#fff8e7")
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

const mangaGridPreset: EffectPreset = {
  id: "mangaGrid",
  name: "Manga Grid",
  description: "Graphic portrait/panel effect inspired by manga printing.",
  category: "printGrid",
  access: "premium",
  defaultIntensity: 5,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "posterLevels", name: "Poster Levels", type: "range", min: 2, max: 8, step: 1, defaultValue: 4 },
    { id: "edgeStrength", name: "Edge Emphasis", type: "range", min: 0, max: 100, step: 1, defaultValue: 25 },
    { id: "gridOpacity", name: "Grid Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    // At the default intensity of 5, posterLevels=4, edgeStrength=25, gridOpacity=20.
    posterLevels: resolveOverride(overrides, "posterLevels", Math.max(2, Math.round(4 - ((intensity - 5) / 95) * 2))),
    edgeStrength: resolveOverride(overrides, "edgeStrength", Math.min(100, Math.max(0, Math.round(25 + ((intensity - 5) / 95) * 55)))),
    gridOpacity: resolveOverride(overrides, "gridOpacity", Math.min(100, Math.max(0, Math.round(20 + ((intensity - 5) / 95) * 40)))),
    contrast: resolveOverride(overrides, "contrast", Math.min(100, Math.max(0, Math.round(((intensity - 5) / 95) * 30))))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const posterLevels = (params.posterLevels as number) ?? 4;
      const edgeStrength = ((params.edgeStrength as number) ?? 0) / 100;
      const gridOpacity = ((params.gridOpacity as number) ?? 0) / 100;
      const contrast = ((params.contrast as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      if (contrast > 0) {
        adjustBrightnessContrast(result, 0, contrast);
      }
      applyPosterize(result, posterLevels);
      // Keep some source color rather than crushing to a tiny palette.
      reducePalette(result, Math.min(16, posterLevels * 4));

      if (edgeStrength > 0) {
        applyEdgeDetect(result, edgeStrength * 0.5);
      }

      if (gridOpacity > 0) {
        applyGridOverlay(result, {
          cellSize: 24,
          opacity: gridOpacity,
          style: "darken",
          lineWidth: 1
        });
      }
      return result;
    };
  }
};

export const premiumPresets: EffectPreset[] = [
  cyberAsciiPreset,
  luminousAsciiBloomPreset,
  crtDreamPreset,
  vhsBloomPreset,
  risoOffsetPreset,
  mangaGridPreset
];
