import type { PixelBuffer, RgbaColor } from "./types.js";

export type GridOverlayStyle = "darken" | "lighten" | "color";

export type GridOverlayOptions = {
  cellSize: number;
  opacity: number;
  style?: GridOverlayStyle;
  color?: RgbaColor;
  lineWidth?: number;
};

/**
 * Apply a grid line overlay to a buffer in-place.
 * Opacity 0 leaves the buffer unchanged; opacity 1 replaces each grid line
 * with the chosen color.
 */
export function applyGridOverlay(
  buffer: PixelBuffer,
  options: GridOverlayOptions
): void {
  const {
    cellSize,
    opacity,
    style = "darken",
    color = [0, 0, 0, 255],
    lineWidth = 1
  } = options;

  if (cellSize <= 0 || opacity <= 0) return;
  if (opacity > 1) {
    throw new Error("opacity must be between 0 and 1");
  }

  const { width, height, data } = buffer;
  const inv = 1 - opacity;

  for (let ly = 0; ly < lineWidth; ly++) {
    for (let y = ly; y < height; y += cellSize) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (style === "darken") {
          data[idx] *= inv;
          data[idx + 1] *= inv;
          data[idx + 2] *= inv;
        } else if (style === "lighten") {
          data[idx] = data[idx] * inv + 255 * opacity;
          data[idx + 1] = data[idx + 1] * inv + 255 * opacity;
          data[idx + 2] = data[idx + 2] * inv + 255 * opacity;
        } else {
          data[idx] = data[idx] * inv + color[0] * opacity;
          data[idx + 1] = data[idx + 1] * inv + color[1] * opacity;
          data[idx + 2] = data[idx + 2] * inv + color[2] * opacity;
        }
      }
    }
  }

  for (let lx = 0; lx < lineWidth; lx++) {
    for (let x = lx; x < width; x += cellSize) {
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        if (style === "darken") {
          data[idx] *= inv;
          data[idx + 1] *= inv;
          data[idx + 2] *= inv;
        } else if (style === "lighten") {
          data[idx] = data[idx] * inv + 255 * opacity;
          data[idx + 1] = data[idx + 1] * inv + 255 * opacity;
          data[idx + 2] = data[idx + 2] * inv + 255 * opacity;
        } else {
          data[idx] = data[idx] * inv + color[0] * opacity;
          data[idx + 1] = data[idx + 1] * inv + color[1] * opacity;
          data[idx + 2] = data[idx + 2] * inv + color[2] * opacity;
        }
      }
    }
  }
}
