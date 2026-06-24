import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyBoxBlur,
  applyDuotone,
  applyEdgeDetect,
  applyFloydSteinbergDither,
  applyGrain,
  applyOrderedDither,
  applyPosterize,
  applyVignette,
  blendPixelBuffers,
  clonePixelBuffer,
  createPixelBuffer,
  reducePalette,
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

const pixelGridPreset: EffectPreset = {
  id: "pixelGrid",
  name: "Pixel Grid",
  description: "Deliberate square cells with subtle grid lines.",
  category: "pixel",
  access: "free",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "cellSize", name: "Cell Size", type: "range", min: 4, max: 64, step: 2, defaultValue: 16 },
    { id: "paletteSize", name: "Palette Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 8 },
    { id: "gridOpacity", name: "Grid Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 30 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    cellSize: resolveOverride(overrides, "cellSize", 4 + Math.round((intensity / 100) * 60)),
    paletteSize: resolveOverride(overrides, "paletteSize", 2 + Math.round((intensity / 100) * 30)),
    gridOpacity: resolveOverride(overrides, "gridOpacity", (intensity / 100) * 0.5),
    brightness: resolveOverride(overrides, "brightness", 0),
    contrast: resolveOverride(overrides, "contrast", 0),
    saturation: resolveOverride(overrides, "saturation", 0),
    grainAmount: resolveOverride(overrides, "grainAmount", 0),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const cellSize = params.cellSize as number;
      const paletteSize = params.paletteSize as number;
      const gridOpacity = params.gridOpacity as number;
      const brightness = (params.brightness as number) ?? 0;
      const contrast = (params.contrast as number) ?? 0;
      const saturation = (params.saturation as number) ?? 0;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;

      const smallW = Math.max(1, Math.floor(source.width / cellSize));
      const smallH = Math.max(1, Math.floor(source.height / cellSize));
      let result = resizeNearestNeighbor(source, smallW, smallH);
      reducePalette(result, paletteSize);
      result = resizeNearestNeighbor(result, source.width, source.height);

      if (brightness !== 0 || contrast !== 0) {
        adjustBrightnessContrast(result, brightness, contrast / 100);
      }
      if (saturation !== 0) {
        adjustSaturation(result, saturation / 100);
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      if (glowAmount > 0) {
        const glow = clonePixelBuffer(result);
        applyBoxBlur(glow, Math.max(1, Math.round(glowAmount * 8)));
        result = blendPixelBuffers(result, glow, "screen", glowAmount * 0.4);
      }

      // Grid overlay.
      if (gridOpacity > 0) {
        for (let y = 0; y < result.height; y += cellSize) {
          for (let x = 0; x < result.width; x++) {
            const idx = (y * result.width + x) * 4;
            result.data[idx] *= 1 - gridOpacity;
            result.data[idx + 1] *= 1 - gridOpacity;
            result.data[idx + 2] *= 1 - gridOpacity;
          }
        }
        for (let x = 0; x < result.width; x += cellSize) {
          for (let y = 0; y < result.height; y++) {
            const idx = (y * result.width + x) * 4;
            result.data[idx] *= 1 - gridOpacity;
            result.data[idx + 1] *= 1 - gridOpacity;
            result.data[idx + 2] *= 1 - gridOpacity;
          }
        }
      }

      return result;
    };
  }
};

const monoDitherPreset: EffectPreset = {
  id: "monoDither",
  name: "Mono Dither",
  description: "Black-and-white ordered or threshold dither.",
  category: "dither",
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
  description: "Monochrome ASCII image from luminance-to-glyph mapping.",
  category: "ascii",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 12 },
    { id: "density", name: "Density", type: "range", min: 2, max: 16, step: 1, defaultValue: 8 },
    { id: "colorMode", name: "Color Mode", type: "select", options: ["monochrome", "color"], defaultValue: "monochrome" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 2 + Math.round((intensity / 100) * 14)),
    colorMode: resolveOverride(overrides, "colorMode", "monochrome"),
    backgroundColor: resolveOverride(overrides, "backgroundColor", "#000000"),
    inkColor: resolveOverride(overrides, "inkColor", "#ffffff")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const fontSize = (params.fontSize as number) ?? 12;
      const colorMode = (params.colorMode as string) ?? "monochrome";
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#000000");
      let inkColor = hexToRgba((params.inkColor as string) ?? "#ffffff");

      const charset = " .:-=+*#%@".slice(0, Math.max(2, (params.density as number) ?? 8));
      if (colorMode === "color") {
        const avg = [128, 128, 128, 255] as RgbaColor;
        inkColor = avg;
      }

      return renderAscii(source, {
        fontSize,
        inkColor,
        backgroundColor,
        charset,
        colorMode: colorMode as "monochrome" | "color"
      });
    };
  }
};

