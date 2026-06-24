# effectLab — Performance Plan

## Performance Budget

| Area | Target |
|------|--------|
| Editor usable after route open | < 3 s on normal broadband |
| Initial preview after common mobile upload | < 1 s |
| Standard preset switch | < 250 ms at preview resolution |
| Slider interaction | visually responsive, 30–60 FPS typical |
| Final dither/ASCII preview | < 500 ms on modern laptop |
| Undo/redo configuration changes | < 100 ms where cached |
| Normal backend image-processing work | zero |
| 1,000 concurrent active editors | no shared rendering bottleneck |

## Preview Resolution Policy

- **Desktop preview:** longest side capped at 1400px.
- **Mobile / constrained devices:** longest side capped at 960px.
- **Performance adaptation:** if renders repeatedly exceed budget, lower preview resolution in 25% steps until target is met.
- **Final export:** always uses original or requested output resolution; preview quality reductions never affect export.

## Worker / Cancellation Strategy

- A single dedicated Web Worker handles all CPU-heavy effect pipelines.
- Each render request carries a monotonically increasing `renderVersion`.
- The worker aborts or discards stale in-flight work when a newer version arrives.
- The main thread ignores any completed result whose version is lower than the latest requested version.
- No unbounded render queue: only the most recent pending job is retained.

## Caching Strategy

Cache layers in the worker:

1. **Source decoded bitmap** — persists until new image uploaded.
2. **Preview-size buffer** — recomputed only when source changes or preview cap changes.
3. **Crop result** — reused when only effect parameters change.
4. **Palette analysis** — cached per source/preview.
5. **ASCII glyph atlas** — generated once per font/size.
6. **Intermediate buffers** — reused when the upstream stage is unchanged.

Use transferable objects to move large buffers between main thread and worker without copying.

## Known Expensive Operations

| Operation | Cost | Mitigation |
|-----------|------|------------|
| Floyd–Steinberg dither | O(n) but serial | run in worker, preview at reduced resolution |
| ASCII render | text measurement + fill per glyph | cached atlas, preview downsample |
| Halftone dot sampling | per-tile brightness | preview downsample, avoid per-pixel sqrt |
| Blur/bloom | convolution | possibly GPU via WebGL2; Canvas 2D fallback |
| Palette reduction | per-pixel distance | k-means on reduced sample, cache palette |

## Automatic Quality Adaptation

A lightweight `QualityManager` observes render duration:

- Maintains a rolling average of recent render times.
- If average exceeds 2× budget for 3 consecutive frames:
  - Reduce preview longest side by one step (e.g., 1400 → 1050).
  - Reduce expensive quality knobs (e.g., dither iterations, ASCII density).
- If average stays below 0.5× budget for 5 frames:
  - Optionally restore one quality step.
- Display no intrusive warning; keep UI responsive.

## Browser Profiling Checklist

- [ ] Use Chrome DevTools Performance tab while dragging Intensity.
- [ ] Confirm main thread is not blocked by pixel loops.
- [ ] Measure worker message round-trip time.
- [ ] Verify no memory leaks from object URLs or ImageBitmaps.
- [ ] Test on a mid-range Android device.
- [ ] Test with a 12 MP portrait photo.

## Test Commands

```bash
# Unit tests
pnpm test

# Type check
pnpm typecheck

# Production build
pnpm build

# Playwright e2e
pnpm test:e2e

# Load test backend
pnpm loadtest
```

## Rollout Metrics to Monitor

- First Contentful Paint on `/` and `/editor`
- Time to first preview after upload
- 95th percentile render duration by preset
- Worker cancellation rate
- Entitlement endpoint latency
- Checkout conversion rate
- Webhook failure rate
- Sentry error volume by route
