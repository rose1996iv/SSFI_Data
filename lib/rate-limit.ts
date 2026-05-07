import { env } from "@/lib/env";

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + env.rateLimitWindowMs,
    });

    return {
      allowed: true,
      remaining: env.rateLimitMaxRequests - 1,
      resetAt: now + env.rateLimitWindowMs,
    };
  }

  if (existing.count >= env.rateLimitMaxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    remaining: env.rateLimitMaxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}