const dotHalftonePreset: EffectPreset = {
  id: "dotHalftone",
  name: "Dot Halftone",
  description: "Newspaper-style dot halftone.",
  category: "print",
  access: "free",
  defaultIntensity: 55,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "dotSize", name: "Dot Size", type: "range", min: 2, max: 32, step: 1, defaultValue: 12 },
    { id: "dotSpacing", name: "Dot Spacing", type: "range", min: 4, max: 48, step: 1, defaultValue: 16 },
    { id: "inkColor", name: "Ink Color", type: "color", defaultValue: "#000000" },
    { id: "backgroundColor", name: "Background", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    dotSize: resolveOverride(overrides, "dotSize", 4 + Math.round((intensity / 100) * 28)),
    dotSpacing: resolveOverride(overrides, "dotSpacing", 8 + Math.round((intensity / 100) * 40)),
    inkColor: resolveOverride(overrides, "inkColor", "#000000"),
    backgroundColor: resolveOverride(overrides, "backgroundColor", "#ffffff"),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 15))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const dotSize = (params.dotSize as number) ?? 12;
      const dotSpacing = (params.dotSpacing as number) ?? 16;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#000000");
      const backgroundColor = hexToRgba((params.backgroundColor as string) ?? "#ffffff");
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const gray = clonePixelBuffer(source);
      toGrayscale(gray);
      const result = renderHalftoneData(gray, {
        dotSpacing,
        maxDotSize: dotSize,
        inkColor,
        backgroundColor,
        shape: "circle"
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
  category: "dreamy",
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

const dreamGlowPreset: EffectPreset = {
  id: "dreamGlow",
  name: "Dream Glow",
  description: "Soft, hazy, nostalgic image treatment.",
  category: "dreamy",
  access: "free",
  defaultIntensity: 50,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 20, step: 1, defaultValue: 4 },
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#ffb7c5" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", Math.round((intensity / 100) * 12)),
    glowAmount: resolveOverride(overrides, "glowAmount", intensity),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 20)),
    tintColor: resolveOverride(overrides, "tintColor", "#ffb7c5")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const blurAmount = (params.blurAmount as number) ?? 4;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const tintColor = hexToRgba((params.tintColor as string) ?? "#ffb7c5");

      const blur = clonePixelBuffer(source);
      applyBoxBlur(blur, blurAmount);
      let result = blendPixelBuffers(source, blur, "screen", glowAmount * 0.5);

      // Tint overlay.
      const tint = createPixelBuffer(source.width, source.height, tintColor);
      result = blendPixelBuffers(result, tint, "overlay", 0.15 + glowAmount * 0.2);

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
  category: "retro",
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

const posterPopPreset: EffectPreset = {
  id: "posterPop",
  name: "Poster Pop",
  description: "Limited-color, high-contrast poster appearance.",
  category: "pixel",
  access: "free",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "posterLevels", name: "Poster Levels", type: "range", min: 2, max: 12, step: 1, defaultValue: 4 },
    { id: "paletteSize", name: "Palette Size", type: "range", min: 2, max: 16, step: 1, defaultValue: 6 },
    { id: "edgeStrength", name: "Edge Emphasis", type: "range", min: 0, max: 100, step: 1, defaultValue: 30 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    posterLevels: resolveOverride(overrides, "posterLevels", 2 + Math.round((intensity / 100) * 10)),
    paletteSize: resolveOverride(overrides, "paletteSize", 2 + Math.round((intensity / 100) * 14)),
    edgeStrength: resolveOverride(overrides, "edgeStrength", Math.round((intensity / 100) * 50)),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 30))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const posterLevels = (params.posterLevels as number) ?? 4;
      const paletteSize = (params.paletteSize as number) ?? 6;
      const edgeStrength = ((params.edgeStrength as number) ?? 0) / 100;
      const contrast = ((params.contrast as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      if (contrast > 0) {
        adjustBrightnessContrast(result, 0, contrast);
      }
      applyPosterize(result, posterLevels);
      reducePalette(result, paletteSize);
      if (edgeStrength > 0) {
        applyEdgeDetect(result, edgeStrength);
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
  noirGrainPreset,
  posterPopPreset
];
