# `@effectsoup/core`

Pure TypeScript image-processing primitives. No DOM dependencies — safe in browsers and Node.js.

**Exports:** 39 functions, 22 types

## PixelBuffer

The fundamental image currency. Every function reads or writes a `PixelBuffer`.

```typescript
type PixelBuffer = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};
```

### Related types

```typescript
type RgbaColor = [number, number, number, number];
// RGBA color tuple. Components are 0–255. Alpha is typically 255 for opaque colors.

type SupportedInputFormat = "image/jpeg" | "image/png" | "image/webp";

type CropConfig = {
  aspectRatio: "original" | "free" | "1:1" | "4:5" | "9:16" | "16:9";
  zoom: number;
  offsetX: number;
  offsetY: number;
};

type OutputOptions = {
  format: "png" | "jpeg" | "webp";
  width: number;
  height: number;
  backgroundColor?: string;
  quality?: number;
};
```

## Buffer Utilities

```typescript
function createPixelBuffer(width: number, height: number, fill?: RgbaColor): PixelBuffer
```
Create a new zero-initialized PixelBuffer. Optionally fill with a color.

```typescript
function clonePixelBuffer(buffer: PixelBuffer): PixelBuffer
```
Deep-copy a PixelBuffer (new data array, same dimensions).

```typescript
function fillPixelBuffer(buffer: PixelBuffer, color: RgbaColor): void
```
Fill an existing buffer with a solid color in-place.

```typescript
function pixelIndex(buffer: PixelBuffer, x: number, y: number): number
```
Get the data array index for pixel (x, y).

```typescript
function clampByte(value: number): number
```
Clamp a number to 0–255, rounding. Returns 0 for NaN/Infinity.

## Color Transforms

All color functions modify the buffer **in-place** unless noted.

```typescript
function toGrayscale(buffer: PixelBuffer): void
```
Convert to grayscale using luminance weights (0.299 R, 0.587 G, 0.114 B).

```typescript
function adjustBrightnessContrast(buffer: PixelBuffer, brightness: number, contrast: number): void
```
Adjust brightness (-255 to 255) and contrast (-1 to 1).

```typescript
function adjustSaturation(buffer: PixelBuffer, saturation: number): void
```
Adjust saturation (-1 to 1).

```typescript
function applyDuotone(buffer: PixelBuffer, shadow: RgbaColor, highlight: RgbaColor): void
```
Map luminance to a gradient between two colors.

```typescript
function applyPosterize(buffer: PixelBuffer, levels: number): void
```
Reduce per-channel levels (2–256).

```typescript
function reducePalette(buffer: PixelBuffer, colorCount: number): void
```
Uniform per-channel quantization. colorCount 2–256. Actual output colors ≈ round(cbrt(colorCount))³.

```typescript
function applyTint(buffer: PixelBuffer, tint: RgbaColor, amount: number): void
```
Blend each pixel toward a tint color. amount ranges 0–1.

```typescript
function averageColor(buffer: PixelBuffer): RgbaColor
```
Compute the average RGBA color of a buffer.

## Viewport Transform

```typescript
function applyViewportTransform(
  source: PixelBuffer,
  viewport: CropConfig,
  outputWidth: number,
  outputHeight: number
): PixelBuffer
```
Apply a non-destructive crop/zoom/offset to a source buffer. Returns a new buffer with bilinear interpolation.

```typescript
function getCroppedOutputSize(
  sourceWidth: number,
  sourceHeight: number,
  aspectRatio: CropConfig["aspectRatio"],
  longestEdge: number,
  zoom?: number
): { width: number; height: number }
```
Compute output dimensions for a given aspect ratio and longest-edge constraint.

```typescript
function parseAspectRatio(ratio: CropConfig["aspectRatio"]): number | null
```
Parse a CropConfig aspect ratio to a numeric W/H value. Returns null for "original".

## Dithering

```typescript
function applyOrderedDither(buffer: PixelBuffer, threshold?: number): void
```
Apply 8×8 Bayer ordered dither in-place. Default threshold: 128.

```typescript
function applyFloydSteinbergDither(buffer: PixelBuffer, threshold?: number): void
```
Apply Floyd-Steinberg error diffusion dither in-place. Default threshold: 128.

```typescript
function applyFloydSteinbergColorDither(
  buffer: PixelBuffer,
  threshold?: number,
  channels?: readonly number[]
): void
```
Apply Floyd-Steinberg error diffusion on per-channel basis. Default channels: `[0, 1, 2]`. Default threshold: 128.

```typescript
type OrderedColorDitherOptions = {
  cellSize: number;
  threshold: number;
  invert: boolean;
  monochrome: boolean;
  coloredInactive?: boolean;
};

function applyOrderedColorDither(
  source: PixelBuffer,
  options: OrderedColorDitherOptions
): PixelBuffer
```
Cell-based ordered color dither with Bayer luminance offsets. Returns a new buffer.

## Halftone

