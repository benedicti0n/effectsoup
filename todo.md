# effectLab — Implementation Todo

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

- [ ] Run all unit tests
- [ ] Run type checks
- [ ] Run lint
- [ ] Run production build
- [ ] Run Playwright tests
- [ ] Run backend load test (k6 / Artillery)
- [ ] Resolve known issues
- [ ] Update docs and todo status
- [ ] Provide release-readiness report
