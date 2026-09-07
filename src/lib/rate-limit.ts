/**
 * Simple in-memory rate limiter for Vercel/serverless environments.
 *
 * IMPORTANT: In-memory rate limiting has limitations in serverless:
 * - Each serverless instance has its own memory, so limits don't share across instances.
 * - Works best for low-traffic apps or as a basic deterrent.
 *
 * For production at scale, consider Vercel KV (Redis), Upstash, or a dedicated API gateway.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60_000; // 1 minute

// Periodic cleanup to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

function getClientIP(request: Request): string {
  // Check common headers for the real client IP (Vercel adds these)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }
  // Fallback - not reliable in serverless but better than nothing
  return "unknown";
}

export interface RateLimitConfig {
  /** Max requests allowed within the window */
  limit: number;
  /** Window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/**
 * Simple fixed-window rate limiter.
 * Returns a result indicating whether the request is allowed and remaining quota.
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): RateLimitResult {
  const key = getClientIP(request);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // Start new window
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt,
      limit: config.limit,
    };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: config.limit,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
    limit: config.limit,
  };
}