```typescript
type HalftoneShape = "circle" | "square" | "diamond";
type HalftoneColorMode = "monochrome" | "source" | "palette";

type HalftoneOptions = {
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

function renderHalftoneData(source: PixelBuffer, options: HalftoneOptions): PixelBuffer
```
Render a colored dot halftone with configurable dot spacing, size, shape, palette, and color mode.

## ASCII Rendering

```typescript
type AsciiColorMode = "monochrome" | "color" | "source";
type AsciiBackgroundMode = "solid" | "source" | "transparent";

type AsciiOptions = {
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
  densityMap?: PixelBuffer;
  minGlyphLuminance?: number;
};

function renderAscii(source: PixelBuffer, options: AsciiOptions): PixelBuffer
```
Render an image as ASCII art with configurable charset, font size, color mode, ink color, and background.

```typescript
const ASCII_CHARSET_PRESETS: Record<string, string>
```
Built-in character set presets: `dense`, `standard`, `technical`, `blocks`, `minimal`, `bloom`.

```typescript
function normalizeCustomCharset(input: string, fallback?: string): string
```
Validate and normalize a custom character set for ASCII rendering.

### ASCII sub-effects

```typescript
type SymbolGlowOptions = {
  cellSize: number;
  blur: number;
  brightness: number;
  charset: string;
  colorBoost?: number;
  colorMode?: "colored" | "monochrome";
};

function renderSymbolGlow(source: PixelBuffer, options: SymbolGlowOptions): PixelBuffer

type LuminousAsciiBloomOptions = {
  fontSize: number;
  density: number;
  bloomRadius: number;
  glowAmount: number;
  baseOpacity?: number;
  minGlyphLuminance?: number;
  customCharset?: string;
};

function renderLuminousAsciiBloom(
  source: PixelBuffer,
  options: LuminousAsciiBloomOptions
): PixelBuffer

type AsciiWeightMapOptions = {
  highlightThreshold: number;
  shadowThreshold: number;
  edgeStrength: number;
  shadowStrength: number;
};

function computeAsciiWeightMap(source: PixelBuffer, options: AsciiWeightMapOptions): PixelBuffer
function computeLuminanceBuffer(source: PixelBuffer): PixelBuffer
function computeGradientMagnitudeBuffer(source: PixelBuffer): PixelBuffer
function computeHighlightMask(source: PixelBuffer, threshold: number, falloff: number, edgeStrength?: number): PixelBuffer
```
Default edgeStrength: 0.5.

## Glow & Bloom

```typescript
type GlowOptions = {
  radius: number;
  amount: number;
  mode?: "screen" | "add" | "soft";
  color?: RgbaColor;
};

function applyGlow(buffer: PixelBuffer, options: GlowOptions): void

type BloomOptions = {
  radius: number;
  threshold: number;
  amount: number;
  color?: RgbaColor;
};

function applyBloom(buffer: PixelBuffer, options: BloomOptions): void

type HeadroomBloomOptions = {
  amount: number;
};

function applyHeadroomBloom(
  base: PixelBuffer,
  bloom: PixelBuffer,
  options: HeadroomBloomOptions
): PixelBuffer
```
Additive screen composite that preserves headroom — only lifts channels below 255.

```typescript
type HighlightMaskOptions = {
  threshold?: number;
  knee?: number;
  intensity?: number;
  floor?: number;
};

function extractHighlightMask(source: PixelBuffer, options?: HighlightMaskOptions): PixelBuffer
```
Extract a luminance-keyed highlight mask with configurable threshold and knee width.

```typescript
function applyBoxBlur(buffer: PixelBuffer, radius: number): void
```
Apply a box blur in-place.

```typescript
function invertColor(r: number, g: number, b: number): [number, number, number]
function applyBlueCyanGrade(r: number, g: number, b: number, intensity: number): [number, number, number]
```
Utility color functions for glow effects.

## Halftone (Print Effects)

```typescript
function renderHalftoneData(source: PixelBuffer, options: HalftoneOptions): PixelBuffer
```
(See Halftone section above for options type.)

## Stipple

```typescript
type StippleOptions = {
  dotSize: number;
  spacing: number;
  density: number;
  inkColor: RgbaColor;
  backgroundColor: RgbaColor;
  seed?: number;
};

function renderStipple(source: PixelBuffer, options: StippleOptions): PixelBuffer
```
Render a hand-drawn stipple illustration using dot density to model tone.

## Distortion & Glass

```typescript
function applyCubicGlass(
  source: PixelBuffer,
  tileSize: number,
  distortion?: number,
  frost?: number
): PixelBuffer
```
Apply a faceted glass distortion effect with refraction-like offsets. Defaults: distortion=0, frost=0.6.

