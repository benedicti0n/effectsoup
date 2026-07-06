# Installation

The EffectSoup engine is available as TypeScript packages on npm. Install everything with the meta-package, or pick only what you need.

## Requirements

- Node.js >= 20
- pnpm (recommended), npm, or yarn
- Modern browser (Chrome, Firefox, Safari, Edge) for running effects

## Meta-package (all-in-one)

```bash
pnpm add @effectsoup/effectsoup
```

```bash
npm install @effectsoup/effectsoup
```

The meta-package re-exports everything from core, presets, and worker. Import any symbol from `@effectsoup/effectsoup`:

```typescript
import { createPixelBuffer, toGrayscale } from "@effectsoup/effectsoup";
import { getPresetById, allPresets } from "@effectsoup/effectsoup";
import { EffectsWorkerClient } from "@effectsoup/effectsoup";
import type { PixelBuffer, EffectPreset } from "@effectsoup/effectsoup";
```

## Individual packages

```bash
pnpm add @effectsoup/core @effectsoup/presets @effectsoup/worker
```

Install only what you need. Each package is independently versioned.

| Package | When to install |
|---|---|
| `@effectsoup/core` | You only need image primitives — buffer management, color transforms, dithering |
| `@effectsoup/presets` | You need ready-made effect pipelines with intensity controls |
| `@effectsoup/worker` | You want off-main-thread rendering with cancellation support |

## Browser compatibility

- `@effectsoup/core` — no DOM dependencies. Safe in browsers and Node.js. Requires `Uint8ClampedArray`.
- `@effectsoup/presets` — works in any JS environment with `Uint8ClampedArray`.
- `@effectsoup/worker` — requires the Web Worker API. Not available in Node.js.

## Minimal example

```typescript
import { createPixelBuffer, toGrayscale } from "@effectsoup/core";
import type { PixelBuffer } from "@effectsoup/core";

// Create a buffer from a canvas element.
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const source: PixelBuffer = createPixelBuffer(canvas.width, canvas.height);
source.data.set(imageData.data);

// Apply grayscale in-place.
toGrayscale(source);

// Write back to canvas.
ctx.putImageData(
  new ImageData(source.data, source.width, source.height),
  0, 0
);
```

## See Also

- [Quickstart](quickstart.md) — use the playground without installing anything
- [Core API Reference](../reference/api/core.md) — all 39 functions
- [Presets API Reference](../reference/api/presets.md) — `getPresetById`, `allPresets`
