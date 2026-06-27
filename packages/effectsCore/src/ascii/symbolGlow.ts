import type { PixelBuffer } from "../types.js";
import { clampByte, createPixelBuffer } from "../buffer.js";
import { applyBoxBlur } from "../blend.js";
import { renderAscii } from "./renderAscii.js";
import type { SymbolGlowOptions } from "./types.js";

/**
 * Symbol Glow (ASCII Bloom):
 * 1. Blur the source image for a soft, image-like base.
 * 2. Brighten the source and render an ASCII symbol overlay in the source
 *    color (or monochrome), skipping dark cells via a leading space in the
 *    character set.
 * 3. Boost the overlay colors so the symbols read as luminous.
 * 4. Composite the crisp symbol layer over the blurred base.
 */
export function renderSymbolGlow(
  source: PixelBuffer,
  options: SymbolGlowOptions
): PixelBuffer {
  const {
    cellSize,
    blur,
    brightness,
    charset,
    colorBoost = 60,
    colorMode = "colored"
  } = options;

  if (cellSize <= 0) {
    throw new Error("cellSize must be positive");
  }
  if (brightness < 0) {
    throw new Error("brightness must be non-negative");
  }

  const { width, height } = source;

  // Soft blurred base.
  const blurredBase = createPixelBuffer(width, height);
  blurredBase.data.set(source.data);
  if (blur > 0) {
    applyBoxBlur(blurredBase, blur);
  }

  // Brighten a copy of the source so both character selection and glyph
  // colors lift with the brightness control.
  const brightened = createPixelBuffer(width, height);
  brightened.data.set(source.data);
  if (brightness !== 1) {
    for (let i = 0; i < brightened.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        brightened.data[i + c] = clampByte(brightened.data[i + c] * brightness);
      }
    }
  }

  const asciiLayer = renderAscii(brightened, {
    fontSize: cellSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 0],
    charset,
    colorMode: colorMode === "colored" ? "source" : "monochrome",
    backgroundMode: "transparent",
    antialias: true
  });

  // Boost symbol colors for the luminous "glow" read.
  if (colorBoost > 0) {
    const data = asciiLayer.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = clampByte(data[i] + colorBoost);
        data[i + 1] = clampByte(data[i + 1] + colorBoost);
        data[i + 2] = clampByte(data[i + 2] + colorBoost);
      }
    }
  }

  // Composite the symbol layer over the blurred base.
  const output = createPixelBuffer(width, height);
  for (let i = 0; i < output.data.length; i += 4) {
    output.data[i] = blurredBase.data[i];
    output.data[i + 1] = blurredBase.data[i + 1];
    output.data[i + 2] = blurredBase.data[i + 2];
    output.data[i + 3] = 255;

    const alpha = asciiLayer.data[i + 3] / 255;
    if (alpha > 0) {
      for (let c = 0; c < 3; c++) {
        output.data[i + c] = clampByte(
          asciiLayer.data[i + c] * alpha + output.data[i + c] * (1 - alpha)
        );
      }
    }
  }

  return output;
}
