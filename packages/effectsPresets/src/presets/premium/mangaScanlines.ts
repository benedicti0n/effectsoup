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
  access: "premium",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "lineSpacing", name: "Line Spacing", type: "range", min: 2, max: 24, step: 1, defaultValue: 6 },
    { id: "lineWidth", name: "Line Width", type: "range", min: 1, max: 8, step: 1, defaultValue: 1 },
    { id: "angle", name: "Angle", type: "range", min: 0, max: 180, step: 1, defaultValue: 45 },
    { id: "threshold", name: "Threshold", type: "range", min: 0, max: 255, step: 1, defaultValue: 140 },
    { id: "inkColor", name: "Ink Color", type: "color", defaultValue: "#1a1a1a" },
    { id: "paperColor", name: "Paper Color", type: "color", defaultValue: "#ffffff" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    lineSpacing: resolveOverride(overrides, "lineSpacing", Math.max(2, Math.round(14 - (intensity / 100) * 10))),
    lineWidth: resolveOverride(overrides, "lineWidth", 1),
    angle: resolveOverride(overrides, "angle", 45),
    threshold: resolveOverride(overrides, "threshold", Math.round(200 - (intensity / 100) * 120)),
    inkColor: resolveOverride(overrides, "inkColor", "#1a1a1a"),
    paperColor: resolveOverride(overrides, "paperColor", "#ffffff")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const lineSpacing = (params.lineSpacing as number) ?? 6;
      const lineWidth = (params.lineWidth as number) ?? 1;
      const angle = (params.angle as number) ?? 45;
      const threshold = (params.threshold as number) ?? 140;
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
