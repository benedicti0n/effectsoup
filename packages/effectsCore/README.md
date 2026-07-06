# @effectsoup/core

Pure TypeScript image-processing primitives. No DOM, no framework dependencies, no AI — just deterministic pixel math.

**→ [API Reference](https://effectsoup-web.vercel.app/docs/api/core)**
**→ [Full Docs](https://effectsoup-web.vercel.app/docs)**

## Install

```bash
npm install @effectsoup/core
```

Or install everything at once:

```bash
npm install @effectsoup/effectsoup
```

## Quick start

The core currency is a `PixelBuffer`:

```ts
import { createPixelBuffer, toGrayscale } from "@effectsoup/core";

const width = 800;
const height = 600;
const source = createPixelBuffer(width, height);

// Fill it from a canvas
const ctx = canvas.getContext("2d")!;
const imageData = ctx.getImageData(0, 0, width, height);
source.data.set(imageData.data);

// Run a primitive in-place
toGrayscale(source);

// Draw the result back to the canvas
ctx.putImageData(
  new ImageData(source.data, source.width, source.height),
  0,
  0
);
```

## What’s included

- `PixelBuffer` — portable raw RGBA buffer
- `createPixelBuffer`, `clonePixelBuffer`, `fillPixelBuffer`
- Color: `toGrayscale`, `adjustBrightnessContrast`, `adjustSaturation`, `applyDuotone`, `applyPosterize`, `reducePalette`, `applyTint`
- Dither / halftone: `applyOrderedDither`, `applyFloydSteinbergDither`, `renderHalftoneData`
- ASCII rendering, glow/bloom, edge detection, glass distortion, LED matrix, stippling, glitch, wave slice, manga scanlines, pencil grain, and more
- Viewport transform: `applyViewportTransform`, `getCroppedOutputSize`

All primitives are synchronous and operate on plain byte arrays, so they work in the browser, in a Web Worker, or in Node.js.

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

## License

MIT
