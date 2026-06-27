# @effectsoup/worker

Browser Web Worker client for running `@effectsoup/presets` renders off the main thread.

## Install

```bash
npm install @effectsoup/worker
```

Or install everything at once:

```bash
npm install @effectsoup/effectsoup
```

## Quick start

```ts
import { EffectsWorkerClient } from "@effectsoup/worker";

const client = new EffectsWorkerClient(
  new URL("@effectsoup/worker/dist/worker.js", import.meta.url)
);

const output = await client.render({
  presetId: "dotHalftone",
  resolvedParameters: params,
  source,
  crop: {
    aspectRatio: "original",
    zoom: 1,
    offsetX: 0,
    offsetY: 0
  },
  targetWidth: 1200,
  targetHeight: 1600
});

client.terminate();
```

## Worker script path

The exact URL depends on your bundler:

- **Vite**: `new Worker(new URL("@effectsoup/worker/dist/worker.js", import.meta.url), { type: "module" })`
- **Other setups**: point directly at the package’s `dist/worker.js` entry.

The client handles job versioning and discards stale renders automatically.

## Repository

[https://github.com/benedicti0n/effectsoup](https://github.com/benedicti0n/effectsoup)
