import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";

export type HalftoneShape = "circle" | "square" | "diamond";

export type HalftoneColorMode = "monochrome" | "source" | "palette";

export type HalftoneOptions = {
  dotSpacing: number;
  maxDotSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  angle?: number;
  shape?: HalftoneShape;
  colorMode?: HalftoneColorMode;
  palette?: RgbaColor[];
  saturationBoost?: number;
};

function averageCellColor(
  source: PixelBuffer,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number
): RgbaColor {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  let count = 0;
  const maxX = Math.min(source.width, cellX + cellW);
  const maxY = Math.min(source.height, cellY + cellH);
  for (let y = cellY; y < maxY; y++) {
    for (let x = cellX; x < maxX; x++) {
      const idx = pixelIndex(source, x, y);
      r += source.data[idx];
      g += source.data[idx + 1];
      b += source.data[idx + 2];
      a += source.data[idx + 3];
      count++;
    }
  }
  if (count === 0) return [0, 0, 0, 255];
  return [r / count, g / count, b / count, a / count];
}

function nearestPaletteColor(color: RgbaColor, palette: RgbaColor[]): RgbaColor {
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

function boostSaturation(color: RgbaColor, amount: number): RgbaColor {
  if (amount <= 0) return color;
  const lum =
    0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
  return [
    clampByte(lum + (color[0] - lum) * (1 + amount)),
    clampByte(lum + (color[1] - lum) * (1 + amount)),
    clampByte(lum + (color[2] - lum) * (1 + amount)),
    color[3]
  ];
}

/**
 * Render a dot halftone pattern into a new buffer.
 * Bright areas produce larger dots.
 *
 * New capabilities:
 * - `colorMode: "source"` renders dots in the local cell color.
 * - `colorMode: "palette"` snaps each dot to the nearest palette color.
 * - `saturationBoost` makes dot colors more vivid.
 */
export function renderHalftoneData(
  source: PixelBuffer,
  options: HalftoneOptions
): PixelBuffer {
  const {
    dotSpacing,
    maxDotSize,
    inkColor,
    backgroundColor,
    angle = 0,
    shape = "circle",
    colorMode = "monochrome",
    palette = [],
    saturationBoost = 0
  } = options;

  if (dotSpacing <= 0 || maxDotSize <= 0) {
    throw new Error("dotSpacing and maxDotSize must be positive");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, backgroundColor);
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  for (let y = 0; y < height; y += dotSpacing) {
    for (let x = 0; x < width; x += dotSpacing) {
      // Rotate sample point around center.
      const cx = x - width / 2;
      const cy = y - height / 2;
      const rx = cx * cos - cy * sin + width / 2;
      const ry = cx * sin + cy * cos + height / 2;

      const sampleX = Math.max(0, Math.min(width - 1, Math.round(rx)));
      const sampleY = Math.max(0, Math.min(height - 1, Math.round(ry)));
      const idx = pixelIndex(source, sampleX, sampleY);

      let dotColor: RgbaColor;
      if (colorMode === "source" || colorMode === "palette") {
        const cellColor = averageCellColor(
          source,
          Math.max(0, sampleX - dotSpacing / 2),
          Math.max(0, sampleY - dotSpacing / 2),
          dotSpacing,
          dotSpacing
        );
        dotColor =
          colorMode === "palette" && palette.length > 0
            ? nearestPaletteColor(cellColor, palette)
            : boostSaturation(cellColor, saturationBoost);
      } else {
        dotColor = inkColor;
      }

      const luminance =
        (0.299 * source.data[idx] +
          0.587 * source.data[idx + 1] +
          0.114 * source.data[idx + 2]) /
        255;
      const radius = maxDotSize * (1 - luminance);

      if (radius <= 0) continue;

      drawDot(output, x, y, radius, dotColor, shape);
    }
  }

  return output;
}

function drawDot(
  buffer: PixelBuffer,
  cx: number,
  cy: number,
  radius: number,
  color: RgbaColor,
  shape: HalftoneShape
): void {
  const { width, height, data } = buffer;
  const r2 = radius * radius;
  const startY = Math.max(0, Math.floor(cy - radius));
  const endY = Math.min(height - 1, Math.ceil(cy + radius));
  const startX = Math.max(0, Math.floor(cx - radius));
  const endX = Math.min(width - 1, Math.ceil(cx + radius));

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      let inside = false;

      if (shape === "circle") {
        inside = dx * dx + dy * dy <= r2;
      } else if (shape === "square") {
        inside = Math.abs(dx) <= radius && Math.abs(dy) <= radius;
      } else if (shape === "diamond") {
        inside = Math.abs(dx) + Math.abs(dy) <= radius;
      }

      if (inside) {
        const idx = pixelIndex(buffer, x, y);
        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }
  }
}
