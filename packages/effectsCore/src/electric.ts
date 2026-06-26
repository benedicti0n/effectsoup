import type { PixelBuffer, RgbaColor } from "./types.js";
import { applyTint } from "./color.js";
import { renderEdgeBuffer } from "./edge.js";
import { blendPixelBuffers } from "./blend.js";
import { applyBloom } from "./glow.js";

export type ElectricDreamOptions = {
  edgeStrength: number;
  glowRadius: number;
  glowAmount: number;
  neonColor?: RgbaColor;
};

/**
 * Turn edges into a neon outline with a soft bloom, blended over the source
 * with a screen-like merge. Inspired by synthwave/electric dream aesthetics.
 */
export function applyElectricDream(
  source: PixelBuffer,
  options: ElectricDreamOptions
): PixelBuffer {
  const {
    edgeStrength,
    glowRadius,
    glowAmount,
    neonColor = [0, 240, 255, 255]
  } = options;

  const edges = renderEdgeBuffer(source);
  applyTint(edges, neonColor, 1);

  if (glowAmount > 0 && glowRadius > 0) {
    applyBloom(edges, {
      radius: glowRadius,
      threshold: 0.05,
      amount: glowAmount,
      color: neonColor
    });
  }

  const blendAmount = Math.max(0, Math.min(1, edgeStrength));
  return blendPixelBuffers(source, edges, "screen", blendAmount);
}
