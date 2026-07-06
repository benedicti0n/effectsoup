# Phase 2 — Sitemap & Migration Map

## Framework: Plain Markdown (GitHub-renderable)
No Docusaurus/VitePress/MkDocs config found. Docs live under `/docs/` as
flat Markdown. Navigation via `docs/README.md` table of contents.

## Sitemap — planned file tree

```
docs/
├── README.md                        # Landing page: what, why, links to all sections
├── getting-started/
│   ├── introduction.md              # What is EffectSoup? — overview, rendering, packages
│   ├── installation.md              # npm/pnpm install @effectsoup/*, requirements
│   └── quickstart.md                # First 5 minutes: playground walkthrough
├── guides/
│   ├── upload-and-crop.md           # How to load, replace, crop, zoom images
│   ├── effect-controls.md           # Using intensity slider + advanced controls
│   ├── exporting.md                 # Format, quality, resolution, sign-in
│   ├── creating-an-effect.md        # EffectPreset anatomy, registration, best practices
│   ├── testing-effects.md           # Vitest patterns for presets and core
│   └── performance.md               # Workers, preview resolution, buffer tips
├── reference/
│   ├── editor-overview.md           # UI layout, history/undo, compare, mobile
│   ├── effects-catalog.md           # All 24+ presets by category
│   └── api/
│       ├── core.md                  # @effectsoup/core — all 39 functions + 22 types
│       ├── presets.md               # @effectsoup/presets — types, lookup, usage
│       ├── worker.md                # @effectsoup/worker — EffectsWorkerClient API
│       └── meta-package.md          # @effectsoup/effectsoup — re-exports
├── concepts/
│   ├── architecture.md              # Monorepo, render flow, boundaries
│   ├── troubleshooting.md           # Common issues and solutions
│   └── faq.md                       # Frequently asked questions
```

Total: 1 README + 3 getting-started + 6 guides + 6 reference + 3 concepts = **19 pages**

## Migration Map — old paths → new paths

| Old Path (Next.js route) | New Path | Notes |
|---|---|---|
| `docs` (What is EffectSoup?) | `docs/getting-started/introduction.md` | Moved to getting-started |
| `docs/getting-started/playground` | `docs/getting-started/quickstart.md` | Renamed, merged with editor overview's tutorial parts |
| `docs/getting-started/packages` | `docs/getting-started/installation.md` | Renamed |
| `docs/playground` (Editor Overview) | `docs/reference/editor-overview.md` | Moved to reference (it's a layout/UI reference) |
| `docs/playground/upload-and-crop` | `docs/guides/upload-and-crop.md` | Moved to guides |
| `docs/playground/controls` | `docs/guides/effect-controls.md` | Moved to guides |
| `docs/playground/exporting` | `docs/guides/exporting.md` | Moved to guides |
| `docs/effects` (Effects Catalog) | `docs/reference/effects-catalog.md` | Moved to reference |
| `docs/api/core` | `docs/reference/api/core.md` | Restructured under reference/api/ |
| `docs/api/presets` | `docs/reference/api/presets.md` | Restructured under reference/api/ |
| `docs/api/worker` | `docs/reference/api/worker.md` | Restructured under reference/api/ |
| `docs/api/meta-package` | `docs/reference/api/meta-package.md` | Restructured under reference/api/ |
| `docs/guides/creating-an-effect` | `docs/guides/creating-an-effect.md` | Same path, same name |
| `docs/guides/testing-effects` | `docs/guides/testing-effects.md` | Same path, same name |
| `docs/guides/architecture` | `docs/concepts/architecture.md` | Moved to concepts (explanation, not how-to) |
| `docs/guides/performance` | `docs/guides/performance.md` | Same path, same name |
| `docs/troubleshooting` | `docs/concepts/troubleshooting.md` | Moved to concepts |
| `docs/faq` | `docs/concepts/faq.md` | Moved to concepts |
| — (new) | `docs/getting-started/introduction.md` | Split from old `docs` page |
| — (new) | `docs/README.md` | New landing page |
