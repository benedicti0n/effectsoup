import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";

/**
 * Cubic glass effect: divides the image into square tiles and renders each
 * tile as a translucent frosted glass cube. The tile color is sampled from
 * the source, optionally shifted by a deterministic distortion offset.
 * A subtle bevel highlight and shadow are added along the tile edges.
 */
export function applyCubicGlass(
  source: PixelBuffer,
  tileSize: number,
  distortion = 0,
  frost = 0.6
): PixelBuffer {
  if (tileSize <= 1) {
    const copy = createPixelBuffer(source.width, source.height);
    copy.data.set(source.data);
    return copy;
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height);
  const frostAmount = Math.min(1, Math.max(0, frost));

  const tilesX = Math.ceil(width / tileSize);
  const tilesY = Math.ceil(height / tileSize);

  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const x0 = tx * tileSize;
      const y0 = ty * tileSize;
      const x1 = Math.min(width, x0 + tileSize);
      const y1 = Math.min(height, y0 + tileSize);

      // Sample an average color from the tile, shifted by a deterministic
      // distortion based on tile coordinates and the local luminance.
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = pixelIndex(source, x, y);
          r += source.data[idx];
          g += source.data[idx + 1];
          b += source.data[idx + 2];
          a += source.data[idx + 3];
          count++;
        }
      }
      const avg: RgbaColor = count > 0
        ? [r / count, g / count, b / count, a / count]
        : [128, 128, 128, 255];

      const luminance = (0.299 * avg[0] + 0.587 * avg[1] + 0.114 * avg[2]) / 255;
      const shiftX = Math.round(
        Math.sin(tx * 1.7 + ty * 0.9) * distortion * luminance
      );
      const shiftY = Math.round(
        Math.cos(tx * 0.9 + ty * 1.7) * distortion * luminance
      );

      // Bevel colors derived from the tile average.
      const highlight: RgbaColor = [
        clampByte(avg[0] + 40),
        clampByte(avg[1] + 40),
        clampByte(avg[2] + 40),
        255
      ];
      const shadow: RgbaColor = [
        clampByte(avg[0] - 40),
        clampByte(avg[1] - 40),
        clampByte(avg[2] - 40),
        255
      ];

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const srcX = clampByteCoord(x + shiftX, width);
          const srcY = clampByteCoord(y + shiftY, height);
          const srcIdx = pixelIndex(source, srcX, srcY);
          const outIdx = pixelIndex(output, x, y);

          const base: RgbaColor = [
            source.data[srcIdx],
            source.data[srcIdx + 1],
            source.data[srcIdx + 2],
            source.data[srcIdx + 3]
          ];

          // Frosted glass blend.
          let mixed: RgbaColor = [
            base[0] * (1 - frostAmount) + avg[0] * frostAmount,
            base[1] * (1 - frostAmount) + avg[1] * frostAmount,
            base[2] * (1 - frostAmount) + avg[2] * frostAmount,
            255
          ];

          // Bevel along tile edges.
          const edgeSize = Math.max(1, Math.round(tileSize * 0.12));
          if (x < x0 + edgeSize || y < y0 + edgeSize) {
            mixed = blend(mixed, highlight, 0.35);
          } else if (x >= x1 - edgeSize || y >= y1 - edgeSize) {
            mixed = blend(mixed, shadow, 0.35);
          }

          output.data[outIdx] = clampByte(mixed[0]);
          output.data[outIdx + 1] = clampByte(mixed[1]);
          output.data[outIdx + 2] = clampByte(mixed[2]);
          output.data[outIdx + 3] = 255;
        }
      }
    }
  }

  return output;
}

function clampByteCoord(value: number, max: number): number {
  return Math.max(0, Math.min(max - 1, value));
}

function blend(a: RgbaColor, b: RgbaColor, t: number): RgbaColor {
  const inv = 1 - t;
  return [
    a[0] * inv + b[0] * t,
    a[1] * inv + b[1] * t,
    a[2] * inv + b[2] * t,
    255
  ];
}
