# EffectSoup — Architecture

## Repository Structure

```text
effectLab/
├── apps/
│   └── web/                    # Next.js App Router application
├── packages/
│   ├── effectsCore/            # Pure TypeScript image-processing library
│   ├── effectsPresets/         # Product preset definitions and pipelines
│   └── effectsWorker/          # Browser Web Worker communication layer
├── package.json                # pnpm workspace + Turborepo root
├── turbo.json                  # Turborepo pipeline
├── Features.md
├── todo.md
├── performance.md
└── README.md
```

## Package Boundaries

### `apps/web`

- Next.js App Router, React, TypeScript, Tailwind CSS
- Cohere design system with Space Grotesk / Inter typography
- Custom reusable UI primitives (Button, Card, Badge, Input, Slider, Toast)
- Zustand for local editor UI state
- TanStack Query for server state
- Better Auth, Drizzle ORM, Neon PostgreSQL
- Upstash Redis for rate limiting
- Sentry, PostHog

This package owns UI, routing, auth, and project metadata. It must never contain pixel-processing algorithms. Public routes include `/` (homepage + mini-playground), `/playground` (full editor), `/docs`, and `/account`.

### Editor UI Components

- `EditableSlider` — reusable slider with double-click numeric editing; used for intensity, advanced range controls, and crop controls. Values clamp to min/max and snap to step.
- `AdvancedControls` — renders per-preset control schema definitions including range, select, boolean, color, and `text` (custom character arrays).

### `packages/effectsCore`

Pure TypeScript library. No framework dependencies. No DOM APIs. Portable raw pixel structure:

```ts
export type PixelBuffer = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};
```

Contains deterministic image-processing primitives such as resize, grayscale, dither, halftone, ASCII rendering with custom charsets and palettes, grid overlay, glow/bloom, noise, grain, vignette, RGB shift, scanlines, edge detection, tint, glass/frost tiles, and blending.

### `packages/effectsPresets`

Defines product presets and their effect pipelines. Each preset declares:

```ts
type EffectPreset = {
  id: string;
  name: string;
  description: string;
  category: "printGrid" | "asciiSymbols" | "atmosphereGlow" | "glassFrost" | "printLab" | "signalLab" | "lightLab";
  defaultIntensity: number;
  intensityMapper: IntensityMapper;
  advancedControlSchema: AdvancedControlDefinition[];
  createPipeline: (resolvedParameters: ResolvedPresetParameters) => EffectPipeline;
};
```

### `packages/effectsWorker`

Handles browser worker communication. Main thread sends image source, crop config, effect config, and `renderVersion`. Worker performs CPU-heavy stages and returns the newest valid output. Implements cooperative cancellation and avoids stale renders painting.

## Browser Rendering Flow

```mermaid
flowchart LR
    A[User uploads image] --> B[Decode to ImageBitmap]
    B --> C[Create source PixelBuffer]
    C --> D[Cache source]
    D --> E[Compute preview-size buffer]
    E --> F[Apply crop]
    F --> G{Effect changed?}
    G -->|Yes| H[Post to Worker]
    H --> I[Worker runs pipeline]
    I --> J[Return output buffer]
    J --> K[Draw to canvas]
```

## Worker Communication Flow

```mermaid
sequenceDiagram
    participant UI as Editor UI
    participant W as effectsWorker
    participant Core as effectsCore

    UI->>W: renderJob {version, source, crop, preset, intensity, overrides}
    Note over UI,W: Newer job cancels obsolete ones
    W->>Core: runPipeline(resolvedParams)
    Core-->>W: output PixelBuffer
    W-->>UI: renderComplete {version, output}
    UI->>UI: discard if version < latestVersion
    UI->>Canvas: drawImageBitmap
```

## Preview vs Export Modes

| Aspect | Interactive Preview | Final Export |
|--------|---------------------|--------------|
| Trigger | preset/intensity/crop change | Export button |
| Source | preview-size cached buffer | original decoded source |
| Max size | 1400px desktop / 960px mobile | original or up to 4K |
| Quality | approximate while dragging, refined on pause | full quality |
| Location | Web Worker | Web Worker / OffscreenCanvas fallback |

## Auth Flow

- Better Auth manages sessions via `/api/auth/[...all]`.
- Guests use local-only editing.
- Sign-in triggered only by cloud-save actions.
- Account page shows auth methods and sign-out.

## Security Boundaries

- `effectsCore` has no network, auth, or UI dependencies.
- Environment variables validated with Zod.
- Rate limiting on upload and project routes.
- Project operations require ownership checks.
- No secrets in client bundles, logs, or error payloads.

## Scaling Explanation for 1,000 Active Editors

Because every user’s browser performs its own image rendering, there is no shared image-processing bottleneck. The backend only handles:

- Session reads
- Occasional project metadata writes
- Rate-limited upload URL creation

This architecture scales horizontally by adding standard Next.js compute. The image engine scales with each user’s device, protected by adaptive preview quality and worker cancellation.
