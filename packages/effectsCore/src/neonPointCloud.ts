import type { PixelBuffer, RgbaColor } from "./types.js";
import { createPixelBuffer, pixelIndex } from "./buffer.js";
import { applyGlow } from "./glow.js";
import { createSeededRandom } from "./noise.js";
import { drawCircle, drawLine } from "./draw.js";

export type NeonPointCloudOptions = {
  threshold: number;
  density: number;
  pointSize: number;
  color: RgbaColor;
  glowRadius: number;
  connectRadius?: number;
  seed?: number;
};

type Point = { x: number; y: number; lum: number };

function sampleLuminance(source: PixelBuffer, x: number, y: number): number {
  const cx = Math.max(0, Math.min(source.width - 1, Math.round(x)));
  const cy = Math.max(0, Math.min(source.height - 1, Math.round(y)));
  const idx = pixelIndex(source, cx, cy);
  return (
    (0.299 * source.data[idx] +
      0.587 * source.data[idx + 1] +
      0.114 * source.data[idx + 2]) /
    255
  );
}

/**
 * Place deterministic bright points on the image and connect nearby points
 * with neon lines, creating a constellation / point-cloud look. The result is
 * rendered on black and can be screen-blended over the source by the preset.
 */
export function applyNeonPointCloud(
  source: PixelBuffer,
  options: NeonPointCloudOptions
): PixelBuffer {
  const {
    threshold,
    density,
    pointSize,
    color,
    glowRadius,
    connectRadius,
    seed = 42
  } = options;

  if (density < 0) {
    throw new Error("density must be non-negative");
  }

  const { width, height } = source;
  const output = createPixelBuffer(width, height, [0, 0, 0, 255]);
  const rand = createSeededRandom(seed);

  const area = width * height;
  const candidateCount = Math.max(10, Math.round(density * area / 10000));
  const points: Point[] = [];

  for (let i = 0; i < candidateCount; i++) {
    const x = Math.floor(rand() * width);
    const y = Math.floor(rand() * height);
    const lum = sampleLuminance(source, x, y);
    if (lum > threshold) {
      points.push({ x, y, lum });
    }
  }

  const radius = connectRadius ?? Math.max(10, Math.min(width, height) / 10);
  const radius2 = radius * radius;

  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const b = points[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= radius2) {
        const opacity = Math.min(a.lum, b.lum);
        drawLine(output, a.x, a.y, b.x, b.y, color, opacity);
      }
    }
    drawCircle(output, a.x, a.y, pointSize / 2, color, a.lum);
  }

  if (glowRadius > 0) {
    applyGlow(output, {
      radius: glowRadius,
      amount: 0.6,
      mode: "screen",
      color
    });
  }

  return output;
}
