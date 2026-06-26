import type { PixelBuffer } from "../types.js";
import { clampByte, createPixelBuffer } from "../buffer.js";
import { applyBloom } from "../glow.js";
import { renderAscii } from "./renderAscii.js";
import type { LuminousAsciiBloomOptions } from "./types.js";

/**
 * Luminous ASCII Bloom effect:
 * 1. Dim the source image to a subtle support layer.
 * 2. Render source-colored ASCII glyphs on a transparent layer.
 * 3. Derive a bloom pass from the bright glyphs and blur it.
 * 4. Composite base + bloom + crisp glyphs on top.
 */
export function renderLuminousAsciiBloom(
  source: PixelBuffer,
  options: LuminousAsciiBloomOptions
): PixelBuffer {
  const {
    fontSize,
    density,
    bloomRadius,
    glowAmount,
    baseOpacity = 0.2,
    minGlyphLuminance = 0.2
  } = options;

  const { width, height } = source;
  const fullCharset = " .:-=+*#%@";
  const charset = fullCharset.slice(0, Math.max(2, Math.min(fullCharset.length, density)));

  const base: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(source.data)
  };
  for (let i = 0; i < base.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      base.data[i + c] = clampByte(base.data[i + c] * baseOpacity);
    }
  }

  const glyphLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 0],
    charset,
    colorMode: "source",
    backgroundMode: "transparent",
    minGlyphLuminance
  });

  const glowLayer: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(glyphLayer.data)
  };
  if (glowAmount > 0 && bloomRadius > 0) {
    applyBloom(glowLayer, {
      radius: bloomRadius,
      threshold: 0.35,
      amount: glowAmount * 0.6
    });
  }

  const output = createPixelBuffer(width, height);
  for (let i = 0; i < output.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = base.data[i + c];
      // Screen in the bloom.
      const glow = glowLayer.data[i + c];
      value = clampByte(255 - ((255 - value) * (255 - glow)) / 255);
      // Composite crisp glyphs on top.
      const alpha = glyphLayer.data[i + 3] / 255;
      value = clampByte(glyphLayer.data[i + c] * alpha + value * (1 - alpha));
      output.data[i + c] = value;
    }
    output.data[i + 3] = 255;
  }

  return output;
}
