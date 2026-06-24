import type { PixelBuffer } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft";

/**
 * Blend two PixelBuffers of the same size into a new buffer.
 * amount controls the opacity of the top layer (0 to 1).
 */
export function blendPixelBuffers(
  bottom: PixelBuffer,
  top: PixelBuffer,
  mode: BlendMode = "normal",
  amount: number = 1
): PixelBuffer {
  if (bottom.width !== top.width || bottom.height !== top.height) {
    throw new Error("Buffers must have the same dimensions to blend");
  }
  if (amount < 0 || amount > 1) {
    throw new Error("amount must be between 0 and 1");
  }

  const output = createPixelBuffer(bottom.width, bottom.height);
  const { data: out } = output;
  const { data: a } = bottom;
  const { data: b } = top;

  for (let i = 0; i < out.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const av = a[i + c];
      const bv = b[i + c];
      let blended = av;

      if (mode === "normal") {
        blended = av + (bv - av) * amount;
      } else if (mode === "multiply") {
        blended = (av * bv) / 255;
      } else if (mode === "screen") {
        blended = 255 - ((255 - av) * (255 - bv)) / 255;
      } else if (mode === "overlay") {
        blended =
          av < 128
            ? (2 * av * bv) / 255
            : 255 - (2 * (255 - av) * (255 - bv)) / 255;
      } else if (mode === "soft") {
        const bvNorm = bv / 255;
        const avNorm = av / 255;
        const soft =
          bv < 128
            ? avNorm - (1 - 2 * bvNorm) * avNorm * (1 - avNorm)
            : avNorm +
              (2 * bvNorm - 1) *
                (Math.sqrt(avNorm) - avNorm);
        blended = soft * 255;
      }

      out[i + c] = clampByte(blended);
    }
    out[i + 3] = Math.max(a[i + 3], b[i + 3]);
  }

  return output;
}

/**
 * Apply a simple box blur in-place.
 * radius: blur radius in pixels
 */
export function applyBoxBlur(buffer: PixelBuffer, radius: number): void {
  if (radius <= 0) return;
  const { data, width, height } = buffer;
  const output = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const sx = Math.max(0, Math.min(width - 1, x + kx));
          const sy = Math.max(0, Math.min(height - 1, y + ky));
          const idx = pixelIndex(buffer, sx, sy);
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }
      const idx = pixelIndex(buffer, x, y);
      output[idx] = r / count;
      output[idx + 1] = g / count;
      output[idx + 2] = b / count;
    }
  }

  data.set(output);
}
