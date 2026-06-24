import {
  adjustBrightnessContrast,
  adjustSaturation,
  applyBoxBlur,
  applyDuotone,
  applyEdgeDetect,
  applyFloydSteinbergDither,
  applyGrain,
  applyNoise,
  applyOrderedDither,
  applyPosterize,
  applyRgbShift,
  applyScanlines,
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

const pinkDotMatrixPreset: EffectPreset = {
  id: "pinkDotMatrix",
  name: "Pink Dot Matrix",
  description: "Hot-pink / pale-pink / dark background dither aesthetic.",
  category: "dither",
  access: "premium",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "ditherScale", name: "Dither Scale", type: "range", min: 1, max: 8, step: 1, defaultValue: 2 },
    { id: "paletteSize", name: "Palette Size", type: "range", min: 2, max: 8, step: 1, defaultValue: 3 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    ditherScale: resolveOverride(overrides, "ditherScale", 1 + Math.round((intensity / 100) * 7)),
    paletteSize: resolveOverride(overrides, "paletteSize", 2 + Math.round((intensity / 100) * 6)),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 40)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 30)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 25))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const ditherScale = (params.ditherScale as number) ?? 2;
      const paletteSize = (params.paletteSize as number) ?? 3;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      adjustBrightnessContrast(result, 0, contrast);
      reducePalette(result, paletteSize);
      const small = resizeNearestNeighbor(result, Math.max(1, Math.floor(result.width / ditherScale)), Math.max(1, Math.floor(result.height / ditherScale)));
      applyOrderedDither(small, 140);
      let final = resizeNearestNeighbor(small, source.width, source.height);

      // Pink tint.
      const pink = hexToRgba("#ff006e");
      const dark = hexToRgba("#1a0510");
      applyDuotone(final, dark, pink);

      if (glowAmount > 0) {
        const glow = clonePixelBuffer(final);
        applyBoxBlur(glow, Math.max(1, Math.round(glowAmount * 6)));
        final = blendPixelBuffers(final, glow, "screen", glowAmount * 0.4);
      }
      if (grainAmount > 0) {
        applyGrain(final, grainAmount);
      }
      return final;
    };
  }
};

const blueNoirDitherPreset: EffectPreset = {
  id: "blueNoirDither",
  name: "Blue Noir Dither",
  description: "Dark navy / cobalt neon dither art.",
  category: "dither",
  access: "premium",
  defaultIntensity: 65,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 120 },
    { id: "bloom", name: "Bloom", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    threshold: resolveOverride(overrides, "threshold", 80 + Math.round((intensity / 100) * 120)),
    bloom: resolveOverride(overrides, "bloom", Math.round((intensity / 100) * 60)),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 50)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 30))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const threshold = (params.threshold as number) ?? 120;
      const bloom = ((params.bloom as number) ?? 0) / 100;
      const contrast = ((params.contrast as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      toGrayscale(result);
      adjustBrightnessContrast(result, 0, contrast);
      applyFloydSteinbergDither(result, threshold);

      const navy = hexToRgba("#0a0f29");
      const cobalt = hexToRgba("#3b82f6");
      applyDuotone(result, navy, cobalt);

      if (bloom > 0) {
        const glow = clonePixelBuffer(result);
        applyBoxBlur(glow, Math.max(1, Math.round(bloom * 8)));
        result.data.set(blendPixelBuffers(result, glow, "screen", bloom * 0.5).data);
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const cyberAsciiPreset: EffectPreset = {
  id: "cyberAscii",
  name: "Cyber ASCII",
  description: "Colored terminal-like character image with blue/purple glow.",
  category: "ascii",
  access: "premium",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "fontSize", name: "Font Size", type: "range", min: 6, max: 32, step: 1, defaultValue: 10 },
    { id: "density", name: "Density", type: "range", min: 2, max: 16, step: 1, defaultValue: 10 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6 + Math.round((intensity / 100) * 26)),
    density: resolveOverride(overrides, "density", 2 + Math.round((intensity / 100) * 14)),
    glowAmount: resolveOverride(overrides, "glowAmount", Math.round((intensity / 100) * 50)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 20))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const fontSize = (params.fontSize as number) ?? 10;
      const density = (params.density as number) ?? 10;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;
      const charset = " .:-=+*#%@".slice(0, Math.max(2, density));

      let result = renderAscii(source, {
        fontSize,
        inkColor: [100, 200, 255, 255],
        backgroundColor: [5, 5, 15, 255],
        charset,
        colorMode: "monochrome"
      });

      // Purple/cyan tint overlay.
      const tint = createPixelBuffer(source.width, source.height, [80, 20, 120, 255]);
      result = blendPixelBuffers(result, tint, "overlay", 0.25);

      if (glowAmount > 0) {
        const glow = clonePixelBuffer(result);
        applyBoxBlur(glow, Math.max(1, Math.round(glowAmount * 8)));
        result = blendPixelBuffers(result, glow, "screen", glowAmount * 0.5);
      }
      if (grainAmount > 0) {
        applyGrain(result, grainAmount);
      }
      return result;
    };
  }
};

