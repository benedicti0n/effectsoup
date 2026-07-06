# `@effectsoup/worker`

Web Worker client that runs heavy rendering off the main thread. Handles job versioning, cancellation of stale renders, and buffer transfer.

**Exports:** 8 types, 1 class (4 methods)

## EffectsWorkerClient

```typescript
class EffectsWorkerClient {
  constructor(workerScriptUrl: string | URL);
  render(options: RenderOptions): Promise<PixelBuffer>;
  cancelObsolete(version: number): void;
  terminate(): void;
}
```

### Constructor

```typescript
constructor(workerScriptUrl: string | URL): EffectsWorkerClient
```

Creates a new Web Worker from the given script URL. The worker script is bundled separately — see the usage note below for bundler-specific paths.

### render

```typescript
render(options: RenderOptions): Promise<PixelBuffer>
```

Sends a render job to the worker. Returns a promise that resolves with the output `PixelBuffer`. Each call increments an internal version counter — if a new render is requested before a previous one completes, the stale result is silently discarded.

### cancelObsolete

```typescript
cancelObsolete(version: number): void
```

Signal that a specific version should be ignored if it completes later.

### terminate

```typescript
terminate(): void
```

Terminate the worker. Call when done to free resources. After termination, the client cannot be reused.

## RenderOptions

```typescript
type RenderOptions = {
  presetId: string;
  resolvedParameters: ResolvedPresetParameters;
  source: PixelBuffer;
  crop: CropConfig;
  targetWidth: number;
  targetHeight: number;
};
```

## Worker Message Types

```typescript
type RenderJob = {
  renderVersion: number;
  source: PixelBuffer;
  crop: CropConfig;
  presetId: string;
  resolvedParameters: ResolvedPresetParameters;
  targetWidth: number;
  targetHeight: number;
};

type RenderRequestMessage = { type: "render"; job: RenderJob };
type CancelRequestMessage = { type: "cancel"; renderVersion: number };
type WorkerRequestMessage = RenderRequestMessage | CancelRequestMessage;

type RenderResultMessage = { type: "renderResult"; renderVersion: number; output: PixelBuffer };
type RenderErrorMessage = { type: "renderError"; renderVersion: number; error: string };
type WorkerResponseMessage = RenderResultMessage | RenderErrorMessage;
```

## Usage

```typescript
import { EffectsWorkerClient } from "@effectsoup/worker";

// Point the client at the worker script.
// In Vite: new URL("@effectsoup/worker/dist/worker.js", import.meta.url)
// In other setups: point to dist/worker.js in the package.
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

// Clean up when done.
client.terminate();
```

> The worker script URL depends on your bundler. In Vite you can use the `?worker` import syntax or `new URL(...)`. In other setups, point to `dist/worker.js` in the `@effectsoup/worker` package.

## Job Versioning & Cancellation

Each `render()` call increments an internal version counter inside the worker. When a render completes, the worker checks whether its version matches the current version — if a newer render was started, the stale result is silently discarded.

Use `cancelObsolete(version)` to mark a specific version as obsolete before it completes.

## Buffer Transfer

The worker transfers the source buffer's underlying `ArrayBuffer` via `postMessage` to avoid copying pixel data. This means the source buffer is emptied after posting. The result buffer is also transferred back.

After calling `render()`, the original `source` `PixelBuffer` will have its `data` array detached. Clone it first if you need to keep the original data.

## See Also

- [Core API Reference](core.md) — `PixelBuffer`, `CropConfig`, `ResolvedPresetParameters`
- [Presets API Reference](presets.md) — `getPresetById`, `intensityMapper`
- [Architecture](../../concepts/architecture.md) — render flow and worker lifecycle
- [Performance Guide](../../guides/performance.md) — worker optimization tips
