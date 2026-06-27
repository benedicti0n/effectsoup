# @effectsoup/effectsoup

All-in-one EffectSoup image engine. Installs the core library, presets, and Web Worker client in one command.

## Install

```bash
npm install @effectsoup/effectsoup
```

## What you get

- `@effectsoup/core` — pure TypeScript image-processing primitives
- `@effectsoup/presets` — tuned effect presets with Intensity mapping
- `@effectsoup/worker` — Web Worker client for off-thread rendering

## Quick start

```ts
import {
  createPixelBuffer,
  getPresetById,
  EffectsWorkerClient
} from "@effectsoup/effectsoup";

const preset = getPresetById("dotHalftone")!;
const params = preset.intensityMapper(75, {});
const pipeline = preset.createPipeline(params);

const source = createPixelBuffer(800, 600);
// ...fill source from an image...

const output = pipeline(source, params);
```

## Installing individual packages

If you only need part of the engine, install the sub-packages directly:

```bash
npm install @effectsoup/core @effectsoup/presets @effectsoup/worker
```

## Repository

[https://github.com/benedicti0n/effectsoup](https://github.com/benedicti0n/effectsoup)
