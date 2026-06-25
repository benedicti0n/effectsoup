import type { PixelBuffer, RgbaColor } from "./types.js";
import { clampByte, createPixelBuffer, pixelIndex } from "./buffer.js";
import { resizeBilinear } from "./resize.js";
import { applyBoxBlur } from "./blend.js";
import { applyBloom } from "./glow.js";

/**
 * 5x7 bitmap font for ASCII rendering without DOM APIs.
 * Each character is an array of 7 rows, 5 bits per row.
 */
const BITMAP_FONT: Record<string, number[]> = {
  " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  ".": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b01100],
  ":": [0b00000, 0b01100, 0b01100, 0b00000, 0b01100, 0b01100, 0b00000],
  ",": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b00100],
  ";": [0b00000, 0b01100, 0b01100, 0b00000, 0b01100, 0b00100, 0b01000],
  "!": [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
  "?": [0b11110, 0b10001, 0b00001, 0b00110, 0b00100, 0b00000, 0b00100],
  "-": [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
  "+": [0b00000, 0b00100, 0b00100, 0b11111, 0b00100, 0b00100, 0b00000],
  "=": [0b00000, 0b00000, 0b11111, 0b00000, 0b11111, 0b00000, 0b00000],
  "*": [0b00000, 0b00100, 0b10101, 0b01110, 0b10101, 0b00100, 0b00000],
  "/": [0b00001, 0b00010, 0b00010, 0b00100, 0b01000, 0b01000, 0b10000],
  "\\": [0b10000, 0b01000, 0b01000, 0b00100, 0b00010, 0b00010, 0b00001],
  "_": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b11111],
  "'": [0b00100, 0b00100, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  "\"": [0b01010, 0b01010, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
  "#": [0b01010, 0b01010, 0b11111, 0b01010, 0b11111, 0b01010, 0b01010],
  "$": [0b00100, 0b01111, 0b10100, 0b01110, 0b00101, 0b11110, 0b00100],
  "%": [0b10001, 0b10010, 0b00010, 0b00100, 0b01000, 0b01001, 0b10001],
  "&": [0b01100, 0b10010, 0b10010, 0b01100, 0b10010, 0b10001, 0b01110],
  "@": [0b01110, 0b10001, 0b10111, 0b10101, 0b10111, 0b10000, 0b01110],
  "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  "2": [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  "3": [0b11111, 0b00001, 0b00010, 0b00110, 0b00001, 0b10001, 0b01110],
  "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  "6": [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10011, 0b10001, 0b10001, 0b01110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00001, 0b00001, 0b00001, 0b00001, 0b10001, 0b10001, 0b01110],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  "█": [0b11111, 0b11111, 0b11111, 0b11111, 0b11111, 0b11111, 0b11111],
  "▓": [0b10101, 0b01010, 0b10101, 0b01010, 0b10101, 0b01010, 0b10101],
  "▒": [0b10101, 0b00000, 0b01010, 0b00000, 0b10101, 0b00000, 0b01010],
  "░": [0b10001, 0b00000, 0b00100, 0b00000, 0b10001, 0b00000, 0b00100],
  "·": [0b00000, 0b00000, 0b00000, 0b00100, 0b00000, 0b00000, 0b00000],
  "•": [0b00000, 0b00000, 0b00100, 0b01110, 0b00100, 0b00000, 0b00000],
  "∞": [0b00000, 0b01010, 0b10101, 0b10101, 0b10101, 0b01010, 0b00000],
  "∑": [0b11111, 0b01000, 0b00100, 0b00100, 0b01000, 0b01000, 0b11111],
  "√": [0b00011, 0b00100, 0b00100, 0b01000, 0b01000, 0b10000, 0b10000]
};

export const ASCII_CHARSET_PRESETS: Record<string, string> = {
  dense: `$@B%8&WM#*oahkbdpqwmZ0OQLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\` . `,
  standard: "@%#*+=-:. ",
  technical: "01/\\|<>[]{}?=-_+~",
  blocks: "█▓▒░ ",
  minimal: " #.",
  bloom: " .:-=+*#%@"
};

/**
 * Validate and normalize a user-provided custom character set.
 * Requires at least two non-whitespace characters. Preserves order.
 * Falls back to the dense preset on invalid input.
 */
export function normalizeCustomCharset(input: string, fallback = ASCII_CHARSET_PRESETS.dense): string {
  const trimmed = input.replace(/\s/g, "");
  if (trimmed.length < 2) return fallback;
  const cleaned = input.replace(/^\s+|\s+$/g, "");
  if (cleaned.length < 2) return fallback;
  return cleaned;
}

const DEFAULT_CHARSET = ASCII_CHARSET_PRESETS.dense;

export type AsciiColorMode = "monochrome" | "color" | "source";
export type AsciiBackgroundMode = "solid" | "source" | "transparent";

export type AsciiOptions = {
  fontSize: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  charset?: string;
  colorMode?: AsciiColorMode;
  backgroundMode?: AsciiBackgroundMode;
  spacing?: number;
  palette?: RgbaColor[];
  invertLuminance?: boolean;
  antialias?: boolean;
  /** Optional single-channel weight map (same size as source). Values 0..255 scale glyph coverage per cell. */
  densityMap?: PixelBuffer;
  /** Minimum normalized luminance (0..1) for source/color glyphs. Dark colors are lifted to this floor. */
  minGlyphLuminance?: number;
};

function resolveGlyphBitmap(char: string): number[] {
  return (
    BITMAP_FONT[char] ??
    BITMAP_FONT[char.toUpperCase()] ??
    BITMAP_FONT[char.toLowerCase()] ??
    BITMAP_FONT[" "]
  );
}

function blendGlyphPixel(
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

function averageCellChannel(
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

function luminanceFromCell(small: PixelBuffer, gx: number, gy: number): number {
  const idx = (gy * small.width + gx) * 4;
  return (
    (0.299 * small.data[idx] +
      0.587 * small.data[idx + 1] +
      0.114 * small.data[idx + 2]) /
    255
  );
}

function colorFromCell(small: PixelBuffer, gx: number, gy: number): RgbaColor {
  const idx = (gy * small.width + gx) * 4;
  return [small.data[idx], small.data[idx + 1], small.data[idx + 2], 255];
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

function glyphLuminance(color: RgbaColor): number {
  return (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255;
}

function ensureMinLuminance(color: RgbaColor, minLum: number): RgbaColor {
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

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Compute a grayscale luminance buffer at source dimensions.
 */
export function computeLuminanceBuffer(source: PixelBuffer): PixelBuffer {
  const { width, height } = source;
  const output = createPixelBuffer(width, height);
  for (let i = 0; i < source.data.length; i += 4) {
    const lum = clampByte(
      0.299 * source.data[i] + 0.587 * source.data[i + 1] + 0.114 * source.data[i + 2]
    );
    output.data[i] = lum;
    output.data[i + 1] = lum;
    output.data[i + 2] = lum;
    output.data[i + 3] = 255;
  }
  return output;
}

/**
 * Compute a grayscale Sobel-gradient-magnitude buffer at source dimensions.
 */
export function computeGradientMagnitudeBuffer(source: PixelBuffer): PixelBuffer {
  const gray = computeLuminanceBuffer(source);
  const { width, height } = gray;
  const output = createPixelBuffer(width, height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = pixelIndex(gray, x, y);
      const gx =
        -1 * gray.data[pixelIndex(gray, x - 1, y - 1)] +
        -2 * gray.data[pixelIndex(gray, x - 1, y)] +
        -1 * gray.data[pixelIndex(gray, x - 1, y + 1)] +
        1 * gray.data[pixelIndex(gray, x + 1, y - 1)] +
        2 * gray.data[pixelIndex(gray, x + 1, y)] +
        1 * gray.data[pixelIndex(gray, x + 1, y + 1)];
      const gy =
        -1 * gray.data[pixelIndex(gray, x - 1, y - 1)] +
        -2 * gray.data[pixelIndex(gray, x, y - 1)] +
        -1 * gray.data[pixelIndex(gray, x + 1, y - 1)] +
        1 * gray.data[pixelIndex(gray, x - 1, y + 1)] +
        2 * gray.data[pixelIndex(gray, x, y + 1)] +
        1 * gray.data[pixelIndex(gray, x + 1, y + 1)];
      const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy) / 4);
      output.data[idx] = magnitude;
      output.data[idx + 1] = magnitude;
      output.data[idx + 2] = magnitude;
      output.data[idx + 3] = 255;
    }
  }
  return output;
}

/**
 * Compute a highlight mask for symbol effects.
 * Bright areas and strong edges pass through; midtones and dark/flat regions fall to zero.
 */
export function computeHighlightMask(
  source: PixelBuffer,
  threshold: number,
  falloff: number,
  edgeStrength = 0.5
): PixelBuffer {
  const luminance = computeLuminanceBuffer(source);
  const gradient = computeGradientMagnitudeBuffer(source);
  const { width, height } = source;
  const output = createPixelBuffer(width, height);

  for (let i = 0; i < output.data.length; i += 4) {
    const lum = luminance.data[i] / 255;
    const edge = gradient.data[i] / 255;
    const highlight = smoothstep(threshold, Math.min(1, threshold + falloff), lum);
    const value = Math.max(highlight, edge * edgeStrength);
    const v = clampByte(value * 255);
    output.data[i] = v;
    output.data[i + 1] = v;
    output.data[i + 2] = v;
    output.data[i + 3] = 255;
  }
  return output;
}

export type AsciiWeightMapOptions = {
  highlightThreshold: number;
  shadowThreshold: number;
  edgeStrength: number;
  shadowStrength: number;
};

/**
 * Compute a sparse weight map for minimal/edge-aware ASCII placement.
 * Highlights, dark details, and edges all contribute; flat midtone backgrounds remain empty.
 */
export function computeAsciiWeightMap(
  source: PixelBuffer,
  options: AsciiWeightMapOptions
): PixelBuffer {
  const { highlightThreshold, shadowThreshold, edgeStrength, shadowStrength } = options;
  const luminance = computeLuminanceBuffer(source);
  const gradient = computeGradientMagnitudeBuffer(source);
  const { width, height } = source;
  const output = createPixelBuffer(width, height);

  for (let i = 0; i < output.data.length; i += 4) {
    const lum = luminance.data[i] / 255;
    const edge = gradient.data[i] / 255;
    const highlight = smoothstep(highlightThreshold, 1, lum);
    const shadow = lum < shadowThreshold ? (shadowThreshold - lum) / shadowThreshold : 0;
    const value = Math.max(highlight, shadow * shadowStrength, edge * edgeStrength);
    const v = clampByte(value * 255);
    output.data[i] = v;
    output.data[i + 1] = v;
    output.data[i + 2] = v;
    output.data[i + 3] = 255;
  }
  return output;
}

/**
 * Render ASCII art from a source buffer.
 * Returns a new PixelBuffer at the source dimensions.
 *
 * Improvements:
 * - 5x7 bitmap font with supersampled antialiasing.
 * - Cell height matched to glyph aspect ratio (7:5) so glyphs are not stretched.
 * - Color mode samples the local cell color from a downsampled source.
 * - Optional solid/source/transparent background modes.
 * - Optional per-cell density map for masked/sparse placement.
 */
export function renderAscii(
  source: PixelBuffer,
  options: AsciiOptions
): PixelBuffer {
  const {
    fontSize,
    inkColor,
    backgroundColor,
    charset = DEFAULT_CHARSET,
    colorMode = "monochrome",
    backgroundMode = "solid",
    spacing = 0,
    palette,
    invertLuminance = false,
    antialias = true,
    densityMap,
    minGlyphLuminance = 0
  } = options;

  if (fontSize <= 0) {
    throw new Error("fontSize must be positive");
  }
  if (charset.length === 0) {
    throw new Error("charset must not be empty");
  }

  const { width, height } = source;
  const output =
    backgroundMode === "source"
      ? createPixelBuffer(width, height, [0, 0, 0, 0])
      : createPixelBuffer(width, height, backgroundColor);

  if (backgroundMode === "source") {
    output.data.set(source.data);
  }

  const cellWidth = Math.max(1, fontSize);
  const cellHeight = Math.max(1, Math.round((fontSize * 7) / 5));
  const cols = Math.max(1, Math.floor(width / cellWidth));
  const rows = Math.max(1, Math.floor(height / cellHeight));

  const small = resizeBilinear(source, cols, rows);

  const glyphW = 5;
  const glyphH = 7;
  const sampleCount = antialias ? 4 : 1;
  const sampleStep = 1 / sampleCount;

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      let luminance = luminanceFromCell(small, gx, gy);
      if (invertLuminance) {
        luminance = 1 - luminance;
      }
      const charIndex = Math.max(
        0,
        Math.min(charset.length - 1, Math.floor(luminance * (charset.length - 1)))
      );
      const char = charset[charIndex];
      const bitmap = resolveGlyphBitmap(char);

      const cellX = Math.floor(gx * cellWidth);
      const cellY = Math.floor(gy * cellHeight);
      const cellRight = Math.min(width, cellX + cellWidth);
      const cellBottom = Math.min(height, cellY + cellHeight);

      let glyphColor = inkColor;
      if (colorMode === "source" || colorMode === "color") {
        let avg = colorFromCell(small, gx, gy);
        if (palette && palette.length > 0) {
          avg = nearestPaletteColor(avg, palette);
        }
        if (colorMode === "source") {
          glyphColor = avg;
        } else {
          const mix = 0.7;
          glyphColor = [
            clampByte(inkColor[0] * (1 - mix) + avg[0] * mix),
            clampByte(inkColor[1] * (1 - mix) + avg[1] * mix),
            clampByte(inkColor[2] * (1 - mix) + avg[2] * mix),
            255
          ];
        }
      }

      if (minGlyphLuminance > 0 && (colorMode === "source" || colorMode === "color")) {
        glyphColor = ensureMinLuminance(glyphColor, minGlyphLuminance);
      }

      let cellDensity = 1;
      if (densityMap) {
        cellDensity = averageCellChannel(densityMap, cellX, cellY, cellWidth, cellHeight) / 255;
        if (cellDensity <= 0) continue;
      }

      const innerX0 = cellX + spacing;
      const innerY0 = cellY + spacing;
      const innerX1 = Math.max(innerX0, cellRight - spacing);
      const innerY1 = Math.max(innerY0, cellBottom - spacing);
      if (innerX0 >= innerX1 || innerY0 >= innerY1) continue;

      const innerW = innerX1 - innerX0;
      const innerH = innerY1 - innerY0;

      for (let py = innerY0; py < innerY1; py++) {
        for (let px = innerX0; px < innerX1; px++) {
          if (px < 0 || px >= width || py < 0 || py >= height) continue;

          const u = ((px - innerX0 + 0.5) / innerW) * glyphW;
          const v = ((py - innerY0 + 0.5) / innerH) * glyphH;

          let coverage = 0;
          if (antialias) {
            for (let sy = 0; sy < sampleCount; sy++) {
              for (let sx = 0; sx < sampleCount; sx++) {
                const gu = u + (sx + 0.5) * sampleStep - 0.5;
                const gv = v + (sy + 0.5) * sampleStep - 0.5;
                const col = Math.floor(gu);
                const row = Math.floor(gv);
                if (row >= 0 && row < glyphH && col >= 0 && col < glyphW) {
                  const rowBits = bitmap[row] ?? 0;
                  if ((rowBits >> (4 - col)) & 1) {
                    coverage++;
                  }
                }
              }
            }
            coverage /= sampleCount * sampleCount;
          } else {
            const col = Math.floor(u);
            const row = Math.floor(v);
            if (row >= 0 && row < glyphH && col >= 0 && col < glyphW) {
              const rowBits = bitmap[row] ?? 0;
              coverage = (rowBits >> (4 - col)) & 1 ? 1 : 0;
            }
          }

          if (coverage <= 0) continue;
          coverage *= cellDensity;
          if (coverage <= 0) continue;

          const outIdx = pixelIndex(output, px, py);
          const bg: RgbaColor =
            backgroundMode === "source"
              ? [
                  output.data[outIdx],
                  output.data[outIdx + 1],
                  output.data[outIdx + 2],
                  output.data[outIdx + 3]
                ]
              : [
                  backgroundColor[0],
                  backgroundColor[1],
                  backgroundColor[2],
                  backgroundColor[3]
                ];
          const blended = blendGlyphPixel(bg, glyphColor, coverage);
          output.data[outIdx] = blended[0];
          output.data[outIdx + 1] = blended[1];
          output.data[outIdx + 2] = blended[2];
          output.data[outIdx + 3] = blended[3];
        }
      }
    }
  }

  return output;
}

export type SymbolGlowOptions = {
  fontSize: number;
  symbolSet: string;
  baseBlur: number;
  glowRadius: number;
  glowAmount: number;
  threshold: number;
  falloff: number;
  edgeStrength?: number;
  colorMode: "monochrome" | "colored";
  antialias?: boolean;
};

/**
 * Symbol Glow effect:
 * 1. Blur the source image for a soft, image-like base.
 * 2. Build a highlight+edge mask and render symbols only where the mask passes.
 * 3. Render a matching glow layer, blur it, and composite it over the base.
 * 4. Composite the crisp symbol layer on top.
 */
export function renderSymbolGlow(
  source: PixelBuffer,
  options: SymbolGlowOptions
): PixelBuffer {
  const {
    fontSize,
    symbolSet,
    baseBlur,
    glowRadius,
    glowAmount,
    threshold,
    falloff,
    edgeStrength = 0.5,
    colorMode,
    antialias = true
  } = options;

  const symbols = symbolSet.length > 0 ? symbolSet : "2*+/=e";
  const { width, height } = source;

  const blurredBase: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(source.data)
  };
  applyBoxBlur(blurredBase, Math.max(0, baseBlur));

  const mask = computeHighlightMask(source, threshold, falloff, edgeStrength);

  const symbolLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 0],
    charset: symbols,
    colorMode: colorMode === "colored" ? "source" : "monochrome",
    backgroundMode: "transparent",
    densityMap: mask,
    antialias
  });

  const glowLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 255],
    charset: symbols,
    colorMode: colorMode === "colored" ? "source" : "monochrome",
    backgroundMode: "solid",
    densityMap: mask,
    antialias
  });

  if (glowRadius > 0 && glowAmount > 0) {
    applyBloom(glowLayer, {
      radius: glowRadius,
      threshold: 0.3,
      amount: glowAmount * 0.6
    });
  }

  const output = createPixelBuffer(width, height);
  for (let i = 0; i < output.data.length; i += 4) {
    // Start with the blurred base image.
    for (let c = 0; c < 3; c++) {
      output.data[i + c] = blurredBase.data[i + c];
    }

    // Add localized glow using a screen blend (background stays black where no glow).
    if (glowAmount > 0) {
      for (let c = 0; c < 3; c++) {
        const glow = glowLayer.data[i + c];
        output.data[i + c] = clampByte(
          255 - ((255 - output.data[i + c]) * (255 - glow)) / 255
        );
      }
    }

    // Composite crisp symbols on top.
    const alpha = symbolLayer.data[i + 3] / 255;
    if (alpha > 0) {
      for (let c = 0; c < 3; c++) {
        output.data[i + c] = clampByte(
          symbolLayer.data[i + c] * alpha + output.data[i + c] * (1 - alpha)
        );
      }
    }

    output.data[i + 3] = 255;
  }

  return output;
}

