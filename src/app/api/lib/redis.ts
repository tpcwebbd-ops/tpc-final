/*
|-----------------------------------------
| setting up redis.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { createClient } from "redis";

const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT ?? 6379);
const enabled = Boolean(host && process.env.REDIS_USERNAME && process.env.REDIS_PASSWORD);

const socket =
  port === 6380
    ? {
        host: host ?? "127.0.0.1",
        port,
        tls: true as const,
        reconnectStrategy: (retries: number) => (retries < 1 ? 100 : false),
      }
    : { host: host ?? "127.0.0.1", port, reconnectStrategy: (retries: number) => (retries < 1 ? 100 : false) };

const redis = enabled
  ? createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket,
    })
  : null;

redis?.on("error", () => undefined);
let connecting: Promise<void> | null = null;

async function getClient() {
  if (!redis) return null;
  if (redis.isOpen) return redis;
  if (!connecting)
    connecting = redis
      .connect()
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        connecting = null;
      });
  await connecting;
  return redis.isOpen ? redis : null;
}

// Shared counters are used for security controls that must work across Vercel
// function instances. `null` deliberately means Redis is not configured, so
// callers can fall back to a local development limiter instead of failing open.
export async function incrementCounter(key: string, ttlSeconds: number) {
  try {
    const client = await getClient();
    if (!client) return null;
    const count = await client.eval(
      "local count = redis.call('INCR', KEYS[1]); if count == 1 or redis.call('TTL', KEYS[1]) < 0 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; return count",
      { keys: [key], arguments: [String(Math.max(1, Math.ceil(ttlSeconds)))] },
    );
    return typeof count === "number" ? count : Number(count);
  } catch {
    return null;
  }
}

export async function getCache<T>(key: string) {
  try {
    const client = await getClient();
    const value = client ? await client.get(key) : null;
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 300) {
  try {
    const client = await getClient();
    if (client) await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    /* Database remains available if Redis is unavailable. */
  }
}

export async function invalidateDashboardCache(...keys: string[]) {
  try {
    const client = await getClient();
    if (client && keys.length) await client.del(keys);
  } catch {
    /* The following database read will repopulate cache. */
  }
}

export const redisKeys = {
  sidebars: "webapps:dashboard:sidebars",
  roles: "webapps:dashboard:roles",
  access: "webapps:dashboard:access",
};
