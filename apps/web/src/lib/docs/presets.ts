import { allPresets, getPresetById, type EffectPreset } from "@effectsoup/presets";
import type { PresetCategory } from "@effectsoup/presets";

export type CategoryInfo = {
  id: PresetCategory;
  name: string;
  description: string;
  bestFor: string;
  idealImages: string;
};

export const categoryInfo: Record<PresetCategory, CategoryInfo> = {
  pixelDither: {
    id: "pixelDither",
    name: "Pixel & Dither",
    description: "Effects that break an image into discrete pixel blocks or dot patterns — from soft halftone screens to aggressive ordered dithering.",
    bestFor: "Portraits, editorial images, and any photo that benefits from a structured retro texture.",
    idealImages: "High-contrast images with clear subjects. Portraits and still life work especially well."
  },
  asciiSymbols: {
    id: "asciiSymbols",
    name: "ASCII & Symbols",
    description: "Luminance-to-glyph mapping that turns photos into text art. From dense monochrome character grids to luminous neon symbol fields.",
    bestFor: "Creating text art from portraits, landscapes with strong tonal range, and logos or titles.",
    idealImages: "Images with strong lighting contrast. Faces and silhouettes produce the most readable ASCII results."
  },
  printPaper: {
    id: "printPaper",
    name: "Print & Ink",
    description: "Analog-inspired looks: stipple dots, pencil sketch textures, risograph offsets, and hand-drawn illustration effects.",
    bestFor: "Editorial illustration, mockups, and turning photos into art that looks printed on paper.",
    idealImages: "Clean, well-lit photos. Overly dark or busy images lose stipple and pencil detail."
  },
  distortionGlass: {
    id: "distortionGlass",
    name: "Distortion & Glass",
    description: "Refractive and geometric distortion effects that simulate looking through textured glass, faceted lenses, or water surfaces.",
    bestFor: "Abstract portraits, album art, and creating visual texture in flat images.",
    idealImages: "Simple compositions with a clear focal point. Busy backgrounds can become visually overwhelming."
  },
  colorGlow: {
    id: "colorGlow",
    name: "Color & Tone",
    description: "Color transformation presets: duotone mapping, film grain, LED matrix simulation, and moody black-and-white grading.",
    bestFor: "Color grading, moody portraits, and giving photos a distinctive color identity.",
    idealImages: "High-quality source images. The LED matrix effect works best with bold graphic shapes."
  },
  atmosphereGlow: {
    id: "atmosphereGlow",
    name: "Atmosphere & Glow",
    description: "Cinematic bloom and atmospheric lighting effects. Multi-band highlight bloom, selective color diffusion, and soft film-grain finish.",
    bestFor: "Portraits with rim lighting, sunset scenes, and dreamy editorial looks.",
    idealImages: "Warm-toned portraits, backlit scenes, golden hour photos. Flatly-lit images without highlights produce less bloom."
  },
  retroSignal: {
    id: "retroSignal",
    name: "Retro Signal",
    description: "CRT display simulation, glitch artifacts, RGB channel separation, scanlines, VHS noise, and analog broadcast decay.",
    bestFor: "Cyberpunk aesthetics, music videos, and nostalgic tech-inspired visuals.",
    idealImages: "Strong silhouettes, neon lighting, and high-contrast scenes. Images with bright highlights and dark shadows show the most CRT character."
  }
};

export const premiumPresets: string[] = [
  "bitmap", "cyberAscii", "luminousAsciiBloom", "symbolGlow",
  "crtDream", "vhsBloom", "risoOffset", "cubicGlass",
  "mangaScanlines", "waveSlice", "invertedGlow"
];

export function isPremium(presetId: string): boolean {
  return premiumPresets.includes(presetId);
}

export function getEffects(): EffectPreset[] {
  return allPresets;
}

export function getEffectById(id: string): EffectPreset | undefined {
  return getPresetById(id);
}

export function getEffectsByCategory(category: PresetCategory): EffectPreset[] {
  return allPresets.filter((p) => p.category === category);
}

export function getCategoryPresets(): Record<PresetCategory, EffectPreset[]> {
  const result = {} as Record<PresetCategory, EffectPreset[]>;
  for (const cat of Object.keys(categoryInfo) as PresetCategory[]) {
    result[cat] = getEffectsByCategory(cat);
  }
  return result;
}

export function getControlDisplayName(id: string): string {
  const names: Record<string, string> = {
    cellSize: "Cell Size",
    threshold: "Threshold",
    invert: "Invert",
    dotSize: "Dot Size",
    dotSpacing: "Dot Spacing",
    spacing: "Spacing",
    density: "Density",
    inkColor: "Ink Color",
    paperColor: "Paper Color",
    shape: "Shape",
    colorMode: "Color Mode",
    tintColor: "Tint Color",
    glowAmount: "Glow Amount",
    grainAmount: "Grain Amount",
    brightness: "Brightness",
    contrast: "Contrast",
    saturation: "Saturation",
    saturationBoost: "Saturation Boost",
    fontSize: "Font Size",
    customCharset: "Custom Charset",
    backgroundColor: "Background Color",
    baseOpacity: "Base Opacity",
    ink: "Ink Color",
    shadowColor: "Shadow Color",
    highlightColor: "Highlight Color",
    vignette: "Vignette",
    edgeStrength: "Edge Strength",
    sliceHeight: "Slice Height",
    shiftAmount: "Shift Amount",
    rgbShift: "RGB Shift",
    scanlineStrength: "Scanline Strength",
    noiseAmount: "Noise Amount",
    palette: "Palette",
    blurAmount: "Blur Amount",
    gridOpacity: "Grid Opacity",
    colorLevels: "Color Levels",
    ditherThreshold: "Dither Threshold",
    characterSet: "Character Set",
    symbolSet: "Symbol Set",
    densityMode: "Density Mode",
    colorIntensity: "Color Intensity",
    chromaticStrength: "Chromatic Strength",
    refractionStrength: "Refraction Strength",
    gridSize: "Grid Size",
    phaseSpeed: "Phase Speed",
    lineCount: "Line Count",
    waveAmplitude: "Wave Amplitude",
    waveFrequency: "Wave Frequency",
    intensity: "Intensity",
    shift: "Shift",
    spread: "Spread",
    blendMode: "Blend Mode",
    size: "Size",
    strength: "Strength",
    amount: "Amount",
    radius: "Radius",
    mode: "Mode",
    color: "Color",
    opacity: "Opacity"
  };
  return names[id] ?? id;
}
