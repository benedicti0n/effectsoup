export * from "./types.js";

import { pixelGridPreset } from "./presets/free/pixelGrid.js";
import { errorDiffusionDitherPreset } from "./presets/free/errorDiffusionDither.js";
import { orderedDitherPreset } from "./presets/free/orderedDither.js";
import { colorDitherPreset } from "./presets/free/colorDither.js";
import { coloredCellDitherPreset } from "./presets/free/coloredCellDither.js";
import { classicAsciiPreset } from "./presets/free/classicAscii.js";
import { blocksAsciiPreset } from "./presets/free/blocksAscii.js";
import { denseAsciiPreset } from "./presets/free/denseAscii.js";
import { dotHalftonePreset } from "./presets/free/dotHalftone.js";
import { duotonePreset } from "./presets/free/duotone.js";
import { dreamGlowPreset } from "./presets/free/dreamGlow.js";
import { noirGrainPreset } from "./presets/free/noirGrain.js";
import { ledMatrixPreset } from "./presets/free/ledMatrix.js";
import { stipplePrintPreset } from "./presets/free/stipplePrint.js";
import { crtGlitchPreset } from "./presets/free/crtGlitch.js";
import { pencilGrainPreset } from "./presets/free/pencilGrain.js";
import { bitmapPreset } from "./presets/premium/bitmap.js";
import { cyberAsciiPreset } from "./presets/premium/cyberAscii.js";
import { luminousAsciiBloomPreset } from "./presets/premium/luminousAsciiBloom.js";
import { symbolGlowPreset } from "./presets/premium/symbolGlow.js";
import { crtDreamPreset } from "./presets/premium/crtDream.js";
import { vhsBloomPreset } from "./presets/premium/vhsBloom.js";
import { risoOffsetPreset } from "./presets/premium/risoOffset.js";
import { cubicGlassPreset } from "./presets/premium/cubicGlass.js";
import { mangaScanlinesPreset } from "./presets/premium/mangaScanlines.js";
import { waveSlicePreset } from "./presets/premium/waveSlice.js";
import { invertedGlowPreset } from "./presets/premium/invertedGlow.js";
import type { EffectPreset } from "./types.js";

export const allPresets: EffectPreset[] = [
  pixelGridPreset,
  errorDiffusionDitherPreset,
  orderedDitherPreset,
  colorDitherPreset,
  coloredCellDitherPreset,
  dotHalftonePreset,
  classicAsciiPreset,
  blocksAsciiPreset,
  denseAsciiPreset,
  stipplePrintPreset,
  pencilGrainPreset,
  duotonePreset,
  dreamGlowPreset,
  ledMatrixPreset,
  noirGrainPreset,
  crtGlitchPreset,
  bitmapPreset,
  cyberAsciiPreset,
  luminousAsciiBloomPreset,
  symbolGlowPreset,
  risoOffsetPreset,
  mangaScanlinesPreset,
  waveSlicePreset,
  cubicGlassPreset,
  invertedGlowPreset,
  crtDreamPreset,
  vhsBloomPreset
];

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

const presetIdSet = new Set(allPresets.map((preset) => preset.id));

export function getPresetIds(): string[] {
  return allPresets.map((preset) => preset.id);
}

export function hasPresetId(id: string): boolean {
  return presetIdSet.has(migratePresetId(id));
}
