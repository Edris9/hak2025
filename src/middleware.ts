/**
 * Next.js Edge Middleware
 *
 * Runs on the Edge runtime for fast, global request processing.
 * Handles:
 * - IP-based rate limiting for AI endpoints
 * - Security headers
 *
 * Note: This runs before API routes, providing first-line defense.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limit store for Edge runtime
 * Note: This is per-edge-instance, not global. For production,
 * use a distributed store like Redis or Vercel KV.
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit configuration
 */
const RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 30, // 30 requests per minute per IP
};

/**
 * AI API routes that should be rate limited
 */
const AI_ROUTES = ['/api/chat', '/api/ai'];

/**
 * Check if path matches any AI route
 */
function isAIRoute(pathname: string): boolean {
  return AI_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Extract client IP from request
 */
function getClientIP(request: NextRequest): string {
  // Vercel/Cloudflare headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Cloudflare specific
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP.trim();
  }

  return 'unknown';
}

/**
 * Check rate limit for IP
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const key = `ip:${ip}`;

  // Get existing entry
  const entry = rateLimitStore.get(key);

  // If no entry or expired, create new one
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1, retryAfter: 0 };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  // Check if over limit
  const remaining = Math.max(0, RATE_LIMIT.maxRequests - entry.count);
  const allowed = entry.count <= RATE_LIMIT.maxRequests;
  const retryAfter = allowed ? 0 : Math.ceil((entry.resetAt - now) / 1000);

  return { allowed, remaining, retryAfter };
}

/**
 * Cleanup expired entries (runs occasionally)
 */
function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Only rate limit AI routes
  if (isAIRoute(pathname)) {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip);

    // Return 429 if rate limited
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please slow down.',
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT.maxRequests));

    // Occasionally cleanup (1% chance per request)
    if (Math.random() < 0.01) {
      cleanupExpired();
    }

    return response;
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

/**
 * Configure which paths the middleware runs on
 */
export const config = {
  matcher: [
    // Match API routes
    '/api/:path*',
    // Match pages but not static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
