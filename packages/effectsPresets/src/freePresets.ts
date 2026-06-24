import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyBoxBlur,
  applyDuotone,
  applyFloydSteinbergDither,
  applyGlow,
  applyGrain,
  applyGridOverlay,
  applyOrderedDither,
  applyVignette,
  blendPixelBuffers,
  clonePixelBuffer,
  renderAscii,
  renderHalftoneData,
  resizeNearestNeighbor,
  toGrayscale,
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

function applyUniversalAdjustments(
  buffer: PixelBuffer,
  params: ResolvedPresetParameters
): PixelBuffer {
  const brightness = ((params.brightness as number) ?? 0);
  const contrast = ((params.contrast as number) ?? 0) / 100;
  const saturation = ((params.saturation as number) ?? 0) / 100;
  const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
  const glowAmount = ((params.glowAmount as number) ?? 0) / 100;

  const result = buffer;
  if (brightness !== 0 || contrast !== 0) {
    adjustBrightnessContrast(result, brightness, contrast);
  }
  if (saturation !== 0) {
    adjustSaturation(result, saturation);
  }
  if (glowAmount > 0) {
    applyGlow(result, {
      radius: Math.max(1, Math.round(glowAmount * 8)),
      amount: glowAmount * 0.4,
      mode: "screen"
    });
  }
  if (grainAmount > 0) {
    applyGrain(result, grainAmount);
  }
  return result;
}

const pixelGridPreset: EffectPreset = {
  id: "pixelGrid",
  name: "Pixel Grid",
  description: "Deliberate square cells with subtle grid lines while keeping source colors.",
  category: "printGrid",
  access: "free",
  defaultIntensity: 5,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "cellSize", name: "Cell Size", type: "range", min: 4, max: 64, step: 2, defaultValue: 16 },
    { id: "gridOpacity", name: "Grid Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 25 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 4 + Math.round((intensity / 100) * 60)),
    gridOpacity: resolveOverride(overrides, "gridOpacity", Math.round((intensity / 100) * 40)),
    brightness: resolveOverride(overrides, "brightness", 0),
    contrast: resolveOverride(overrides, "contrast", 0),
    saturation: resolveOverride(overrides, "saturation", 0),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const cellSize = (params.cellSize as number) ?? 16;
      const gridOpacity = ((params.gridOpacity as number) ?? 0) / 100;

      const smallW = Math.max(1, Math.floor(source.width / cellSize));
      const smallH = Math.max(1, Math.floor(source.height / cellSize));
      // Average down to large cells, then scale back up to keep source-like colors.
      let result = resizeNearestNeighbor(source, smallW, smallH);
      result = resizeNearestNeighbor(result, source.width, source.height);

      result = applyUniversalAdjustments(result, params);

      if (gridOpacity > 0) {
        applyGridOverlay(result, { cellSize, opacity: gridOpacity, style: "darken", lineWidth: 1 });
      }

      return result;
    };
  }
};

const monoDitherPreset: EffectPreset = {
  id: "monoDither",
  name: "Mono Dither",
  description: "Black-and-white ordered or threshold dither.",
  category: "printGrid",
  access: "free",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "algorithm", name: "Algorithm", type: "select", options: ["ordered", "errorDiffusion"], defaultValue: "ordered" },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 128 },
    { id: "invert", name: "Invert", type: "boolean", defaultValue: false }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    algorithm: resolveOverride(overrides, "algorithm", intensity > 50 ? "errorDiffusion" : "ordered"),
    threshold: resolveOverride(overrides, "threshold", 100 + Math.round((intensity / 100) * 80)),
    invert: resolveOverride(overrides, "invert", false),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 30)),
    brightness: resolveOverride(overrides, "brightness", Math.round((intensity / 100) * -10)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 10))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const result = clonePixelBuffer(source);
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const threshold = (params.threshold as number) ?? 128;
      const algorithm = (params.algorithm as string) ?? "ordered";
      const invert = (params.invert as boolean) ?? false;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      toGrayscale(result);
      if (brightness !== 0 || contrast !== 0) {
        adjustBrightnessContrast(result, brightness, contrast);
      }
      if (algorithm === "errorDiffusion") {
        applyFloydSteinbergDither(result, threshold);
      } else {
        applyOrderedDither(result, threshold);
      }
      if (invert) {
        for (let i = 0; i < result.data.length; i += 4) {
          result.data[i] = 255 - result.data[i];
          result.data[i + 1] = 255 - result.data[i + 1];
          result.data[i + 2] = 255 - result.data[i + 2];
        }
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const classicAsciiPreset: EffectPreset = {
  id: "classicAscii",
  name: "Classic ASCII",
  description: "ASCII image from a dense luminance-to-glyph mapping.",
  category: "asciiSymbols",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "density", name: "Density", type: "range", min: 2, max: 10, step: 1, defaultValue: 10 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["monochrome", "color", "source"], defaultValue: "monochrome" },
    { id: "backgroundColor", name: "Background", type: "color", defaultValue: "#000000" },
    { id: "inkColor", name: "Ink", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 2 + Math.round((intensity / 100) * 8)),
    colorMode: resolveOverride(overrides, "colorMode", "monochrome"),
    backgroundColor: resolveOverride(overrides, "backgroundColor", "#000000"),
    inkColor: resolveOverride(overrides, "inkColor", "#ffffff")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const fontSize = (params.fontSize as number) ?? 12;
      const colorMode = (params.colorMode as string) ?? "monochrome";
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#000000");
      const inkColor = hexToRgba((params.inkColor as string) ?? "#ffffff");
      const density = Math.max(2, Math.min(10, (params.density as number) ?? 10));
      const charset = " .:-=+*#%@".slice(0, density);

      return renderAscii(source, {
        fontSize,
        inkColor,
        backgroundColor,
        charset,
        colorMode: colorMode as "monochrome" | "color" | "source"
      });
    };
  }
};

