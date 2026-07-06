# @effectsoup/worker

Browser Web Worker client for running `@effectsoup/presets` renders off the main thread. Keeps the UI responsive during heavy image processing.

> [API Reference](https://effectsoup.com/docs/api/worker) · [Full Documentation](https://effectsoup.com/docs)

---

## Installation

```bash
npm install @effectsoup/worker
```

Requires `@effectsoup/core` and `@effectsoup/presets` as peer dependencies:

```bash
npm install @effectsoup/core @effectsoup/presets @effectsoup/worker
```

Or install the meta-package for everything:

```bash
npm install @effectsoup/effectsoup
```

---

## Quick Start

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

---

## API Reference

### `EffectsWorkerClient`

#### Constructor

```ts
new EffectsWorkerClient(workerUrl: string | URL)
```

Creates a Web Worker from the provided script URL and sets up the message channel.

**Parameters:**
- `workerUrl` — URL or path to `@effectsoup/worker/dist/worker.js`. Use `new URL(..., import.meta.url)` with Vite, or point to the file directly in your setup.

#### `render(options: RenderJob): Promise<PixelBuffer>`

Send a render job to the worker. Returns a promise that resolves with the output `PixelBuffer`.

**RenderJob:**
```ts
type RenderJob = {
  presetId: string;
  resolvedParameters: ResolvedPresetParameters;
  source: PixelBuffer;
  crop: CropConfig;
  targetWidth: number;
  targetHeight: number;
};
```

The worker handles viewport transform (crop/zoom), pipeline execution, and buffer creation. The output buffer's underlying `ArrayBuffer` is transferred back to the main thread via zero-copy transfer.

#### `cancelRender(): void`

Cancel the most recent render. Stale results are automatically discarded — if a new render starts before a previous one finishes, the old result is dropped. This makes rapid slider adjustments safe without manual debouncing.

#### `terminate(): void`

Terminate the worker. Call when the client is no longer needed to free resources.

---

## Worker Script Path

The exact URL depends on your bundler:

| Bundler | Syntax |
|---|---|
| **Vite** | `new Worker(new URL("@effectsoup/worker/dist/worker.js", import.meta.url), { type: "module" })` |
| **Webpack** | `new Worker(new URL("@effectsoup/worker/dist/worker.js", import.meta.url))` |
| **Direct** | Point to `node_modules/@effectsoup/worker/dist/worker.js` in your public directory |

---

## How It Works

1. `EffectsWorkerClient` spawns a dedicated Web Worker from the provided script URL.
2. Each `render()` call sends a `RenderJob` to the worker via `postMessage`. The source `PixelBuffer`'s `ArrayBuffer` is transferred (zero-copy) to avoid duplicating memory.
3. The worker applies the viewport transform, resolves the preset pipeline, runs the effect, and transfers the output buffer back.
4. Each job increments an internal version counter. If a new render starts before a previous one completes, the old result is silently discarded when it arrives.
5. Call `terminate()` to clean up. The worker cannot be reused after termination.

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
