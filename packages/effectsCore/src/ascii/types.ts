import type { RgbaColor } from "../types.js";
import type { PixelBuffer } from "../types.js";

export type AsciiColorMode = "monochrome" | "color" | "source";
export type AsciiBackgroundMode = "solid" | "source" | "transparent";

export type AsciiOptions = {
  fontSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  charset?: string;
  colorMode?: AsciiColorMode;
  backgroundMode?: AsciiBackgroundMode;
  spacing?: number;
  palette?: RgbaColor[];
  invertLuminance?: boolean;
  antialias?: boolean;
  /** Optional single-channel weight map (same size as source). Values 0..255 scale glyph coverage per cell. */
  densityMap?: PixelBuffer;
  /** Minimum normalized luminance (0..1) for source/color glyphs. Dark colors are lifted to this floor. */
  minGlyphLuminance?: number;
};

export type SymbolGlowOptions = {
  cellSize: number;
  blur: number;
  brightness: number;
  charset: string;
  colorBoost?: number;
  colorMode?: "colored" | "monochrome";
};

export type LuminousAsciiBloomOptions = {
  fontSize: number;
  density: number;
  bloomRadius: number;
  glowAmount: number;
  baseOpacity?: number;
  minGlyphLuminance?: number;
  customCharset?: string;
};

export type AsciiWeightMapOptions = {
  highlightThreshold: number;
  shadowThreshold: number;
  edgeStrength: number;
  shadowStrength: number;
};
