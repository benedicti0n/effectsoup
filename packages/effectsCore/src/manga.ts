import type { PixelBuffer, RgbaColor } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";

export type MangaScreenOptions = {
  lineSpacing: number;
  lineWidth: number;
  angle?: number;
  threshold?: number;
  inkColor?: RgbaColor;
  paperColor?: RgbaColor;
};

/**
 * Render a manga-style screen-tone line pattern. Dark source areas produce
 * solid ink lines; light areas stay paper. The angle rotates the screen.
 */
export function applyMangaScreen(
  source: PixelBuffer,
  options: MangaScreenOptions
): PixelBuffer {
  const {
    lineSpacing,
    lineWidth,
    angle = 0,
    threshold = 128,
    inkColor = [0, 0, 0, 255],
    paperColor = [255, 255, 255, 255]
  } = options;

  if (lineSpacing <= 0 || lineWidth <= 0) {
    throw new Error("lineSpacing and lineWidth must be positive");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, paperColor);
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const rx = dx * cos - dy * sin + cx;
      const ry = dx * sin + dy * cos + cy;

      const lineIndex = Math.floor(ry / lineSpacing);
      const withinLine = ry - lineIndex * lineSpacing < lineWidth;
      if (!withinLine) continue;

      const sx = Math.max(0, Math.min(width - 1, Math.round(rx)));
      const sy = Math.max(0, Math.min(height - 1, Math.round(ry)));
      const idx = pixelIndex(source, sx, sy);
      const lum =
        0.299 * source.data[idx] +
        0.587 * source.data[idx + 1] +
        0.114 * source.data[idx + 2];

      if (lum < threshold) {
        const outIdx = pixelIndex(output, x, y);
        output.data[outIdx] = inkColor[0];
        output.data[outIdx + 1] = inkColor[1];
        output.data[outIdx + 2] = inkColor[2];
        output.data[outIdx + 3] = 255;
      }
    }
  }

  return output;
}
