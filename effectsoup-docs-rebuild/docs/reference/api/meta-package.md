# `@effectsoup/effectsoup`

All-in-one meta-package that re-exports everything from `@effectsoup/core`, `@effectsoup/presets`, and `@effectsoup/worker`.

## Installation

```bash
pnpm add @effectsoup/effectsoup
```

```bash
npm install @effectsoup/effectsoup
```

## Usage

Import any symbol from the meta-package entry point:

```typescript
// Core primitives
import { createPixelBuffer, toGrayscale } from "@effectsoup/effectsoup";
import type { PixelBuffer, RgbaColor } from "@effectsoup/effectsoup";

// Presets
import { getPresetById, allPresets } from "@effectsoup/effectsoup";
import type { EffectPreset, EffectPipeline } from "@effectsoup/effectsoup";

// Worker
import { EffectsWorkerClient } from "@effectsoup/effectsoup";
```

## When to use

- **Meta-package**: Install once and get the entire engine. Best for quick setup and small projects.
- **Individual packages**: Recommended when you only need specific parts. For example, if you only need core primitives (`@effectsoup/core`) without the Worker or preset dependencies.

All 113+ exported symbols from the three sub-packages are available through `@effectsoup/effectsoup`.

## See Also

- [Core API Reference](core.md) — image primitives (39 functions)
- [Presets API Reference](presets.md) — `EffectPreset`, `getPresetById`, `allPresets`
- [Worker API Reference](worker.md) — `EffectsWorkerClient`
- [Installation Guide](../../getting-started/installation.md) — setup steps and minimal example