export type LuminousAsciiBloomOptions = {
  fontSize: number;
  density: number;
  bloomRadius: number;
  glowAmount: number;
  baseOpacity?: number;
  minGlyphLuminance?: number;
};

/**
 * Luminous ASCII Bloom effect:
 * 1. Dim the source image to a subtle support layer.
 * 2. Render source-colored ASCII glyphs on a transparent layer.
 * 3. Derive a bloom pass from the bright glyphs and blur it.
 * 4. Composite base + bloom + crisp glyphs on top.
 */
export function renderLuminousAsciiBloom(
  source: PixelBuffer,
  options: LuminousAsciiBloomOptions
): PixelBuffer {
  const {
    fontSize,
    density,
    bloomRadius,
    glowAmount,
    baseOpacity = 0.2,
    minGlyphLuminance = 0.2
  } = options;

  const { width, height } = source;
  const fullCharset = " .:-=+*#%@";
  const charset = fullCharset.slice(0, Math.max(2, Math.min(fullCharset.length, density)));

  const base: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(source.data)
  };
  for (let i = 0; i < base.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      base.data[i + c] = clampByte(base.data[i + c] * baseOpacity);
    }
  }

  const glyphLayer = renderAscii(source, {
    fontSize,
    inkColor: [255, 255, 255, 255],
    backgroundColor: [0, 0, 0, 0],
    charset,
    colorMode: "source",
    backgroundMode: "transparent",
    minGlyphLuminance
  });

  const glowLayer: PixelBuffer = {
    width,
    height,
    data: new Uint8ClampedArray(glyphLayer.data)
  };
  if (glowAmount > 0 && bloomRadius > 0) {
    applyBloom(glowLayer, {
      radius: bloomRadius,
      threshold: 0.35,
      amount: glowAmount * 0.6
    });
  }

  const output = createPixelBuffer(width, height);
  for (let i = 0; i < output.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = base.data[i + c];
      // Screen in the bloom.
      const glow = glowLayer.data[i + c];
      value = clampByte(255 - ((255 - value) * (255 - glow)) / 255);
      // Composite crisp glyphs on top.
      const alpha = glyphLayer.data[i + 3] / 255;
      value = clampByte(glyphLayer.data[i + c] * alpha + value * (1 - alpha));
      output.data[i + c] = value;
    }
    output.data[i + 3] = 255;
  }

  return output;
}
