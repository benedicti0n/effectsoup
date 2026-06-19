# EffectSoup — MVP Features

## Overview
EffectSoup is a browser-only image effects tool. Users upload an image, apply non-AI algorithmic effects, adjust settings, choose presets, and export the result as a PNG. The MVP is focused, local-first, and requires no backend, authentication, or payment.

---

## MVP Features

### 1. Image Upload
- Upload an image via a hidden file input triggered by a UI button.
- Supported formats: PNG, JPG, WebP.
- Validate file type and reasonable file size.
- Load the image into an `HTMLImageElement` for canvas processing.

### 2. Canvas Preview
- Display the processed image in a responsive, centered canvas.
- Show a placeholder state before an image is uploaded.
- Maintain aspect ratio and fit within the preview area.
- Re-render the preview live when settings change.

### 3. Effect Selection
- A selectable list of effects in the sidebar.
- MVP effects:
  - **Pixelate**
  - **ASCII**
  - **Ordered Dither**
  - **Halftone**
  - **Duotone**
  - **Symbol Glow**
- Switching effects resets/adapts controls to the chosen effect.

### 4. Effect Parameter Controls
- Sliders and other controls for each effect.
- Controls update the preview immediately.
- Effect-specific settings are typed and scoped.

### 5. Presets
- A grid of preset cards that apply an effect and predefined settings.
- MVP presets:
  - Dream ASCII
  - Newspaper Dither
  - Dark Dot Poster
  - Pixel Anime
  - Soft Duotone
  - Symbol Glow Flower
- Selecting a preset updates the effect type and all related controls.

### 6. Export
- Export the processed canvas as a PNG.
- Trigger a download using `canvas.toDataURL("image/png")`.
- Filename defaults to `effectsoup-export.png`.

### 7. Dark, Premium UI
- Dark creative-tool aesthetic.
- Clean layout with a large canvas area and a compact sidebar.
- Built with Tailwind CSS and shadcn/ui components.

---

## Skipped in MVP

The following are intentionally excluded to keep the MVP focused and fast to build:

- **Backend / server-side rendering**
- **Authentication / user accounts**
- **Payment / subscriptions**
- **AI-based image generation or enhancement**
- **Cloud storage / saved projects**
- **Undo / redo history**
- **Batch processing / multiple images**
- **Custom user-defined presets**
- **Mobile-optimized layout** (desktop-first MVP)
- **Animations / transitions beyond basic UI feedback**
- **Image import via URL or drag-and-drop** (upload button only)
- **Non-PNG export formats**

---

## Future SaaS Features

Post-MVP features that can turn this into a paid SaaS product:

### Product
- User accounts and project persistence
- Cloud save / load projects
- Export history and reusable exports
- Custom preset creation, saving, and sharing
- Public preset gallery / community presets
- Batch export / bulk processing
- Higher-resolution export limits tied to plan tiers
- Video frame effects (short clips / GIF export)

### Monetization
- Free tier with limited exports
- Pro / team subscription plans
- One-time credit packs for exports
- Affiliate / marketplace for artist presets

### Platform
- Backend API for account and project storage
- Server-side rendering for preset galleries and landing pages
- Social sharing and embeddable previews
- Plugin / SDK for third-party effects
- Mobile-responsive PWA

### Effects & Tools
- Additional algorithmic effects (edge detection, blur, noise, glitch, posterize, channel shift)
- Layering and compositing multiple effects
- Masking / selective effect application
- Custom shader-based WebGL effects
- Real-time performance optimizations