const dotHalftonePreset: EffectPreset = {
  id: "dotHalftone",
  name: "Dot Halftone",
  description: "Colored dot halftone inspired by newsprint and Risograph screens.",
  category: "printGrid",
  access: "free",
  defaultIntensity: 21,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "dotSize", name: "Dot Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 12 },
    { id: "dotSpacing", name: "Dot Spacing", type: "range", min: 2, max: 48, step: 1, defaultValue: 6 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["monochrome", "source", "palette"], defaultValue: "source" },
    { id: "palette", name: "Palette", type: "select", options: ["cmyk", "warm", "cool", "mono"], defaultValue: "cmyk" },
    { id: "saturationBoost", name: "Saturation", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    // At the default intensity of 21, dotSize should be 12 and dotSpacing 6.
    dotSize: resolveOverride(overrides, "dotSize", Math.min(32, Math.max(2, Math.round(12 + ((intensity - 21) / 79) * 20)))),
    dotSpacing: resolveOverride(overrides, "dotSpacing", Math.min(48, Math.max(2, Math.round(6 + ((intensity - 21) / 79) * 42)))),
    colorMode: resolveOverride(overrides, "colorMode", "source"),
    palette: resolveOverride(overrides, "palette", "cmyk"),
    saturationBoost: resolveOverride(overrides, "saturationBoost", Math.round((intensity / 100) * 40)),
    grainAmount: resolveOverride(overrides, "grainAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const dotSize = (params.dotSize as number) ?? 12;
      const dotSpacing = (params.dotSpacing as number) ?? 16;
      const colorMode = (params.colorMode as string) ?? "source";
      const paletteName = (params.palette as string) ?? "cmyk";
      const saturationBoost = ((params.saturationBoost as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const palettes: Record<string, RgbaColor[]> = {
        cmyk: [
          [0, 174, 239, 255],
          [236, 0, 140, 255],
          [255, 242, 0, 255],
          [35, 31, 32, 255]
        ],
        warm: [
          [255, 100, 50, 255],
          [255, 200, 80, 255],
          [180, 40, 80, 255],
          [60, 20, 20, 255]
        ],
        cool: [
          [30, 60, 120, 255],
          [80, 180, 220, 255],
          [160, 220, 240, 255],
          [10, 20, 40, 255]
        ],
        mono: [
          [0, 0, 0, 255],
          [100, 100, 100, 255],
          [180, 180, 180, 255],
          [255, 255, 255, 255]
        ]
      };

      const result = renderHalftoneData(source, {
        dotSpacing,
        maxDotSize: dotSize,
        inkColor: [0, 0, 0, 255],
        backgroundColor: [255, 255, 255, 255],
        shape: "circle",
        colorMode: colorMode as "monochrome" | "source" | "palette",
        palette: palettes[paletteName] ?? palettes.cmyk,
        saturationBoost
      });

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const duotonePreset: EffectPreset = {
  id: "duotone",
  name: "Duotone",
  description: "High-impact two-color palette mapping.",
  category: "atmosphereGlow",
  access: "free",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "shadowColor", name: "Shadow", type: "color", defaultValue: "#1a0b2e" },
    { id: "highlightColor", name: "Highlight", type: "color", defaultValue: "#ff006e" },
    { id: "contrast", name: "Contrast", type: "range", min: 0, max: 100, step: 1, defaultValue: 30 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    shadowColor: resolveOverride(overrides, "shadowColor", "#1a0b2e"),
    highlightColor: resolveOverride(overrides, "highlightColor", "#ff006e"),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 50))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const shadowColor = hexToRgba((params.shadowColor as string) ?? "#1a0b2e");
      const highlightColor = hexToRgba((params.highlightColor as string) ?? "#ff006e");
      const contrast = ((params.contrast as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      if (contrast > 0) {
        adjustBrightnessContrast(result, 0, contrast);
      }
      applyDuotone(result, shadowColor, highlightColor);
      return result;
    };
  }
};

const dreamGlowPalette = {
  goldenDusk: {
    glow: [255, 180, 80, 255] as RgbaColor,
    shadow: [60, 30, 40, 255] as RgbaColor,
    highlight: [255, 220, 180, 255] as RgbaColor
  },
  roseBloom: {
    glow: [255, 140, 180, 255] as RgbaColor,
    shadow: [60, 20, 40, 255] as RgbaColor,
    highlight: [255, 210, 220, 255] as RgbaColor
  },
  coolHaze: {
    glow: [120, 180, 255, 255] as RgbaColor,
    shadow: [20, 30, 60, 255] as RgbaColor,
    highlight: [200, 230, 255, 255] as RgbaColor
  }
};

const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description: "Soft, hazy, nostalgic image treatment with palette presets.",
  category: "atmosphereGlow",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 20, step: 1, defaultValue: 6 },
    { id: "palette", name: "Palette", type: "select", options: ["goldenDusk", "roseBloom", "coolHaze"], defaultValue: "goldenDusk" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", 2 + Math.round((intensity / 100) * 14)),
    glowAmount: resolveOverride(overrides, "glowAmount", intensity),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 20)),
    palette: resolveOverride(overrides, "palette", "goldenDusk")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const blurAmount = (params.blurAmount as number) ?? 6;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const paletteName = (params.palette as keyof typeof dreamGlowPalette) ?? "goldenDusk";
      const palette = dreamGlowPalette[paletteName] ?? dreamGlowPalette.goldenDusk;

      const blur = clonePixelBuffer(source);
      applyBoxBlur(blur, blurAmount);
      let result = blendPixelBuffers(source, blur, "screen", glowAmount * 0.4);

      // Soft color-grade using duotone to keep tonal range intact.
      const graded = clonePixelBuffer(result);
      applyDuotone(graded, palette.shadow, palette.highlight);
      result = blendPixelBuffers(result, graded, "soft", 0.2 + glowAmount * 0.25);

      // Tinted glow on highlights.
      if (glowAmount > 0) {
        applyGlow(result, {
          radius: Math.max(1, Math.round(blurAmount * 0.75)),
          amount: glowAmount * 0.25,
          mode: "soft",
          color: palette.glow
        });
      }

      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const noirGrainPreset: EffectPreset = {
  id: "noirGrain",
  name: "Noir Grain",
  description: "Moody black-and-white contrast and film texture.",
  category: "atmosphereGlow",
  access: "free",
  defaultIntensity: 65,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "vignette", name: "Vignette", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "contrast", name: "Contrast", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    contrast: resolveOverride(overrides, "contrast", 30 + Math.round((intensity / 100) * 50)),
    brightness: resolveOverride(overrides, "brightness", Math.round((intensity / 100) * -15)),
    vignette: resolveOverride(overrides, "vignette", Math.round((intensity / 100) * 70)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 40))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const contrast = ((params.contrast as number) ?? 0) / 100;
      const brightness = (params.brightness as number) ?? 0;
      const vignette = ((params.vignette as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      toGrayscale(result);
      adjustBrightnessContrast(result, brightness, contrast);
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      if (vignette > 0) {
        applyVignette(result, vignette);
      }
      return result;
    };
  }
};

export const freePresets: EffectPreset[] = [
  pixelGridPreset,
  monoDitherPreset,
  classicAsciiPreset,
  dotHalftonePreset,
  duotonePreset,
  dreamGlowPreset,
  noirGrainPreset
];
