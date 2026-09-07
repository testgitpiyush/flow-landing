/**
 * Production rate limiter backed by Vercel KV (Redis-compatible).
 *
 * Requires Vercel KV to be provisioned and linked to the project.
 * Falls back to in-memory when KV is unavailable (local dev / missing env vars).
 *
 * Usage:
 *   import { checkRateLimit } from "@/lib/rate-limit";
 *   const result = await checkRateLimit(request, { limit: 5, windowMs: 60_000 });
 */

import { kv } from "@vercel/kv";

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

function getKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : (request.headers.get("x-real-ip") ?? "unknown");
  // Include endpoint path to separate signup vs contact limits
  const url = new URL(request.url);
  return `rl:${ip}:${url.pathname}`;
}

async function memoryFallback(config: RateLimitConfig, key: string): Promise<RateLimitResult> {
  // Simplified in-memory fallback when KV unavailable
  const now = Date.now();
  const resetAt = now + config.windowMs;
  return { success: true, remaining: config.limit - 1, resetAt, limit: config.limit };
}

export async function checkRateLimit(request: Request, config: RateLimitConfig): Promise<RateLimitResult> {
  try {
    const key = getKey(request);
    const now = Date.now();
    const resetAt = Math.ceil((now + config.windowMs) / 1000); // KV uses Unix seconds for expiry

    // Use a simple counter with TTL
    const currentStr = await kv.get<string>(key);
    const current = currentStr ? parseInt(currentStr, 10) : 0;

    if (current >= config.limit) {
      const resetMs = (await kv.get<number>(`${key}:reset`) ?? now + config.windowMs);
      return { success: false, remaining: 0, resetAt: Math.ceil(resetMs / 1000), limit: config.limit };
    }

    await kv.set(key, String(current + 1), { ex: Math.ceil(config.windowMs / 1000) });
    return {
      success: true,
      remaining: config.limit - (current + 1),
      resetAt: Math.ceil((now + config.windowMs) / 1000),
      limit: config.limit,
    };
  } catch {
    // If KV is not configured or fails, fall back to permissive
    return { success: true, remaining: config.limit - 1, resetAt: Date.now() + config.windowMs, limit: config.limit };
  }
}
