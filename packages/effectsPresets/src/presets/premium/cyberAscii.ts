import {
  applyBoxBlur,
  applyGrain,
  applyGridOverlay,
  clampByte,
  clonePixelBuffer,
  createPixelBuffer,
  renderAscii,
  type PixelBuffer,
  type RgbaColor
} from "@imageeffects/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import {
  atmosphereAdvancedControls,
  CYBER_TINT_PRESETS,
  hexToRgba,
  resolveOverride
} from "../shared.js";

export const cyberAsciiPreset: EffectPreset = {
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
    { id: "tintColor", name: "Tint", type: "color", defaultValue: "#00FF88" },
    { id: "baseOpacity", name: "Base Opacity", type: "range", min: 0, max: 100, step: 1, defaultValue: 40 }
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
      grainAmount: resolveOverride(overrides, "grainAmount", Math.round((intensity / 100) * 20)),
      baseOpacity: resolveOverride(overrides, "baseOpacity", 40)
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
      const baseOpacity = ((params.baseOpacity as number) ?? 40) / 100;
      // Technical glyph set with more symbols for detail.
      const charset = " .:-=+*#%@01/\\|<>[]{}";
      const trimmedCharset = charset.slice(0, Math.max(2, density + 12));

      const renderColorMode: "monochrome" | "color" | "source" =
        colorMode === "monochrome" ? "monochrome" : colorMode === "tint" ? "color" : "source";
      const inkColor = colorMode === "tint" ? tintColor : [100, 200, 255, 255] as RgbaColor;

      const { width, height } = source;
      let backgroundLayer: PixelBuffer;
      if (baseOpacity > 0) {
        backgroundLayer = clonePixelBuffer(source);
        for (let i = 0; i < backgroundLayer.data.length; i += 4) {
          backgroundLayer.data[i] = Math.round(backgroundLayer.data[i] * baseOpacity);
          backgroundLayer.data[i + 1] = Math.round(backgroundLayer.data[i + 1] * baseOpacity);
          backgroundLayer.data[i + 2] = Math.round(backgroundLayer.data[i + 2] * baseOpacity);
        }
      } else {
        backgroundLayer = createPixelBuffer(width, height, [2, 2, 8, 255]);
      }

      const glyphLayer = renderAscii(source, {
        fontSize,
        inkColor,
        backgroundColor: [0, 0, 0, 0],
        charset: trimmedCharset,
        colorMode: renderColorMode,
        minGlyphLuminance: 0.25,
        backgroundMode: "transparent"
      });

      const result = clonePixelBuffer(backgroundLayer);
      for (let i = 0; i < result.data.length; i += 4) {
        const alpha = glyphLayer.data[i + 3] / 255;
        if (alpha > 0) {
          for (let c = 0; c < 3; c++) {
            result.data[i + c] = Math.round(
              glyphLayer.data[i + c] + backgroundLayer.data[i + c] * (1 - alpha)
            );
          }
        }
        result.data[i + 3] = 255;
      }

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
