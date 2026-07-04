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

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification }
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL],
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
