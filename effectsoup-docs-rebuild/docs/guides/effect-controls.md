# Effect Controls Guide

How to use the intensity slider and advanced controls to fine-tune any effect.

## Prerequisites

- An image is loaded in the playground
- A preset is selected from the left sidebar

## Intensity slider

Most presets have an **Intensity** slider ranging from 0–100%. At 0%, the effect is bypassed and the source image is returned unchanged.

The slider maps to the preset's internal parameters via its `intensityMapper` function, which may scale multiple parameters simultaneously. Each preset defines its own mapping.

Some presets set `usesIntensity: false` in their `EffectPreset` definition. These have no intensity slider and are always fully active through their advanced controls. For example:

- `stipplePrint` — Stipple Print
- `ledMatrix` — LED Matrix
- `bitmap` — Bitmap

## Advanced controls

Each preset defines its own `advancedControlSchema` — an array of `AdvancedControlDefinition` objects that the right panel renders automatically.

### Control types

| Type | UI control | Return type |
|---|---|---|
| `range` | Slider with min, max, step | `number` |
| `select` | Dropdown with predefined options | `string` |
| `color` | Color picker | `string` (hex, e.g. `#ff006e`) |
| `boolean` | Toggle checkbox | `boolean` (`true` / `false`) |
| `text` | Text input | `string` |

The schema is defined at preset authoring time. See the [Creating an Effect](creating-an-effect.md) guide for the full `AdvancedControlDefinition` type signature.

### Common controls

Many presets share controls from `shared.ts` in the `@effectsoup/presets` package:

- **Adjustment controls** (`adjustmentControls`) — brightness, contrast, saturation — used by dither presets
- **Atmosphere controls** (`atmosphereAdvancedControls`) — grain amount, glow amount — used by many presets

## Resetting controls

- **Reset effect** — resets all advanced overrides back to the preset defaults while keeping the current effect selected. Available as a link in the control panel.
- **Reset** (toolbar) — resets everything: crop, effect, and output options.

## How parameters are resolved

The resolution chain is:

1. Editor takes the intensity slider value (0–100) and any advanced override values.
2. Calls `preset.intensityMapper(intensity, overrides)` → returns `ResolvedPresetParameters`.
3. Calls `preset.createPipeline(params)` → returns an `EffectPipeline` function.
4. Calls the pipeline with the source buffer: `pipeline(source, params)` → output `PixelBuffer`.

```typescript
const params = preset.intensityMapper(75, { dotSize: 8 });
const pipeline = preset.createPipeline(params);
const output = preset.createPipeline(params)(source, params);
```

## See Also

- [Creating an Effect](creating-an-effect.md) — how to define custom controls for a new preset
- [Upload & Crop Guide](upload-and-crop.md) — image loading and viewport controls
- [Presets API Reference](../reference/api/presets.md) — `IntensityMapper`, `ResolvedPresetParameters`, `AdvancedControlDefinition`
