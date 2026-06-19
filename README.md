# EffectSoup

A browser-only MVP for an image effects SaaS. Upload an image and transform it with beautiful, non-AI algorithmic effects.

## Effects

- Pixelate
- ASCII
- Ordered Dither
- Halftone
- Duotone
- Symbol Glow

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- zustand
- Canvas API

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

All image processing happens in the browser using the Canvas API. There is no backend, no authentication, and no AI APIs.

Upload an image, select an effect, adjust the sliders, pick a preset, and export the result as a PNG.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run typecheck` — run TypeScript checks
- `npm run lint` — run ESLint
