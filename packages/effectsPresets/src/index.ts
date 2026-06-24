export * from "./types.js";
export { freePresets } from "./freePresets.js";
export { premiumPresets } from "./premiumPresets.js";

import { freePresets } from "./freePresets.js";
import { premiumPresets } from "./premiumPresets.js";
import type { EffectPreset } from "./types.js";

export const allPresets: EffectPreset[] = [...freePresets, ...premiumPresets];

export function getPresetById(id: string): EffectPreset | undefined {
  return allPresets.find((preset) => preset.id === id);
}
