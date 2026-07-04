import type { AdvancedControlDefinition, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { classicAsciiPreset } from "./classicAscii.js";
import { resolveOverride } from "../shared.js";

const schema: AdvancedControlDefinition[] = classicAsciiPreset.advancedControlSchema.map((control) =>
  control.id === "characterSet"
    ? { ...control, defaultValue: "blocks" }
    : control
);

export const blocksAsciiPreset: EffectPreset = {
  id: "blocksAscii",
  name: "Blocks ASCII",
  description: "ASCII image built from block-shade glyphs.",
  category: "asciiSymbols",
  defaultIntensity: 1,
  advancedControlSchema: schema,
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    ...classicAsciiPreset.intensityMapper(intensity, overrides),
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6),
    characterSet: resolveOverride(overrides, "characterSet", "blocks"),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 50),
    grainAmount: resolveOverride(overrides, "grainAmount", 15),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: classicAsciiPreset.createPipeline
};
