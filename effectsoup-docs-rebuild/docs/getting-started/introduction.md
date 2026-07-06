# What is EffectSoup?

EffectSoup is a browser-based, non-AI image transformation engine. Upload a photo, choose an effect, adjust controls, and export — every pixel is processed in a Web Worker on your device. No uploads to a server, no AI generation, no signup required to edit.

Every effect is a deterministic, mathematical image pipeline. The same photo with the same settings always produces the same pixel output.

## How Rendering Works

1. **Decode** — Image is decoded into a `PixelBuffer` via Canvas 2D API.
2. **Viewport** — Crop, zoom, and offset are applied non-destructively via `applyViewportTransform`.
3. **Resolve** — The preset's `intensityMapper` converts the 0–100 slider and advanced overrides into resolved parameters.
4. **Pipeline** — The preset's `createPipeline` builds a render function that runs the effect chain.
5. **Render** — If using `EffectsWorkerClient`, steps 2–4 run off the main thread and the result is transferred back via `postMessage` with zero-copy `ArrayBuffer` transfer.
6. **Export** — The final buffer is drawn to an offscreen canvas and exported as PNG, JPEG, or WebP via the Canvas `toBlob` API.

## Packages

The engine is split into four npm packages under the `@effectsoup` scope (113 exported symbols total):

| Package | Description | Key exports |
|---|---|---|
| [`@effectsoup/core`](../reference/api/core.md) | Pure TS image primitives | `PixelBuffer`, `createPixelBuffer`, `toGrayscale`, dithering, ASCII, glow, distortion, halftone, stipple, and more (39 functions, 22 types) |
| [`@effectsoup/presets`](../reference/api/presets.md) | Effect presets with intensity mapping | `EffectPreset`, `allPresets` (25 presets), `getPresetById`, `intensityMapper`, `createPipeline` |
| [`@effectsoup/worker`](../reference/api/worker.md) | Web Worker client | `EffectsWorkerClient` class for off-thread rendering with job versioning |
| [`@effectsoup/effectsoup`](../reference/api/meta-package.md) | All-in-one meta-package | Re-exports core + presets + worker |

## Quick Links

- [Get started in 5 minutes](quickstart.md) — open the playground, apply an effect, export
- [Install the packages](installation.md) — npm/pnpm setup with a minimal example
- [Browse all effects](../reference/effects-catalog.md) — 25 presets across 7 categories
- [Create a custom effect](../guides/creating-an-effect.md) — EffectPreset anatomy and registration

## See Also

- [Architecture](../concepts/architecture.md) — monorepo layout and render flow
- [FAQ](../concepts/faq.md) — common questions
