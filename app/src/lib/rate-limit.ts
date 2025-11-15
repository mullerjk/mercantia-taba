/**
 * Rate limiting utility
 * Simple in-memory rate limiter for development
 * Can be easily replaced with Redis-based solution for production
 */

interface RateLimitInfo {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// In production, replace with Redis or external service
const rateLimitStore = new Map<string, RateLimitInfo>()

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, info] of rateLimitStore.entries()) {
    if (info.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 10 * 60 * 1000)

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Custom message when rate limit is exceeded */
  message?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  // Disable rate limiting in test environment
  if (process.env.NODE_ENV === 'test') {
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      reset: Date.now() + config.windowMs,
    }
  }

  const now = Date.now()
  const key = identifier

  let info = rateLimitStore.get(key)

  // If no record exists or window has expired, create new one
  if (!info || info.resetTime < now) {
    info = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, info)

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: info.resetTime,
    }
  }

  // Increment count
  info.count++

  // Check if limit exceeded
  if (info.count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: info.resetTime,
      retryAfter: Math.ceil((info.resetTime - now) / 1000),
    }
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - info.count,
    reset: info.resetTime,
  }
}

/**
 * Get client identifier from request headers
 * Prioritizes: x-forwarded-for > x-real-ip > fallback
 */
export function getClientIdentifier(headers: Headers, fallback = 'unknown'): string {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Get first IP if multiple are present
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return fallback
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /** Very strict: 5 requests per minute (for auth endpoints) */
  AUTH: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many authentication attempts. Please try again later.',
  },
  /** Strict: 10 requests per minute */
  STRICT: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.',
  },
  /** Standard: 30 requests per minute */
  STANDARD: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  },
  /** Generous: 100 requests per minute */
  GENEROUS: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Rate limit exceeded.',
  },
} as const
