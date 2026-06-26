export {
  ASCII_CHARSET_PRESETS,
  normalizeCustomCharset,
  resolveGlyphBitmap
} from "./font.js";

export type {
  AsciiColorMode,
  AsciiBackgroundMode,
  AsciiOptions,
  SymbolGlowOptions,
  LuminousAsciiBloomOptions,
  AsciiWeightMapOptions
} from "./types.js";

export {
  renderAscii
} from "./renderAscii.js";

export {
  renderSymbolGlow
} from "./symbolGlow.js";

export {
  renderLuminousAsciiBloom
} from "./luminousAsciiBloom.js";

export {
  computeLuminanceBuffer,
  computeGradientMagnitudeBuffer,
  computeHighlightMask,
  computeAsciiWeightMap
} from "./weightMaps.js";
