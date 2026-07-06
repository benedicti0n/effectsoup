# Architecture

The EffectSoup monorepo structure and rendering flow.

## Monorepo Structure

```text
effectsoup/
  apps/
    web/ — Next.js app (playground, editor, docs, home)
  packages/
    effectsCore/ — Pure TS image primitives
    effectsPresets/ — Effect presets and schema
    effectsWorker/ — Web Worker bridge
    effectsoup/ — Meta-package (re-exports)
```

All four packages are pure TypeScript, browser-safe, and tree-shakeable. No package has a DOM, Node.js, or framework dependency.

## Package Boundaries

- The web app imports from packages; packages never import from the app.
- Packages depend only on `@effectsoup/core` for types and primitives.
- The worker package is the only package that imports from both core and presets.

## Render Flow

1. **Decode** — User uploads an image → decoded into `PixelBuffer` via Canvas 2D API.
2. **Crop** — User adjusts crop/zoom/offset → `CropConfig` updated in editor state.
3. **Resolve** — User selects a preset → intensity defaults applied. Editor calls `intensityMapper(intensity, overrides)` → `ResolvedPresetParameters`.
4. **Render** — Client sends a `RenderJob` to the Web Worker via `postMessage`. The worker applies the viewport transform, builds the pipeline from the preset's `createPipeline`, runs the effect, and transfers the result back via zero-copy `ArrayBuffer` transfer.
5. **Display** — Main thread draws the result to a canvas for preview or export.

## Preset Lifecycle

- **Definition time:** Each preset is a static `EffectPreset` object with an `intensityMapper`, `advancedControlSchema`, and `createPipeline` factory function.
- **Registration:** Presets are added to the `allPresets` array in `packages/effectsPresets/src/index.ts`.
- **Render time:** `intensityMapper` resolves parameters → `createPipeline(params)` returns an `EffectPipeline` → pipeline is called with the source buffer and resolved params.

## Worker Lifecycle

- Created when `EffectsWorkerClient` is instantiated with a worker script URL.
- Listens for `"render"` messages containing a `RenderJob`.
- Listens for `"cancel"` messages to mark jobs as obsolete via version comparison.
- Each render increments a version counter; stale results are silently discarded.
- Results are posted back as `"renderResult"` with the output buffer.
- Call `client.terminate()` to clean up the worker when done.

## Why Web Workers?

EffectSoup runs rendering in a Web Worker by default to keep the UI thread responsive during heavy computation. The worker handles crop, pipeline execution, and buffer creation. Canvas drawing and input decoding remain on the main thread (they require DOM APIs that workers don't have access to).

## Why not WebGL or WASM?

The engine is pure TypeScript for portability, tree-shakeability, and ease of contribution. No WebGL, no WASM, no native dependencies. This means:
- Every function can be called from any context: main thread, worker, Node.js, or edge runtime.
- The engine is fully deterministic — no GPU driver variance, no floating-point inconsistencies across platforms.
- Bundlers can tree-shake unused functions.

## See Also

- [Core API Reference](../reference/api/core.md) — PixelBuffer and all primitives
- [Presets API Reference](../reference/api/presets.md) — EffectPreset lifecycle
- [Worker API Reference](../reference/api/worker.md) — EffectsWorkerClient internals
- [Performance Guide](../guides/performance.md) — optimization tips
