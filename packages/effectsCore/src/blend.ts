import type { PixelBuffer } from "./types.js";
import { clampByte, createPixelBuffer } from "./buffer.js";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft" | "lighten";

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
      let result = av;

      if (mode === "normal") {
        result = av + (bv - av) * amount;
      } else {
        let blended: number;
        if (mode === "multiply") {
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
        } else if (mode === "lighten") {
          blended = Math.max(av, bv);
        } else {
          blended = av;
        }
        result = av + (blended - av) * amount;
      }

      out[i + c] = clampByte(result);
    }
    out[i + 3] = Math.max(a[i + 3], b[i + 3]);
  }

  return output;
}

/**
 * Apply a separable box blur in-place using prefix sums.
 * Complexity is O(pixels) independent of radius, which keeps glow/bloom
 * effects responsive on large previews.
 */
export function applyBoxBlur(buffer: PixelBuffer, radius: number): void {
  if (radius <= 0) return;
  const { data, width, height } = buffer;
  const temp = new Uint8ClampedArray(data.length);

  // Horizontal pass.
  for (let y = 0; y < height; y++) {
    // Build prefix sums for this row (3 channels).
    const rowOffset = y * width * 4;
    const pr = new Uint32Array(width + 1);
    const pg = new Uint32Array(width + 1);
    const pb = new Uint32Array(width + 1);
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + x * 4;
      pr[x + 1] = pr[x] + data[idx];
      pg[x + 1] = pg[x] + data[idx + 1];
      pb[x + 1] = pb[x] + data[idx + 2];
    }

    for (let x = 0; x < width; x++) {
      const lo = Math.max(0, x - radius);
      const hi = Math.min(width - 1, x + radius);
      const count = hi - lo + 1;
      const idx = rowOffset + x * 4;
      temp[idx] = (pr[hi + 1] - pr[lo]) / count;
      temp[idx + 1] = (pg[hi + 1] - pg[lo]) / count;
      temp[idx + 2] = (pb[hi + 1] - pb[lo]) / count;
      temp[idx + 3] = data[idx + 3];
    }
  }

  // Vertical pass.
  for (let x = 0; x < width; x++) {
    // Build prefix sums for this column (3 channels) from temp.
    const pr = new Uint32Array(height + 1);
    const pg = new Uint32Array(height + 1);
    const pb = new Uint32Array(height + 1);
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      pr[y + 1] = pr[y] + temp[idx];
      pg[y + 1] = pg[y] + temp[idx + 1];
      pb[y + 1] = pb[y] + temp[idx + 2];
    }

    for (let y = 0; y < height; y++) {
      const lo = Math.max(0, y - radius);
      const hi = Math.min(height - 1, y + radius);
      const count = hi - lo + 1;
      const idx = (y * width + x) * 4;
      data[idx] = (pr[hi + 1] - pr[lo]) / count;
      data[idx + 1] = (pg[hi + 1] - pg[lo]) / count;
      data[idx + 2] = (pb[hi + 1] - pb[lo]) / count;
    }
  }
}
