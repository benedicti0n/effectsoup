# @effectsoup/effectsoup

All-in-one EffectSoup image engine. Installs the core library, presets, and Web Worker client in a single command.

> [Full Documentation](https://effectsoup.com/docs) · [API Reference](https://effectsoup.com/docs/api/meta-package)

---

## Installation

```bash
npm install @effectsoup/effectsoup
```

This single package re-exports everything from:

- [`@effectsoup/core`](https://effectsoup.com/docs/api/core) — pure TypeScript image-processing primitives
- [`@effectsoup/presets`](https://effectsoup.com/docs/api/presets) — 25+ tunable effect presets with Intensity mapping
- [`@effectsoup/worker`](https://effectsoup.com/docs/api/worker) — Web Worker client for off-thread rendering

No additional dependencies required.

---

## Quick Start

```ts
import {
  createPixelBuffer,
  getPresetById,
  EffectsWorkerClient
} from "@effectsoup/effectsoup";

// Look up a preset
const preset = getPresetById("dotHalftone")!;
const params = preset.intensityMapper(75, {});
const pipeline = preset.createPipeline(params);

// Create a source buffer
const source = createPixelBuffer(800, 600);
// ...fill source from a canvas, ImageData, etc.

// Run the pipeline (main thread)
const output = pipeline(source, params);

// Or run in a Web Worker:
const client = new EffectsWorkerClient(
  new URL("@effectsoup/worker/dist/worker.js", import.meta.url)
);
const workerOutput = await client.render({
  presetId: "dotHalftone",
  resolvedParameters: params,
  source,
  crop: { aspectRatio: "original", zoom: 1, offsetX: 0, offsetY: 0 },
  targetWidth: 800,
  targetHeight: 600
});
client.terminate();
```

---

## What's Included

### `@effectsoup/core`

39 image-processing functions and 22 types:

- **Buffer:** `createPixelBuffer`, `clonePixelBuffer`, `fillPixelBuffer`, `cropToCanvas`
- **Color:** `toGrayscale`, `adjustContrast`, `adjustBrightness`, `adjustSaturation`, `adjustHue`, `adjustExposure`, `adjustTemperature`, `adjustVibrance`, `applyPaletteMapping`, and more
- **Dither:** `ditherErrorDiffusion`, `ditherOrdered`, `ditherHalftoneDot`, `ditherColorHalftone`
- **ASCII:** `renderAscii`, `renderDenseAscii`, `generateAsciiColorMap`
- **Glow:** `glowBloom`, `glowKawase`
- **Distortion:** `cubicDistortion`, `waveDistortion`
- **Stipple:** `stippleCompute`
- **Utilities:** `resizeBilinear`, `createViewportTransform`, `randomSeed`

### `@effectsoup/presets`

25 presets across 7 categories with full `EffectPreset` API:

- Lookup: `allPresets`, `getPresetById`, `getPresetIds`, `hasPresetId`, `migratePresetId`
- Schema: `AdvancedControlDefinition`, `RangeControl`, `SelectControl`, `BooleanControl`
- Helpers: `resolveOverride`, `runAtWorkingResolution`, `applyAtmosphereAdjustments`

### `@effectsoup/worker`

`EffectsWorkerClient` class for off-main-thread rendering with automatic job versioning and stale-result discard.

---

## Installing Individual Packages

If you only need part of the engine:

```bash
npm install @effectsoup/core              # primitives only
npm install @effectsoup/core @effectsoup/presets   # primitives + presets
npm install @effectsoup/worker            # worker client (needs peer deps)
```

---

## Development

```bash
# Build all packages
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
