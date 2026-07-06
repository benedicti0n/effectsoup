# @effectsoup/core

Pure TypeScript image-processing primitives. No DOM, no framework dependencies, no AI — just deterministic pixel math that runs anywhere JavaScript runs.

> [API Reference](https://effectsoup.com/docs/api/core) · [Full Documentation](https://effectsoup.com/docs)

---

## Installation

```bash
npm install @effectsoup/core
```

Or install the meta-package for everything:

```bash
npm install @effectsoup/effectsoup
```

Requires Node.js ≥ 20 (or any modern browser).

---

## Quick Start

`PixelBuffer` is the core currency — a portable RGBA buffer backed by `Uint8ClampedArray`.

```ts
import { createPixelBuffer, toGrayscale } from "@effectsoup/core";

const width = 800;
const height = 600;
const source = createPixelBuffer(width, height);

// Fill from a canvas
const ctx = canvas.getContext("2d")!;
const imageData = ctx.getImageData(0, 0, width, height);
source.data.set(imageData.data);

// Run a primitive in-place
toGrayscale(source);

// Draw the result back
ctx.putImageData(
  new ImageData(source.data, source.width, source.height),
  0, 0
);
```

Every function is synchronous, pure, and works in the browser, a Web Worker, or Node.js.

---

## API Overview

### Buffer Management

| Function | Description |
|---|---|
| `createPixelBuffer(width, height)` | Create a new buffer |
| `clonePixelBuffer(source)` | Deep-clone a buffer |
| `fillPixelBuffer(buffer, r, g, b, a)` | Fill with a solid color |
| `cropToCanvas(buffer, crop, outputSize)` | Crop and scale a buffer |

### Color Transforms

| Function | Description |
|---|---|
| `toGrayscale(buffer)` | Convert to luminance |
| `applyGrayscaleMapping(buffer, mapping)` | Map luminance → grayscale tones |
| `applyPaletteMapping(buffer, palette)` | Map luminance → color palette |
| `adjustContrast(buffer, amount)` | Contrast (-100 to 100) |
| `adjustBrightness(buffer, amount)` | Brightness (-100 to 100) |
| `adjustSaturation(buffer, amount)` | Saturation (-100 to 100) |
| `adjustHue(buffer, amount)` | Hue rotation (0–360) |
| `adjustExposure(buffer, stops)` | Exposure adjustment |
| `adjustTemperature(buffer, amount)` | White balance temperature |
| `adjustVibrance(buffer, amount)` | Vibrance (smart saturation) |
| `adjustHighlights(buffer, amount)` | Highlight recovery |
| `adjustShadows(buffer, amount)` | Shadow recovery |
| `adjustWhites(buffer, amount)` | White point |
| `adjustBlacks(buffer, amount)` | Black point |
| `adjustVignette(buffer, amount)` | Vignette darkening |

### Channel & Luminance

| Function | Description |
|---|---|
| `getLuminance(r, g, b)` | Perceived luminance of an RGB triple |
| `getChannel(buffer, channel)` | Extract a single RGBA channel |
| `setChannel(buffer, channel, data)` | Replace a single RGBA channel |

### Dithering & Halftone

| Function | Description |
|---|---|
| `ditherErrorDiffusion(buffer, options)` | Floyd-Steinberg error diffusion |
| `ditherOrdered(buffer, matrixSize)` | Bayer ordered dither |
| `ditherHalftoneDot(buffer, options)` | Classic halftone dots |
| `ditherColorHalftone(buffer, options)` | Color halftone (CMY+K) |
| `ditherColorHalftoneDot(buffer, options)` | Single dot per channel |
| `halftoneGrid(buffer, spacing)` | Uniform halftone grid |

### ASCII Rendering

| Function | Description |
|---|---|
| `renderAscii(buffer, options)` | Map luminance to ASCII characters |
| `renderDenseAscii(buffer, options)` | Higher-density ASCII output |
| `generateAsciiColorMap(options)` | Build a color map for ASCII output |

### Glow & Bloom

| Function | Description |
|---|---|
| `glowBloom(buffer, config)` | Multi-pass Gaussian bloom |
| `glowKawase(buffer, config)` | Kawase dual-filter bloom |

### Distortion

| Function | Description |
|---|---|
| `cubicDistortion(buffer, config)` | Faceted glass/refraction effect |
| `waveDistortion(buffer, config)` | Sinusoidal wave displacement |

### Stippling

| Function | Description |
|---|---|
| `stippleCompute(buffer, config)` | Density-based dot stippling |

### Utilities

| Function | Description |
|---|---|
| `randomSeed(seed)` | Deterministic seeded random |
| `createViewportTransform(crop)` | Build a viewport transform from crop config |
| `resizeBilinear(source, w, h)` | Bilinear resize |
| `resolveGlyphBitmap(char)` | Character → bitmap glyph |

---

## TypeScript Types

The package exports 22 types including:

- `PixelBuffer` — raw RGBA buffer with `width`, `height`, `data: Uint8ClampedArray`
- `CropConfig` — crop region, zoom, offset, aspect ratio
- `ViewportTransform` — resolved crop/zoom/offset matrix
- `RGBA`, `HSL`, `LCH` — color representation types
- `AsciiOptions`, `AsciiColorMap`, `AsciiCharSet` — ASCII rendering config
- `GlowConfig`, `CubicConfig`, `WaveConfig`, `StippleConfig` — effect parameters
- `AdvancedControlSchema`, `RangeControl`, `SelectControl`, `BooleanControl` — UI schema types

---

## Development

```bash
# Build
pnpm build

# Type check
pnpm typecheck

# Test
pnpm test

# Lint
pnpm lint
```

---

## License

MIT
