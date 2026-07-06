# Editor Overview

Reference guide to the EffectSoup playground editor UI.

## Layout

| Region | Description |
|---|---|
| **Top toolbar** | Back to homepage, undo/redo/reset, replace/remove image, GitHub link, account/user button, and Export button |
| **Left sidebar** | Preset library showing all 24+ effects grouped by category. Click to apply |
| **Center preview** | Your image with the effect applied in real time. Below: compare toggle and crop controls |
| **Right panel** | Intensity slider and all advanced controls for the selected effect. Updates preview in real time |

## History & Undo

The editor maintains a history stack with up to 50 entries.

- **Undo** — navigates backward through crop, effect, and output state changes
- **Redo** — navigates forward
- **Reset** — clears all settings back to defaults (crop, effect, output)

## Compare

Toggle **Compare Before** to see your original (uncropped, uneffected) image alongside the processed result. Useful for evaluating how much an effect changes the photo.

## Mobile Layout

On smaller screens:
- The left preset sidebar is hidden by default
- Tap **Show library** at the bottom to reveal the preset grid as an overlay
- The right controls panel is hidden on narrow screens
- All editing flows through the main preview with the library drawer

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `Ctrl+K` / `Cmd+K` | Open search (docs only) |

## See Also

- [Quickstart](../getting-started/quickstart.md) — 5-minute walkthrough
- [Upload & Crop Guide](../guides/upload-and-crop.md) — image loading and viewport controls
- [Effect Controls Guide](../guides/effect-controls.md) — intensity and advanced controls
- [Exporting Guide](../guides/exporting.md) — format, quality, resolution
