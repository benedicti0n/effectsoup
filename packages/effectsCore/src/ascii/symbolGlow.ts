import type { PixelBuffer } from "../types.js";
import { clampByte, createPixelBuffer } from "../buffer.js";
import { applyBoxBlur } from "../blend.js";
import { applyBloom } from "../glow.js";
import { renderAscii } from "./renderAscii.js";
import { computeHighlightMask } from "./weightMaps.js";
import type { SymbolGlowOptions } from "./types.js";

/**
 * Symbol Glow effect:
 * 1. Blur the source image for a soft, image-like base.
 * 2. Build a highlight+edge mask and render symbols only where the mask passes.
 * 3. Render a matching glow layer, blur it, and composite it over the base.
 * 4. Composite the crisp symbol layer on top.
 */
export function renderSymbolGlow(
  source: PixelBuffer,
  options: SymbolGlowOptions
): PixelBuffer {
  const {
    fontSize,
    symbolSet,
    baseBlur,
    glowRadius,
    glowAmount,
    threshold,
    falloff,
    edgeStrength = 0.5,
    colorMode,
    antialias = true
  } = options;

  const symbols = symbolSet.length > 0 ? symbolSet : "2*+/=e";
  const { width, height } = source;

  const blurredBase: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(source.data)
  };
  applyBoxBlur(blurredBase, Math.max(0, baseBlur));

  const mask = computeHighlightMask(source, threshold, falloff, edgeStrength);

  const symbolLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 0],
    charset: symbols,
    colorMode: colorMode === "colored" ? "source" : "monochrome",
    backgroundMode: "transparent",
    densityMap: mask,
    antialias
  });

  const glowLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 255],
    charset: symbols,
    colorMode: colorMode === "colored" ? "source" : "monochrome",
    backgroundMode: "solid",
    densityMap: mask,
    antialias
  });

  if (glowRadius > 0 && glowAmount > 0) {
    applyBloom(glowLayer, {
      radius: glowRadius,
      threshold: 0.3,
      amount: glowAmount * 0.6
    });
  }

  const output = createPixelBuffer(width, height);
  for (let i = 0; i < output.data.length; i += 4) {
    // Start with the sharp source, then blend in the blurred base only where
    // the symbol mask is active so the blur sits behind the glyphs.
    const maskAlpha = mask.data[i] / 255;
    for (let c = 0; c < 3; c++) {
      output.data[i + c] = clampByte(
        blurredBase.data[i + c] * maskAlpha + source.data[i + c] * (1 - maskAlpha)
      );
    }

    // Add localized glow using a screen blend (background stays black where no glow).
    if (glowAmount > 0) {
      for (let c = 0; c < 3; c++) {
        const glow = glowLayer.data[i + c];
        output.data[i + c] = clampByte(
          255 - ((255 - output.data[i + c]) * (255 - glow)) / 255
        );
      }
    }

    // Composite crisp symbols on top.
    const alpha = symbolLayer.data[i + 3] / 255;
    if (alpha > 0) {
      for (let c = 0; c < 3; c++) {
        output.data[i + c] = clampByte(
          symbolLayer.data[i + c] * alpha + output.data[i + c] * (1 - alpha)
        );
      }
    }

    output.data[i + 3] = 255;
  }

  return output;
}
