# Testing Effects

EffectSoup uses Vitest (core) and the built-in test suite (presets) with deterministic rendering tests.

## Preset Tests

Preset tests live in `packages/effectsPresets/src/presets.test.ts`. Each preset is tested for:

- **Zero-intensity identity** — At 0% intensity, the pipeline returns the source unchanged (a clone).
- **Output dimensions** — The pipeline produces output at the requested size for common resolutions.
- **Rendering without errors** — The pipeline runs successfully with default parameters.

## Core Tests

Core primitive tests use Vitest and are colocated with the source files (`dither.test.ts`, `color.test.ts`, etc.). These test individual functions with known inputs and expected outputs.

## Test Pattern

```typescript
import { describe, it, expect } from "vitest";
import { createPixelBuffer } from "@effectsoup/core";
import { myPreset } from "./presets/myPreset.js";

describe("myPreset", () => {
  it("returns source unchanged at 0% intensity", () => {
    const source = createPixelBuffer(4, 4);
    const params = myPreset.intensityMapper(0, {});
    const pipeline = myPreset.createPipeline(params);
    const result = pipeline(source, params);
    expect(result).toEqual(source);
  });

  it("produces output at requested size", () => {
    const source = createPixelBuffer(4, 4);
    const params = myPreset.intensityMapper(50, {});
    const pipeline = myPreset.createPipeline(params);
    const result = pipeline(source, params);
    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
  });
});
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run presets tests only
pnpm --filter @effectsoup/presets test

# Run core tests only
pnpm --filter @effectsoup/core test

# Run web app tests
pnpm --filter web test
```

All tests must pass before committing. The CI pipeline runs typecheck, lint, and test on all packages.

## See Also

- [Creating an Effect](creating-an-effect.md) — preset anatomy and registration
- [Core API Reference](../reference/api/core.md) — core primitives and their types
