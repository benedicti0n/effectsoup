import {
  applyWaveSlice,
  clonePixelBuffer,
  type PixelBuffer
} from "@effectsoup/core";
import type { EffectPipeline, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { resolveOverride } from "../shared.js";

export const waveSlicePreset: EffectPreset = {
  id: "waveSlice",
  name: "Wave Slice",
  description: "Sine-wave displacement across horizontal or vertical slices.",
  category: "signalLab",
  access: "premium",
  defaultIntensity: 40,
  advancedControlSchema: [
    { id: "amplitude", name: "Amplitude", type: "range", min: 0, max: 60, step: 1, defaultValue: 12 },
    { id: "frequency", name: "Frequency", type: "range", min: 1, max: 20, step: 1, defaultValue: 4 },
    { id: "direction", name: "Direction", type: "select", options: ["horizontal", "vertical"], defaultValue: "horizontal" }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    amplitude: resolveOverride(overrides, "amplitude", Math.round((intensity / 100) * 30)),
    frequency: resolveOverride(overrides, "frequency", Math.max(1, Math.round((intensity / 100) * 10))),
    direction: resolveOverride(overrides, "direction", "horizontal")
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const amplitude = (params.amplitude as number) ?? 12;
      const frequency = (params.frequency as number) ?? 4;
      const direction = (params.direction as string) ?? "horizontal";

      return applyWaveSlice(source, {
        amplitude,
        frequency,
        direction: direction as "horizontal" | "vertical"
      });
    };
  }
};
