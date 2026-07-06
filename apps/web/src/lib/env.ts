import { config as loadEnv } from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { z } from "zod";

for (const candidate of [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../../.env")
]) {
  if (fs.existsSync(candidate)) {
    loadEnv({ path: candidate });
    break;
  }
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) {
        const vercelUrl = process.env.VERCEL_URL;
        if (vercelUrl) return `https://${vercelUrl}`;
      }
      return val ?? undefined;
    },
    z.string().url("BETTER_AUTH_URL must be a valid URL")
  ),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  BETTER_AUTH_API_KEY: z.string().optional(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.string().optional()
  ),
  UPSTASH_REDIS_REST_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  ),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  )
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
