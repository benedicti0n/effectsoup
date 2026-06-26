import type { PixelBuffer, RgbaColor } from "../types.js";
import { clampByte, pixelIndex } from "../buffer.js";

export function blendGlyphPixel(
  background: RgbaColor,
  glyphColor: RgbaColor,
  coverage: number
): RgbaColor {
  const alpha = (glyphColor[3] / 255) * coverage;
  const inv = 1 - alpha;
  return [
    clampByte(background[0] * inv + glyphColor[0] * alpha),
    clampByte(background[1] * inv + glyphColor[1] * alpha),
    clampByte(background[2] * inv + glyphColor[2] * alpha),
    clampByte(background[3] * inv + 255 * alpha)
  ];
}

export function averageCellChannel(
  source: PixelBuffer,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number,
  channel = 0
): number {
  let sum = 0;
  let count = 0;
  const maxX = Math.min(source.width, cellX + cellW);
  const maxY = Math.min(source.height, cellY + cellH);
  for (let y = cellY; y < maxY; y++) {
    for (let x = cellX; x < maxX; x++) {
      const idx = pixelIndex(source, x, y);
      sum += source.data[idx + channel];
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

export function luminanceFromCell(small: PixelBuffer, gx: number, gy: number): number {
  const idx = (gy * small.width + gx) * 4;
  return (
    (0.299 * small.data[idx] +
      0.587 * small.data[idx + 1] +
      0.114 * small.data[idx + 2]) /
    255
  );
}

export function colorFromCell(small: PixelBuffer, gx: number, gy: number): RgbaColor {
  const idx = (gy * small.width + gx) * 4;
  return [small.data[idx], small.data[idx + 1], small.data[idx + 2], 255];
}

export function nearestPaletteColor(color: RgbaColor, palette: RgbaColor[]): RgbaColor {
  let best = palette[0] ?? color;
  let bestDist = Infinity;
  for (const candidate of palette) {
    const dr = color[0] - candidate[0];
    const dg = color[1] - candidate[1];
    const db = color[2] - candidate[2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

export function glyphLuminance(color: RgbaColor): number {
  return (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255;
}

export function ensureMinLuminance(color: RgbaColor, minLum: number): RgbaColor {
  if (minLum <= 0) return color;
  const lum = glyphLuminance(color);
  if (lum >= minLum) return color;
  const scale = minLum / Math.max(lum, 0.001);
  return [
    clampByte(color[0] * scale),
    clampByte(color[1] * scale),
    clampByte(color[2] * scale),
    color[3]
  ];
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
