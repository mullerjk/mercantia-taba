import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  getClientIdentifier,
  RateLimitConfig,
  RateLimitResult,
} from '@/lib/rate-limit'

/**
 * Apply rate limiting to an API route handler
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limited, null if allowed
 */
export function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { response: NextResponse | null; result: RateLimitResult } {
  const identifier = getClientIdentifier(request.headers)
  const result = checkRateLimit(identifier, config)

  if (!result.success) {
    const response = NextResponse.json(
      {
        error: config.message || 'Too many requests',
        retryAfter: result.retryAfter,
      },
      { status: 429 }
    )

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())
    if (result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString())
    }

    return { response, result }
  }

  return { response: null, result }
}

/**
 * Add rate limit headers to a successful response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())
  return response
}
