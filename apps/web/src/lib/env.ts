import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default(""),
  BETTER_AUTH_SECRET: z.string().default("build-time-placeholder-not-for-production-use-a-real-secret"),
  BETTER_AUTH_URL: z.preprocess(
    (val) => {
      if (val === "" || val === undefined) {
        const vercelUrl = process.env.VERCEL_URL;
        if (vercelUrl) return `https://${vercelUrl}`;
      }
      return val;
    },
    z.string().url().default("http://localhost:3000")
  ),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  ),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  )
});

export const env = envSchema.parse(process.env);
