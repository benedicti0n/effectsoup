import { cyberAsciiPreset } from "./presets/premium/cyberAscii.js";
import { luminousAsciiBloomPreset } from "./presets/premium/luminousAsciiBloom.js";
import { symbolGlowPreset } from "./presets/premium/symbolGlow.js";
import { crtDreamPreset } from "./presets/premium/crtDream.js";
import { vhsBloomPreset } from "./presets/premium/vhsBloom.js";
import { risoOffsetPreset } from "./presets/premium/risoOffset.js";
import { cubicGlassPreset } from "./presets/premium/cubicGlass.js";
import { bitmapPreset } from "./presets/premium/bitmap.js";
import { mangaScanlinesPreset } from "./presets/premium/mangaScanlines.js";
import { waveSlicePreset } from "./presets/premium/waveSlice.js";
import { invertedGlowPreset } from "./presets/premium/invertedGlow.js";
import type { EffectPreset } from "./types.js";

export const premiumPresets: EffectPreset[] = [
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
