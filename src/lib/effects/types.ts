export type EffectType =
  | "pixelate"
  | "ascii"
  | "orderedDither"
  | "halftone"
  | "duotone"
  | "symbolGlow";

export interface EffectRenderContext {
  ctx: CanvasRenderingContext2D;
  sourceImageData: ImageData;
  sourceImage: HTMLImageElement;
  width: number;
  height: number;
}

export interface PixelateSettings {
  blockSize: number;
  showGrid: boolean;
}

export interface AsciiSettings {
  fontSize: number;
  charSet: string;
  colorMode: "monochrome" | "colored";
  foregroundColor: string;
}

export interface OrderedDitherSettings {
  levels: number;
  colorMode: "blackAndWhite" | "colored";
}

export interface HalftoneSettings {
  cellSize: number;
  colorMode: "blackAndWhite" | "colored";
}

export interface DuotoneSettings {
  shadowColor: string;
  highlightColor: string;
}

export interface SymbolGlowSettings {
  fontSize: number;
  symbolSet: string;
  glowRadius: number;
  colorMode: "monochrome" | "colored";
}

export type EffectParams =
  | { type: "pixelate"; settings: PixelateSettings }
  | { type: "ascii"; settings: AsciiSettings }
  | { type: "orderedDither"; settings: OrderedDitherSettings }
  | { type: "halftone"; settings: HalftoneSettings }
  | { type: "duotone"; settings: DuotoneSettings }
  | { type: "symbolGlow"; settings: SymbolGlowSettings };

export type SettingsForType<T extends EffectType> = Extract<
  EffectParams,
  { type: T }
>["settings"];

export type EffectProcessor<T extends EffectType> = (
  context: EffectRenderContext,
  settings: SettingsForType<T>
) => void;

export const EFFECT_LABELS: Record<EffectType, string> = {
  pixelate: "Pixelate",
  ascii: "ASCII",
  orderedDither: "Ordered Dither",
  halftone: "Halftone",
  duotone: "Duotone",
  symbolGlow: "Symbol Glow",
};
