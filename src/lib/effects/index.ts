import { EffectRenderContext, EffectType, EffectParams } from "./types";
import { pixelate } from "./pixelate";
import { ascii } from "./ascii";
import { orderedDither } from "./orderedDither";
import { halftone } from "./halftone";
import { duotone } from "./duotone";
import { symbolGlow } from "./symbolGlow";

type AnyEffectProcessor = (
  context: EffectRenderContext,
  settings: EffectParams["settings"]
) => void;

const effectRegistry: Record<EffectType, AnyEffectProcessor> = {
  pixelate: pixelate as AnyEffectProcessor,
  ascii: ascii as AnyEffectProcessor,
  orderedDither: orderedDither as AnyEffectProcessor,
  halftone: halftone as AnyEffectProcessor,
  duotone: duotone as AnyEffectProcessor,
  symbolGlow: symbolGlow as AnyEffectProcessor,
};

export function renderEffect(
  effectType: EffectType,
  context: EffectRenderContext,
  settings: EffectParams["settings"]
): void {
  const processor = effectRegistry[effectType];
  processor(context, settings);
}

export { pixelate, ascii, orderedDither, halftone, duotone, symbolGlow };
export * from "./types";
export * from "./defaultSettings";
