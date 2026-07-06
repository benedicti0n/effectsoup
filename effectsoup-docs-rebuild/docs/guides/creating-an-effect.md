# Creating an Effect

Every effect in EffectSoup is an `EffectPreset` object. This guide walks through the anatomy of a preset and how to add a new one.

## Preset Structure

A preset is a plain object with these required fields:

- **id** — Unique string identifier (kebab-case, e.g. `"dotHalftone"`)
- **name** — Display name shown in the UI
- **description** — Short description of the visual result
- **category** — One of the `PresetCategory` values
- **defaultIntensity** — Default slider value (0–100)
- **usesIntensity** — Optional. Set to `false` to hide the slider
- **intensityMapper** — Function that converts intensity + overrides to resolved params
- **advancedControlSchema** — Array of control definitions for the UI to render
- **createPipeline** — Function that returns the render pipeline from resolved params

## Minimal Preset Example

```typescript
import {
  clonePixelBuffer,
  toGrayscale,
  type PixelBuffer
} from "@effectsoup/core";
import type {
  EffectPipeline,
  EffectPreset,
  ResolvedPresetParameters
} from "../../types.js";

export const myPreset: EffectPreset = {
  id: "myEffect",
  name: "My Effect",
  description: "A custom grayscale effect",
  category: "colorGlow",
  defaultIntensity: 50,
  advancedControlSchema: [
    {
      id: "brightness",
      name: "Brightness",
      type: "range",
      min: -50,
      max: 50,
      step: 1,
      defaultValue: 0
    }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    brightness: (overrides.brightness as number) ?? 0
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);
      const result = clonePixelBuffer(source);
      toGrayscale(result);
      return result;
    };
  }
};
```

## Registration

To make your preset discoverable, import and add it to the `allPresets` array in `packages/effectsPresets/src/index.ts`:

```typescript
import { myPreset } from "./presets/free/myPreset.js";

export const allPresets: EffectPreset[] = [
  // ... existing presets
  myPreset
];
```

> Presets are auto-discovered by the UI through the `allPresets` export. The advanced controls render automatically — no UI code changes needed.

## Best Practices

- Clone the source buffer before mutating (use `clonePixelBuffer`).
- Return the source clone unchanged at intensity 0 — this is expected by test conventions and the UI.
- Use `runAtWorkingResolution` for per-pixel effects to keep performance consistent across image sizes.
- Use shared controls from `shared.ts` (`adjustmentControls`, `atmosphereAdvancedControls`) for consistency.
- Write deterministic effects — same input + same params = same output. This enables reliable testing and preview caching.
- Add tests to `presets.test.ts` following the existing patterns.

## Pipeline Conventions

The pipeline receives a `PixelBuffer` that has already been cropped by the viewport transform. It should **not** modify the source buffer. The return value should be a new buffer (usually via `clonePixelBuffer` and then mutated, or by creating a fresh buffer).

Advanced controls are resolved via `resolveOverride` from `shared.ts`, which safely extracts typed values from the overrides record.

## See Also

- [Presets API Reference](../reference/api/presets.md) — `EffectPreset` types and lookup functions
- [Testing Effects](testing-effects.md) — test patterns for presets
- [Effects Catalog](../reference/effects-catalog.md) — all built-in presets