const cloudPrintPreset: EffectPreset = {
  id: "cloudPrint",
  name: "Cloud Print",
  description: "Dreamy muted print/halftone look.",
  category: "print",
  access: "premium",
  defaultIntensity: 55,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "blurAmount", name: "Blur", type: "range", min: 0, max: 12, step: 1, defaultValue: 3 },
    { id: "paletteSize", name: "Palette Size", type: "range", min: 2, max: 12, step: 1, defaultValue: 5 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    blurAmount: resolveOverride(overrides, "blurAmount", Math.round((intensity / 100) * 8)),
    paletteSize: resolveOverride(overrides, "paletteSize", 2 + Math.round((intensity / 100) * 10)),
    grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 30))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const blurAmount = (params.blurAmount as number) ?? 3;
      const paletteSize = (params.paletteSize as number) ?? 5;
      const grainAmount = ((params.grainAmount as number) ?? 0) / 100;

      const blurred = clonePixelBuffer(source);
      applyBoxBlur(blurred, blurAmount);
      reducePalette(blurred, paletteSize);

      const gray = clonePixelBuffer(blurred);
      toGrayscale(gray);
      const halftone = renderHalftoneData(gray, {
        dotSpacing: 12,
        maxDotSize: 8,
        inkColor: [120, 130, 150, 255],
        backgroundColor: [245, 245, 250, 255],
        shape: "circle"
      });

      const result = blendPixelBuffers(blurred, halftone, "multiply", 0.4);
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
  category: "retro",
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
        const glow = clonePixelBuffer(result);
        applyBoxBlur(glow, Math.max(1, Math.round(glowAmount * 6)));
        result = blendPixelBuffers(result, glow, "screen", glowAmount * 0.4);
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
  category: "retro",
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
      const blurAmount = (params.blurAmount as number) ?? 5;
      const chromatic = (params.chromatic as number) ?? 0;
      const noise = ((params.noise as number) ?? 0) / 100;
      const glowAmount = ((params.glowAmount as number) ?? 0) / 100;
      const saturation = ((params.saturation as number) ?? 0) / 100;

      let result = clonePixelBuffer(source);
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
        const glow = clonePixelBuffer(result);
        applyBoxBlur(glow, Math.max(1, Math.round(glowAmount * 8)));
        result = blendPixelBuffers(result, glow, "screen", glowAmount * 0.5);
      }
      return result;
    };
  }
};

const risoOffsetPreset: EffectPreset = {
  id: "risoOffset",
  name: "Riso Offset",
  description: "Imperfect risograph-inspired print effect.",
  category: "print",
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
  category: "pixel",
  access: "premium",
  defaultIntensity: 60,
  advancedControlSchema: [
    ...universalAdvancedControls,
    { id: "posterLevels", name: "Poster Levels", type: "range", min: 2, max: 8, step: 1, defaultValue: 3 },
    { id: "edgeStrength", name: "Edge Emphasis", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 },
    { id: "gridOpacity", name: "Grid Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 25 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    posterLevels: resolveOverride(overrides, "posterLevels", 2 + Math.round((intensity / 100) * 6)),
    edgeStrength: resolveOverride(overrides, "edgeStrength", Math.round((intensity / 100) * 60)),
    gridOpacity: resolveOverride(overrides, "gridOpacity", Math.round((intensity / 100) * 40)),
    contrast: resolveOverride(overrides, "contrast", Math.round((intensity / 100) * 40))
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      const posterLevels = (params.posterLevels as number) ?? 3;
      const edgeStrength = ((params.edgeStrength as number) ?? 0) / 100;
      const gridOpacity = ((params.gridOpacity as number) ?? 0) / 100;
      const contrast = ((params.contrast as number) ?? 0) / 100;

      const result = clonePixelBuffer(source);
      if (contrast > 0) {
        adjustBrightnessContrast(result, 0, contrast);
      }
      applyPosterize(result, posterLevels);
      reducePalette(result, 4);
      if (edgeStrength > 0) {
        applyEdgeDetect(result, edgeStrength);
      }

      // Manga-style grid overlay.
      if (gridOpacity > 0) {
        const cell = 24;
        for (let y = 0; y < result.height; y += cell) {
          for (let x = 0; x < result.width; x++) {
            const idx = (y * result.width + x) * 4;
            result.data[idx] = 0;
            result.data[idx + 1] = 0;
            result.data[idx + 2] = 0;
          }
        }
        for (let x = 0; x < result.width; x += cell) {
          for (let y = 0; y < result.height; y++) {
            const idx = (y * result.width + x) * 4;
            result.data[idx] = 0;
            result.data[idx + 1] = 0;
            result.data[idx + 2] = 0;
          }
        }
      }
      return result;
    };
  }
};

export const premiumPresets: EffectPreset[] = [
  pinkDotMatrixPreset,
  blueNoirDitherPreset,
  cyberAsciiPreset,
  cloudPrintPreset,
  crtDreamPreset,
  vhsBloomPreset,
  risoOffsetPreset,
  mangaGridPreset
];
