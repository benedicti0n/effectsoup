import type { AdvancedControlDefinition, EffectPreset, ResolvedPresetParameters } from "../../types.js";
import { classicAsciiPreset } from "./classicAscii.js";
import { resolveOverride } from "../shared.js";

// Reuse the Classic ASCII schema but skip the now-removed
// characterSet dropdown (blocksAscii just uses the standard
// character set; users wanting blocks can supply a custom
// character array via the Custom Character Array control).
const schema: AdvancedControlDefinition[] = classicAsciiPreset.advancedControlSchema.filter(
  (control) => control.id !== "characterSet"
);

export const blocksAsciiPreset: EffectPreset = {
  id: "blocksAscii",
  name: "Blocks ASCII",
  description: "ASCII image built from block-shade glyphs. Customize the character array in the advanced controls.",
  category: "asciiSymbols",
  defaultIntensity: 1,
  advancedControlSchema: schema,
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    ...classicAsciiPreset.intensityMapper(intensity, overrides),
    advancedOverrides: overrides,
    fontSize: resolveOverride(overrides, "fontSize", 6),
    baseOpacity: resolveOverride(overrides, "baseOpacity", 50),
    grainAmount: resolveOverride(overrides, "grainAmount", 15),
    glowAmount: resolveOverride(overrides, "glowAmount", 0)
  }),
  createPipeline: classicAsciiPreset.createPipeline
};
