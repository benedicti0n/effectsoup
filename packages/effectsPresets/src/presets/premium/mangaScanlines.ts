import {
  applyMangaScreen,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { hexToRgba, resolveOverride } from "../shared.js";

export const mangaScanlinesPreset: EffectPreset = {
  id: "mangaScanlines",
  name: "Manga Scanlines",
  description: "Screen-tone line pattern inspired by manga printing.",
  category: "printPaper",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "lineSpacing", name: "Line Spacing", type: "range", min: 2, max: 24, step: 1, defaultValue: 5 },
    { id: "lineWidth", name: "Line Width", type: "range", min: 1, max: 8, step: 1, defaultValue: 2 },
    { id: "angle", name: "Angle", type: "range", min: 0, max: 180, step: 1, defaultValue: 0 },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 95 },
    { id: "inkColor", name: "Ink Color", type: "color", defaultValue: "#1a1a1a" },
    { id: "paperColor", name: "Paper Color", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    lineSpacing: resolveOverride(overrides, "lineSpacing", 5),
    lineWidth: resolveOverride(overrides, "lineWidth", 2),
    angle: resolveOverride(overrides, "angle", 0),
    threshold: resolveOverride(overrides, "threshold", 95),
    inkColor: resolveOverride(overrides, "inkColor", "#1a1a1a"),
    paperColor: resolveOverride(overrides, "paperColor", "#ffffff")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const lineSpacing = (params.lineSpacing as number) ?? 5;
      const lineWidth = (params.lineWidth as number) ?? 2;
      const angle = (params.angle as number) ?? 0;
      const threshold = (params.threshold as number) ?? 95;
      const inkColor = hexToRgba((params.inkColor as string) ?? "#1a1a1a");
      const paperColor = hexToRgba((params.paperColor as string) ?? "#ffffff");

      return applyMangaScreen(source, {
        lineSpacing,
        lineWidth,
        angle,
        threshold,
        inkColor,
        paperColor
      });
    };
  }
};
