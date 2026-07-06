# Performance

Tips for keeping EffectSoup rendering fast at every scale.

## Web Workers

EffectSoup runs all rendering in a Web Worker by default. This keeps the UI thread responsive during heavy computation. The worker handles crop, pipeline execution, and buffer creation — everything except canvas drawing and input decoding.

## Preview Resolution

While adjusting controls, the editor renders at a reduced preview resolution (`previewLongest`). This keeps the UI responsive even on large photos. Full-resolution rendering happens only when you export.

## Working Resolution

Per-pixel effects (dithering, halftone, ASCII) use `runAtWorkingResolution` — they downsample the source to a maximum longest edge (typically 800px), run the effect, then nearest-neighbor upscale back to the original size. This ensures consistent visual density and avoids O(width × height) cost on large images.

## Buffer Allocation

`PixelBuffer` uses `Uint8ClampedArray` — a typed array that is fast to allocate and transfer. When sending to a worker, the underlying `ArrayBuffer` is transferred (zero-copy). Avoid unnecessary clones: prefer in-place mutation when the source buffer is not needed afterward.

## Optimization Tips

- Downsample before running effects on very large images (the editor already does this for previews).
- Use nearest-neighbor upscale for pixel/dithered effects (preserves sharp edges).
- Avoid creating many intermediate buffers in hot loops — reuse where possible.
- The worker handles one job at a time; rapid slider changes cancel previous renders automatically.
- All core functions are synchronous and pure — they can be called from any context (main thread, worker, Node.js).

## See Also

- [Architecture](../concepts/architecture.md) — render flow and worker lifecycle
- [Editor Overview](../reference/editor-overview.md) — UI layout and compare toggle
- [Exporting Guide](exporting.md) — format and resolution options
