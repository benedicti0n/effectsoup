import type { EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { classicAsciiPreset } from "./classicAscii.js";
import { resolveOverride } from "../shared.js";

export const blocksAsciiPreset: EffectPreset = {
  id: "blocksAscii",
  name: "Blocks ASCII",
  description: "ASCII image built from block-shade glyphs.",
  category: "asciiSymbols",
  access: "free",
  defaultIntensity: 15,
  advancedControlSchema: classicAsciiPreset.advancedControlSchema,
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    ...classicAsciiPreset.intensityMapper(intensity, overrides),
    advancedOverrides: overrides,
    characterSet: resolveOverride(overrides, "characterSet", "blocks")
  }),
  createPipeline: classicAsciiPreset.createPipeline
};
