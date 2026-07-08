# EffectSoup 🥣

> Beautiful image effects, made in your browser.

EffectSoup is a browser-based image effects engine. Upload a photo, pick from 25+ deterministic presets, and export — every pixel is processed in a Web Worker on your device. No AI, no uploads to a server, no sign-up required to edit.

**→ [Try the Playground](https://effectsoup.com/playground)**  
**→ [Read the Docs](https://effectsoup.com/docs)**  
**→ [X / Twitter](https://x.com/asheshtwt)**

---

## Features

### 25+ Presets

Pixel grid, halftone, ASCII art, duotone, CRT glitch, dream glow, stipple print, error diffusion dither, ordered dither, LED matrix, noir grain, pencil grain, blocks ASCII, dense ASCII, classic ASCII, dot halftone, and more. Each one is a deterministic mathematical pipeline — same input, same settings, same output.

### Privacy First

Your image never leaves your device. The flow is: file → canvas → Web Worker → export. Zero image data is sent to any server.

### Real-time Preview

Adjust intensity and parameters while seeing results instantly. The editor renders at preview resolution during tweaks and switches to full-resolution only on export.

### Export Everywhere

PNG, JPEG, or WebP up to 4K resolution. Crop before applying effects. Full-resolution rendering on export keeps the preview fast.

### npm Packages

The same core pipeline is available as pure TypeScript with zero browser dependencies:

```bash
pnpm add @effectsoup/core
```

Or use all presets:

```bash
pnpm add @effectsoup/presets
```

Works in Node, Deno, React, Next.js, or plain HTML.

---

## Packages

| Package | Description |
|---|---|
| [`@effectsoup/core`](./packages/effectsCore) | Pure TypeScript image-processing primitives |
| [`@effectsoup/presets`](./packages/effectsPresets) | Effect presets with intensity mapping and advanced controls |
| [`@effectsoup/worker`](./packages/effectsWorker) | Web Worker client for off-thread rendering |
| [`@effectsoup/effectsoup`](./packages/effectsoup) | All-in-one meta-package |

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **App:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **Image Engine:** Pure TypeScript — no WebGL, no WASM, no AI
- **Auth:** Clerk
- **Hosting:** Vercel
- **Tests:** Vitest + Playwright

## Local Setup

```bash
pnpm install
pnpm build
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Type check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright tests |
| `pnpm format` | Format with Prettier |

## Architecture

All image effects run in a Web Worker in the browser. The backend handles authentication only. See the [Architecture guide](https://effectsoup.com/docs/guides/architecture) for details.

## License

MIT
