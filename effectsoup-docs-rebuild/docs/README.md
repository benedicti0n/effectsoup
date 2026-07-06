# EffectSoup Documentation

EffectSoup is a browser-based, non-AI image transformation engine. Every pixel is processed in a Web Worker on your device — no uploads, no AI, no hidden limits.

## Getting Started

New here? Start with these:

| Page | What you'll learn |
|---|---|
| [Introduction](getting-started/introduction.md) | What EffectSoup is, how rendering works, package overview |
| [Installation](getting-started/installation.md) | npm/pnpm setup, requirements, minimal example |
| [Quickstart](getting-started/quickstart.md) | Open the playground, apply an effect, export — in 5 minutes |

## Guides

Goal-oriented how-to guides:

| Page | What you'll learn |
|---|---|
| [Upload & Crop Guide](guides/upload-and-crop.md) | Load, replace, remove images; crop, zoom, offset |
| [Effect Controls Guide](guides/effect-controls.md) | Intensity slider, advanced controls, resetting |
| [Exporting Guide](guides/exporting.md) | Format, quality, and resolution options |
| [Creating an Effect](guides/creating-an-effect.md) | EffectPreset anatomy, registration, best practices |
| [Testing Effects](guides/testing-effects.md) | Vitest patterns for presets and core |
| [Performance](guides/performance.md) | Workers, preview resolution, buffer tips |

## Reference

Complete API and configuration documentation:

| Page | What you'll find |
|---|---|
| [Editor Overview](reference/editor-overview.md) | UI layout, history/undo, compare, mobile |
| [Effects Catalog](reference/effects-catalog.md) | All 24+ presets by category |
| [`@effectsoup/core`](reference/api/core.md) | 39 functions, 22 types — buffer, color, dither, ASCII, glow, distortion |
| [`@effectsoup/presets`](reference/api/presets.md) | EffectPreset types, lookup functions, shared controls |
| [`@effectsoup/worker`](reference/api/worker.md) | EffectsWorkerClient, render options, versioning |
| [`@effectsoup/effectsoup`](reference/api/meta-package.md) | Meta-package re-exports |

## Concepts

Explanations of how EffectSoup works:

| Page | What you'll learn |
|---|---|
| [Architecture](concepts/architecture.md) | Monorepo layout, render flow, worker lifecycle |
| [Troubleshooting](concepts/troubleshooting.md) | Common issues and their solutions |
| [FAQ](concepts/faq.md) | Frequently asked questions |
