import { Redis } from "@upstash/redis";
import { env } from "./env";

export const redis: Redis | null =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN
      })
    : null;

export async function getCachedEntitlement(userId: string): Promise<boolean | null> {
  if (!redis) return null;
  const value = await redis.get<boolean>(`entitlement:${userId}`);
  return value ?? null;
}

export async function setCachedEntitlement(userId: string, isPremium: boolean): Promise<void> {
  if (!redis) return;
  await redis.set(`entitlement:${userId}`, isPremium, { ex: 60 });
}
