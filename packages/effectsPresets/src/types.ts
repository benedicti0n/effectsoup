import type { PixelBuffer } from "@imageeffects/core";

export type PresetCategory =
  | "printGrid"
  | "asciiSymbols"
  | "atmosphereGlow"
  | "glassFrost";

export type PresetAccess = "free" | "premium";

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
  access: PresetAccess;
  defaultIntensity: number;
  intensityMapper: IntensityMapper;
  advancedControlSchema: AdvancedControlDefinition[];
  createPipeline: (resolvedParameters: ResolvedPresetParameters) => EffectPipeline;
};
