# effectLab

Browser-based, non-AI image transformation studio. Upload a photo, choose a retro-digital aesthetic, adjust one Intensity slider, and export.

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **App:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **Image Engine:**
  - `@imageeffects/core` — pure TypeScript image-processing primitives
  - `@imageeffects/presets` — product preset definitions and pipelines
  - `@imageeffects/worker` — Web Worker communication layer
- **Auth:** Better Auth (Google OAuth + email/password)
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Payments:** Dodo Payments
- **Storage:** Cloudflare R2
- **Cache/Rate Limits:** Upstash Redis
- **Tests:** Vitest + Playwright

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and fill in required values.

3. Build internal packages:

   ```bash
   pnpm --filter @imageeffects/core build
   pnpm --filter @imageeffects/presets build
   pnpm --filter @imageeffects/worker build
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
DODO_API_KEY=
DODO_WEBHOOK_SECRET=
DODO_PREMIUM_PRODUCT_ID=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
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

## Database Migrations

```bash
pnpm --filter web db:generate
pnpm --filter web db:migrate
```

## Billing Local Test Setup

1. Create a Dodo Payments test account.
2. Create a subscription product for Premium.
3. Set `DODO_API_KEY`, `DODO_WEBHOOK_SECRET`, and `DODO_PREMIUM_PRODUCT_ID`.
4. Use the Dodo CLI or dashboard to send test webhooks to `/api/webhooks/dodo`.

## Architecture Summary

All image effects run in the user's browser. The backend handles auth, billing, project metadata, and storage orchestration. See `architecture.md` for detailed diagrams and scaling notes.
