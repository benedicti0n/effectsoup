import { EffectParams, EffectType } from "@/lib/effects/types";

export interface Preset {
  id: string;
  name: string;
  effectType: EffectType;
  settings: EffectParams["settings"];
}

export const PRESETS: Preset[] = [
  {
    id: "dream-ascii",
    name: "Dream ASCII",
    effectType: "ascii",
    settings: {
      fontSize: 8,
      charSet: " .`^,:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
      colorMode: "colored",
      foregroundColor: "#ffffff",
    },
  },
  {
    id: "newspaper-dither",
    name: "Newspaper Dither",
    effectType: "orderedDither",
    settings: {
      levels: 2,
      colorMode: "blackAndWhite",
    },
  },
  {
    id: "dark-dot-poster",
    name: "Dark Dot Poster",
    effectType: "halftone",
    settings: {
      cellSize: 24,
      colorMode: "blackAndWhite",
    },
  },
  {
    id: "pixel-anime",
    name: "Pixel Anime",
    effectType: "pixelate",
    settings: {
      blockSize: 24,
      showGrid: false,
    },
  },
  {
    id: "soft-duotone",
    name: "Soft Duotone",
    effectType: "duotone",
    settings: {
      shadowColor: "#312e81",
      highlightColor: "#f9a8d4",
    },
  },
  {
    id: "symbol-glow-flower",
    name: "Symbol Glow Flower",
    effectType: "symbolGlow",
    settings: {
      fontSize: 10,
      symbolSet: "2*+/=e",
      glowRadius: 12,
      colorMode: "colored",
    },
  },
];
