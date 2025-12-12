/**
 * Rate Limiting
 *
 * In-memory rate limiter for API endpoints.
 * Provides per-IP and per-user rate limiting with sliding window.
 *
 * For production with multiple instances, replace with Redis-based implementation.
 */

import { AIModality } from '../../services/ai/types/modalities';

/**
 * Rate limit configuration per modality
 */
export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests per window */
  maxRequests: number;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** Seconds until limit resets */
  resetIn: number;
  /** Seconds to wait before retry (if blocked) */
  retryAfter: number;
}

/**
 * Rate limit entry stored per key
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Rate limit configurations by modality
 */
export const RATE_LIMITS = {
  // IP-based limits (for unauthenticated users)
  ip: {
    'text-chat': { windowMs: 60000, maxRequests: 30 }, // 30/min
    'image-generation': { windowMs: 60000, maxRequests: 10 }, // 10/min
    'text-to-speech': { windowMs: 60000, maxRequests: 20 }, // 20/min
  } as Record<AIModality, RateLimitConfig>,

  // User-based limits (for authenticated users - higher limits)
  user: {
    'text-chat': { windowMs: 60000, maxRequests: 60 }, // 60/min
    'image-generation': { windowMs: 60000, maxRequests: 20 }, // 20/min
    'text-to-speech': { windowMs: 60000, maxRequests: 40 }, // 40/min
  } as Record<AIModality, RateLimitConfig>,

  // Global limits (fallback)
  global: {
    windowMs: 60000,
    maxRequests: 30,
  },
};

/**
 * In-memory rate limit store
 */
class InMemoryRateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup every minute to remove expired entries
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Get current count for a key
   */
  get(key: string): RateLimitEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.resetAt) {
      this.store.delete(key);
      return null;
    }

    return entry;
  }

  /**
   * Increment count for a key
   */
  increment(key: string, windowMs: number): RateLimitEntry {
    const now = Date.now();
    const existing = this.get(key);

    if (existing) {
      existing.count++;
      this.store.set(key, existing);
      return existing;
    }

    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    this.store.set(key, entry);
    return entry;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all entries (for testing)
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton store instance
const store = new InMemoryRateLimitStore();

/**
 * Check rate limit for a given key
 */
function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const entry = store.increment(key, config.windowMs);
  const now = Date.now();

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.ceil((entry.resetAt - now) / 1000);
  const retryAfter = allowed ? 0 : resetIn;

  return {
    allowed,
    remaining,
    resetIn,
    retryAfter,
  };
}

/**
 * Rate limit by IP address
 *
 * @param ip - Client IP address
 * @param modality - AI modality (text-chat, image-generation, text-to-speech)
 * @returns Rate limit result
 */
export function rateLimitByIP(
  ip: string,
  modality: AIModality = 'text-chat'
): RateLimitResult {
  const config = RATE_LIMITS.ip[modality] || RATE_LIMITS.global;
  const key = `ip:${modality}:${ip}`;
  return checkRateLimit(key, config);
}

/**
 * Rate limit by user ID
 *
 * @param userId - Authenticated user ID
 * @param modality - AI modality
 * @returns Rate limit result
 */
export function rateLimitByUser(
  userId: string,
  modality: AIModality = 'text-chat'
): RateLimitResult {
  const config = RATE_LIMITS.user[modality] || RATE_LIMITS.global;
  const key = `user:${modality}:${userId}`;
  return checkRateLimit(key, config);
}

/**
 * Rate limit by custom key with custom config
 */
export function rateLimitCustom(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  return checkRateLimit(key, config);
}

/**
 * Extract client IP from request headers
 * Handles proxies (x-forwarded-for, x-real-ip)
 */
export function extractClientIP(request: Request): string {
  // Check for forwarded IP (from proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take the first IP in the chain (original client)
    const firstIP = forwarded.split(',')[0]?.trim();
    if (firstIP) return firstIP;
  }

  // Check for real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();

  // Fallback to unknown
  return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetIn),
  };

  if (!result.allowed) {
    headers['Retry-After'] = String(result.retryAfter);
  }

  return headers;
}

/**
 * Reset rate limit store (for testing)
 */
export function resetRateLimitStore(): void {
  store.clear();
}
