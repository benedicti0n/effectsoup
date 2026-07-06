# EffectSoup

> Beautiful image effects, made in your browser.

EffectSoup is a free, browser-based image effects studio. Pick from 25+
curated presets — pixel grids, halftones, ASCII art, glowing symbols,
cinematic bloom, glitch, CRT, and graphic-print looks — then export to
PNG, JPEG, or WebP. Every pixel is processed in a Web Worker on your
device; no uploads, no AI, no signup required.

**→ [Try the Playground](https://effectsoup-web.vercel.app/playground)**
**→ [Read the Docs](https://effectsoup-web.vercel.app/docs)**

## Packages

| Package | Description |
|---|---|
| [`@effectsoup/core`](./packages/effectsCore) | Pure TypeScript image-processing primitives |
| [`@effectsoup/presets`](./packages/effectsPresets) | Effect presets with Intensity mapping and advanced controls |
| [`@effectsoup/worker`](./packages/effectsWorker) | Web Worker client for off-thread rendering |
| [`@effectsoup/effectsoup`](./packages/effectsoup) | All-in-one meta-package |

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **App:** Next.js 15 App Router (RSC), React 19, TypeScript, Tailwind CSS
- **Image Engine:** Pure TypeScript — no WebGL, no WASM, no AI
- **Auth:** Better Auth (Google OAuth + email/password)
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Cache/Rate Limits:** Upstash Redis
- **Tests:** Vitest + Playwright

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the required values.

3. Build internal packages:

   ```bash
   pnpm build
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```text
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm typecheck    # Type check all packages
pnpm lint         # Lint all packages
pnpm test         # Run unit tests
pnpm test:e2e     # Run Playwright tests (requires dev server)
pnpm format       # Format with Prettier
```

## Key Routes

- `/` — Marketing homepage with interactive mini-playground
- `/playground` — Full image editor workspace
- `/docs` — Documentation hub
- `/account` — User account

## Architecture

All image effects run in the user's browser via a Web Worker. The backend
handles authentication only. See the [Architecture guide](https://effectsoup-web.vercel.app/docs/guides/architecture)
for details.

## License

MIT
