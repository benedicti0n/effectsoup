# EffectSoup

> Beautiful image effects, made in your browser.

EffectSoup is a free, browser-based image effects studio. Pick from 25+
curated presets — pixel grids, halftones, ASCII art, glowing symbols,
cinematic bloom, glitch, CRT, and graphic-print looks — then export to
PNG, JPEG, or WebP. Every pixel is processed in a Web Worker on your
device; no uploads, no AI, no signup required.

Built with the Cohere design system and designed for instant
interaction: crop, pan, and adjust the Intensity slider with live
preview.

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **App:** Next.js 15 App Router (RSC), React 19, TypeScript, Tailwind CSS
- **Image Engine:**
  - `@effectsoup/core` — pure TypeScript image-processing primitives
  - `@effectsoup/presets` — product preset definitions and pipelines
  - `@effectsoup/worker` — Web Worker communication layer
- **Auth:** Better Auth (Google OAuth + email/password)
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Cache/Rate Limits:** Upstash Redis
- **SEO:** `app/robots.ts`, `app/sitemap.ts`, JSON-LD structured data,
  OpenGraph + Twitter cards, per-page metadata, `manifest.webmanifest`
- **Tests:** Vitest + Playwright

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the required values.

3. Build internal packages:

   ```bash
   pnpm --filter @effectsoup/core build
   pnpm --filter @effectsoup/presets build
   pnpm --filter @effectsoup/worker build
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Required for local development:

```text
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Optional depending on features:

```text
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
BETTER_AUTH_TRUSTED_ORIGINS=
```

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm typecheck    # Type check all packages
pnpm lint         # Lint all packages
pnpm test         # Run unit tests
pnpm test:e2e     # Run Playwright tests (requires dev server)
pnpm loadtest     # Run k6 backend load test (requires k6 and dev server)
pnpm format       # Format with Prettier
```

## Key Routes

- `/` — Marketing homepage with interactive mini-playground
- `/playground` — Full image editor workspace
- `/docs` — Documentation shell
- `/account` — User account

## Architecture Summary

All image effects run in the user's browser. The backend handles auth
only. See `architecture.md` for detailed diagrams and scaling notes.

See `dream-glow.md` for an in-depth walk-through of the most cinematic
preset — useful when feeding context to an LLM.
