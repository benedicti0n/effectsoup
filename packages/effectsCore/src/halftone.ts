import type { PixelBuffer, RgbaColor } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";

export type HalftoneShape = "circle" | "square" | "diamond";

export type HalftoneOptions = {
  dotSpacing: number;
  maxDotSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  angle?: number;
  shape?: HalftoneShape;
};

/**
 * Render a dot halftone pattern into a new buffer.
 * Bright areas produce larger dots.
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
    shape = "circle"
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
      const luminance =
        (0.299 * source.data[idx] +
          0.587 * source.data[idx + 1] +
          0.114 * source.data[idx + 2]) /
        255;
      const radius = maxDotSize * (1 - luminance);

      if (radius <= 0) continue;

      drawDot(output, x, y, radius, inkColor, shape);
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
