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
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().default("/"),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().default("/"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  ),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
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
