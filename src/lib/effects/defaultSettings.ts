import {
  EffectType,
  EffectParams,
  PixelateSettings,
  AsciiSettings,
  OrderedDitherSettings,
  HalftoneSettings,
  DuotoneSettings,
  SymbolGlowSettings,
} from "./types";

const pixelateDefaults: PixelateSettings = {
  blockSize: 16,
  showGrid: false,
};

const asciiDefaults: AsciiSettings = {
  fontSize: 10,
  charSet: " .:-=+*#%@",
  colorMode: "monochrome",
  foregroundColor: "#ffffff",
};

const orderedDitherDefaults: OrderedDitherSettings = {
  levels: 2,
  colorMode: "blackAndWhite",
};

const halftoneDefaults: HalftoneSettings = {
  cellSize: 16,
  colorMode: "blackAndWhite",
};

const duotoneDefaults: DuotoneSettings = {
  shadowColor: "#1e3a8a",
  highlightColor: "#f472b6",
};

const symbolGlowDefaults: SymbolGlowSettings = {
  fontSize: 12,
  symbolSet: "2*+/=e",
  glowRadius: 8,
  colorMode: "colored",
};

export function getDefaultSettings(effectType: EffectType): EffectParams {
  switch (effectType) {
    case "pixelate":
      return { type: "pixelate", settings: { ...pixelateDefaults } };
    case "ascii":
      return { type: "ascii", settings: { ...asciiDefaults } };
    case "orderedDither":
      return { type: "orderedDither", settings: { ...orderedDitherDefaults } };
    case "halftone":
      return { type: "halftone", settings: { ...halftoneDefaults } };
    case "duotone":
      return { type: "duotone", settings: { ...duotoneDefaults } };
    case "symbolGlow":
      return { type: "symbolGlow", settings: { ...symbolGlowDefaults } };
  }
}
