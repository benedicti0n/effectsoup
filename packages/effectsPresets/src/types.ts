import type { PixelBuffer } from "@effectsoup/core";

export type PresetCategory =
  | "pixelDither"
  | "asciiSymbols"
  | "printPaper"
  | "distortionGlass"
  | "colorGlow"
  | "retroSignal";

export type AdvancedControlType =
  | "range"
  | "select"
  | "color"
  | "boolean"
  | "text";

export type AdvancedControlDefinition = {
  id: string;
  name: string;
  type: AdvancedControlType;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: number | string | boolean;
};

export type ResolvedPresetParameters = {
  intensity: number;
  advancedOverrides: Record<string, number | string | boolean>;
  [key: string]: unknown;
};

export type IntensityMapper = (
  intensity: number,
  advancedOverrides: Record<string, number | string | boolean>
) => ResolvedPresetParameters;

export type EffectPipeline = (
  source: PixelBuffer,
  params: ResolvedPresetParameters
) => PixelBuffer;

export type EffectPreset = {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  defaultIntensity: number;
  /** Whether the main Intensity slider is shown for this preset. Defaults to true. */
  usesIntensity?: boolean;
  intensityMapper: IntensityMapper;
  advancedControlSchema: AdvancedControlDefinition[];
  createPipeline: (resolvedParameters: ResolvedPresetParameters) => EffectPipeline;
};
