# effectLab — Implementation Todo

## Visual Quality Pass (completed)

- [x] Write technical audit document (`docs/visual-quality-audit.md`)
- [x] Fix Pixel Grid to preserve source colors with subtle grid overlay
- [x] Fix Classic ASCII with 5x7 font, dense luminance ramp, and correct aspect ratio
- [x] Upgrade Dot Halftone to colored dots with palette presets
- [x] Improve Dream Glow with Golden Dusk default and palette presets
- [x] Fix Cyber ASCII with denser technical glyph set and colored glyphs
- [x] Fix Manga Grid with controlled posterization and non-destructive grid
- [x] Add Luminous ASCII Bloom premium effect
- [x] Remove weak effects: posterPop, pinkDotMatrix, blueNoirDither, cloudPrint
- [x] Reorganize categories into Print & Grid, ASCII & Symbols, Atmosphere & Glow
- [x] Add Replace Image and Remove Image actions
- [x] Update `Features.md` catalog and matrix
- [x] Update preset unit tests for new counts

## Effect Defaults & Controls Follow-up (completed)

- [x] Tune default intensities for Pixel Grid, Dot Halftone, and Manga Grid
- [x] Add dense ordered ramp and charset presets to Classic ASCII
- [x] Add original/monochrome/tint color modes to Classic ASCII
- [x] Add custom character array control and `text` schema type
- [x] Switch Cyber ASCII default to original colors and add tint presets
- [x] Add Symbol Glow premium preset with palettes and custom symbols
- [x] Build EditableSlider with double-click numeric editing
- [x] Wire EditableSlider to intensity, advanced controls, and crop controls
- [x] Add EditableSlider component tests and Symbol Glow determinism tests
- [x] Update `Features.md`, `todo.md`, `architecture.md`, and audit doc
- [x] Run full test/typecheck/lint/build verification

## Phase 0 — Audit and Planning

- [x] Inspect repository state
- [x] Identify existing stack and current bottlenecks (repo was wiped; building from scratch)
- [x] Create `Features.md`
- [x] Create `todo.md`
- [x] Create `architecture.md`
- [x] Create `performance.md`
- [ ] Get approval to proceed to Phase 1

## Phase 1 — Foundation

- [ ] Initialize pnpm workspace and Turborepo
- [ ] Create `apps/web/` with Next.js + React + TypeScript + Tailwind CSS
- [ ] Configure strict TypeScript across all packages
- [ ] Add ESLint, Prettier, Vitest, Playwright
- [ ] Add root scripts (`dev`, `build`, `lint`, `typecheck`, `test`)
- [ ] Create `packages/effectsCore/` pure image-processing library
- [ ] Create `packages/effectsPresets/` preset definitions
- [ ] Create `packages/effectsWorker/` browser worker package
- [ ] Define shared types (`PixelBuffer`, `EffectPreset`, `IntensityMapper`, `EffectPipeline`)
- [ ] Add initial Vitest tests for shared types
- [ ] Validate local build

## Phase 2 — Image Engine

- [ ] Implement image input validation (type, size, dimensions)
- [ ] Implement image decoding to `ImageBitmap` / `PixelBuffer`
- [ ] Implement EXIF orientation handling
- [ ] Implement preview-resolution scaling
- [ ] Implement crop configuration and crop rendering
- [ ] Implement core primitives in `effectsCore`:
  - [ ] `clonePixelBuffer`
  - [ ] `resizeNearestNeighbor`
  - [ ] `resizeBilinear`
  - [ ] `toGrayscale`
  - [ ] `adjustBrightnessContrast`
  - [ ] `adjustSaturation`
  - [ ] `applyPosterize`
  - [ ] `applyDuotone`
  - [ ] `reducePalette`
  - [ ] `applyOrderedDither`
  - [ ] `applyFloydSteinbergDither`
  - [ ] `renderHalftoneData`
  - [ ] `applyNoise`
  - [ ] `applyGrain`
  - [ ] `applyVignette`
  - [ ] `applyRgbShift`
  - [ ] `applyScanlines`
  - [ ] `applyEdgeDetect`
  - [ ] `blendPixelBuffers`
- [ ] Add deterministic seeded randomness for grain/noise
- [ ] Implement worker protocol with `renderVersion` and cancellation
- [ ] Implement worker caching of source/preview/crop buffers
- [ ] Add unit tests for core primitives
- [ ] Profile a real decoded image before proceeding

## Phase 3 — Presets and Editor

- [ ] Build editor shell (top bar, left panel, center canvas, right panel)
- [ ] Implement responsive mobile layout
- [ ] Implement upload / dropzone component
- [ ] Implement canvas preview with loading/rendering states
- [ ] Implement crop/pan/zoom interactions
- [ ] Implement before/after compare
- [ ] Implement Intensity system and `IntensityMapper` architecture
- [ ] Implement advanced control schema and override resolution
- [ ] Implement free presets (pixelGrid, monoDither, classicAscii, dotHalftone, duotone, dreamGlow, noirGrain, posterPop)
- [ ] Implement premium presets (pinkDotMatrix, blueNoirDither, cyberAscii, cloudPrint, crtDream, vhsBloom, risoOffset, mangaGrid)
- [ ] Implement undo/redo with configuration snapshots
- [ ] Implement reset effect / reset all
- [ ] Implement export dialog and local export
- [ ] Implement premium gating UX in editor and export
- [ ] Add Playwright tests for core flows

## Phase 4 — Auth and Database

- [ ] Set up Neon PostgreSQL connection with Drizzle ORM
- [ ] Configure Better Auth with current official docs
- [ ] Implement Google OAuth and email/password
- [ ] Implement account page and sign-out
- [ ] Create Drizzle schemas for `projects`, `savedPresets`, `subscriptions`, `paymentEvents`
- [ ] Implement `/api/me/entitlements`
- [ ] Implement user role helpers
- [ ] Add route authorization tests

## Phase 5 — Billing and Premium Gates

- [ ] Read current Dodo Payments official documentation
- [ ] Implement `POST /api/billing/createCheckout`
- [ ] Implement `POST /api/billing/createPortal`
- [ ] Implement `POST /api/webhooks/dodo` with signature verification
- [ ] Implement idempotent webhook processing
- [ ] Implement subscription persistence in Drizzle
- [ ] Implement Redis-cached entitlements
- [ ] Implement premium gates in editor, export, and save flows
- [ ] Add billing tests (webhook idempotency, duplicate event handling)

## Phase 6 — Cloud Projects

- [ ] Configure Cloudflare R2 client
- [ ] Implement `POST /api/uploads/createSignedUpload`
- [ ] Implement `POST /api/projects` and `GET/PUT/DELETE /api/projects/[projectId]`
- [ ] Implement project save/open/update/delete UI
- [ ] Generate and store project thumbnails
- [ ] Enforce ownership and Premium access
- [ ] Implement storage safeguards (per-user cap)
- [ ] Add project API tests

## Phase 7 — Performance Hardening

- [ ] Implement adaptive preview quality manager
- [ ] Verify worker cancellation and stale-render discard
- [ ] Profile effect rendering with common phone photos
- [ ] Ensure no React render loop is tied to pixel buffers
- [ ] Lazy-load heavy effect modules
- [ ] Add mobile fallback and touch handling
- [ ] Tune preview caps based on profiling

## Phase 8 — Quality and Release Readiness

- [x] Run all unit tests
- [x] Run type checks
- [x] Run lint
- [x] Run production build
- [ ] Run Playwright tests
- [ ] Run backend load test (k6 / Artillery)
- [ ] Resolve known issues
- [x] Update docs and todo status
- [ ] Provide release-readiness report
