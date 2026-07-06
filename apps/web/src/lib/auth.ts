import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "./env";
import { user, session, account, verification } from "./schema";

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET
  };
}

/**
 * Normalize an origin string. Strips paths, default ports, and trailing
 * whitespace. Returns null for empty/invalid input so a bad config value
 * silently drops instead of poisoning the allowlist.
 */
function normalizeOrigin(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const port = url.port;
    const isDefaultHttp = url.protocol === "http:" && (port === "" || port === "80");
    const isDefaultHttps = url.protocol === "https:" && (port === "" || port === "443");
    const host = isDefaultHttp || isDefaultHttps ? url.hostname : url.host;
    return `${url.protocol}//${host}`;
  } catch {
    return null;
  }
}

function collectTrustedOrigins(): string[] {
  const set = new Set<string>();
  const add = (value: string | undefined) => {
    const origin = normalizeOrigin(value ?? "");
    if (origin) set.add(origin);
  };
  add(env.BETTER_AUTH_URL);
  add(env.NEXT_PUBLIC_APP_URL);
  if (env.BETTER_AUTH_TRUSTED_ORIGINS) {
    for (const part of env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")) {
      add(part);
    }
  }
  // Local development fallbacks so the allowlist works on any dev port
  // without extra config.
  add("http://localhost:3000");
  add("http://127.0.0.1:3000");
  return Array.from(set);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedAuth: any = null;

export async function getAuth() {
  if (cachedAuth) return cachedAuth;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [];

  if (env.BETTER_AUTH_API_KEY) {
    const { dash } = await import("@better-auth/infra");
    plugins.push(dash({ apiKey: env.BETTER_AUTH_API_KEY }));
  }

  cachedAuth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user, session, account, verification }
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: collectTrustedOrigins(),
    plugins,
    socialProviders,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: false,
      autoSignIn: true
    },
    advanced: {
      useSecureCookies: env.BETTER_AUTH_URL.startsWith("https://"),
      defaultCookieAttributes: {
        sameSite: "lax",
        secure: env.BETTER_AUTH_URL.startsWith("https://"),
        httpOnly: true
      }
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 30
    },
    emailNormalization: {
      email: (email: string) => email.toLowerCase().trim()
    }
  });

  return cachedAuth;
}