```typescript
type CrtGlitchOptions = {
  sliceHeight: number;
  shiftAmount: number;
  rgbShift: number;
  scanlineStrength: number;
  noiseAmount: number;
  seed?: number;
};

function applyCrtGlitch(source: PixelBuffer, options: CrtGlitchOptions): PixelBuffer

type WaveSliceDirection = "horizontal" | "vertical";

type WaveSliceOptions = {
  amplitude: number;
  frequency: number;
  direction?: WaveSliceDirection;
};

function applyWaveSlice(source: PixelBuffer, options: WaveSliceOptions): PixelBuffer
```
Apply a sinusoidal wave distortion effect.

## Bitmap Pixelation

```typescript
type BitmapOptions = {
  cellSize: number;
  colorLevels: number;
  ditherThreshold?: number;
};

function applyBitmap(source: PixelBuffer, options: BitmapOptions): PixelBuffer
```
Heavy pixelation with palette reduction and optional ordered dither.

## LED Matrix

```typescript
type LedShape = "circle" | "square";

type LedMatrixOptions = {
  cellSize: number;
  shape?: LedShape;
  colorMode?: "source" | "white" | "tint";
  tint?: RgbaColor;
  glowAmount?: number;
  backgroundColor?: RgbaColor;
};

function applyLedMatrix(source: PixelBuffer, options: LedMatrixOptions): PixelBuffer
```

## Grain & Noise

```typescript
function createSeededRandom(seed: number): () => number

function applyNoise(buffer: PixelBuffer, amount: number, seed?: number): void
```
Default seed: 42.

```typescript
function applyGrain(buffer: PixelBuffer, amount: number, seed?: number): void
```
Apply film grain noise in-place. amount 0–1. Default seed: 42.

## Vignette

```typescript
function applyVignette(buffer: PixelBuffer, strength: number): void
```
Apply a radial vignette darkening in-place. strength 0–1.

## Scanlines & RGB Shift

```typescript
function applyScanlines(buffer: PixelBuffer, strength: number, lineHeight?: number): void
```
Apply CRT scanline overlay in-place. Default lineHeight: 4.

```typescript
function applyRgbShift(buffer: PixelBuffer, shiftX: number): void
```
Apply horizontal RGB channel separation.

## Edge Detection

```typescript
function applyEdgeDetect(buffer: PixelBuffer, strength: number): void
```
Apply edge detection in-place. strength 0–1.

```typescript
function renderEdgeBuffer(buffer: PixelBuffer): PixelBuffer
```
Return a new buffer containing edge detection output.

## Blend

```typescript
type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft" | "lighten";

function blendPixelBuffers(
  bottom: PixelBuffer,
  top: PixelBuffer,
  mode?: BlendMode,
  amount?: number
): PixelBuffer
```
Blend two buffers with the given mode and opacity. Default mode: "normal", default amount: 1.

## Grid Overlay

```typescript
type GridOverlayStyle = "darken" | "lighten" | "color";

type GridOverlayOptions = {
  cellSize: number;
  opacity: number;
  style?: GridOverlayStyle;
  color?: RgbaColor;
  lineWidth?: number;
};

function applyGridOverlay(buffer: PixelBuffer, options: GridOverlayOptions): void
```

## Pencil Grain

```typescript
type PencilGrainOptions = {
  paperColor: RgbaColor;
  edgeStrength: number;
  grainAmount: number;
};

function applyPencilGrain(source: PixelBuffer, options: PencilGrainOptions): PixelBuffer
```
Render a graphite pencil sketch effect.

## Inverted Glow

```typescript
type InvertedGlowOptions = {
  intensity: number;
};

function applyInvertedGlow(source: PixelBuffer, options: InvertedGlowOptions): PixelBuffer
```

## Highlights / Split Tone

```typescript
type SplitToneOptions = {
  shadowColor: RgbaColor;
  highlightColor: RgbaColor;
  shadowAmount?: number;
  highlightAmount?: number;
  shadowAnchor?: number;
  highlightAnchor?: number;
};

function applySplitTone(source: PixelBuffer, options: SplitToneOptions): PixelBuffer
```

## Manga Scanlines

```typescript
type MangaScreenOptions = {
  lineSpacing: number;
  lineWidth: number;
  angle?: number;
  threshold?: number;
  inkColor?: RgbaColor;
  paperColor?: RgbaColor;
};

function applyMangaScreen(source: PixelBuffer, options: MangaScreenOptions): PixelBuffer
```
Manga/comic-style screen tone pattern overlay.

## Resize

```typescript
function resizeNearestNeighbor(
  source: PixelBuffer,
  targetWidth: number,
  targetHeight: number
): PixelBuffer

function resizeBilinear(
  source: PixelBuffer,
  targetWidth: number,
  targetHeight: number
): PixelBuffer
```

## Resolve Glyph Bitmap

```typescript
function resolveGlyphBitmap(char: string): number[]
```
Resolve a character to a bitmap glyph representation for ASCII rendering.

## See Also

- [Presets API Reference](presets.md) — `EffectPreset`, `intensityMapper`, `createPipeline`
- [Worker API Reference](worker.md) — `EffectsWorkerClient` for off-thread rendering
- [Concepts: Architecture](../../concepts/architecture.md) — render flow overview
