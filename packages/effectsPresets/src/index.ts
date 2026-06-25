export * from "./types.js";
export { freePresets } from "./freePresets.js";
export { premiumPresets } from "./premiumPresets.js";

import { freePresets } from "./freePresets.js";
import { premiumPresets } from "./premiumPresets.js";
import type { EffectPreset } from "./types.js";

export const allPresets: EffectPreset[] = [...freePresets, ...premiumPresets];

const legacyPresetMap: Record<string, string> = {
  monoDither: "errorDiffusionDither",
  mangaGrid: "pixelGrid"
};

/**
 * Map legacy preset IDs to their modern replacements.
 * Returns the input id if no migration is needed.
 */
export function migratePresetId(id: string): string {
  return legacyPresetMap[id] ?? id;
}

export function getPresetById(id: string): EffectPreset | undefined {
  const migratedId = migratePresetId(id);
  return allPresets.find((preset) => preset.id === migratedId);
}
