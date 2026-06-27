import { pixelGridPreset } from "./presets/free/pixelGrid.js";
import { errorDiffusionDitherPreset } from "./presets/free/errorDiffusionDither.js";
import { orderedDitherPreset } from "./presets/free/orderedDither.js";
import { classicAsciiPreset } from "./presets/free/classicAscii.js";
import { blocksAsciiPreset } from "./presets/free/blocksAscii.js";
import { minimalAsciiPreset } from "./presets/free/minimalAscii.js";
import { dotHalftonePreset } from "./presets/free/dotHalftone.js";
import { duotonePreset } from "./presets/free/duotone.js";
import { dreamGlowPreset } from "./presets/free/dreamGlow.js";
import { noirGrainPreset } from "./presets/free/noirGrain.js";
import { ledMatrixPreset } from "./presets/free/ledMatrix.js";
import { stipplePrintPreset } from "./presets/free/stipplePrint.js";
import { crtGlitchPreset } from "./presets/free/crtGlitch.js";
import { pencilGrainPreset } from "./presets/free/pencilGrain.js";
import type { EffectPreset } from "./types.js";

export const freePresets: EffectPreset[] = [
  pixelGridPreset,
  errorDiffusionDitherPreset,
  orderedDitherPreset,
  classicAsciiPreset,
  blocksAsciiPreset,
  minimalAsciiPreset,
  dotHalftonePreset,
  duotonePreset,
  dreamGlowPreset,
  noirGrainPreset,
  ledMatrixPreset,
  stipplePrintPreset,
  crtGlitchPreset,
  pencilGrainPreset
];
