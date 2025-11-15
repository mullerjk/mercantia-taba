import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

/**
 * CSRF Protection
 * Uses Double Submit Cookie pattern for CSRF protection
 */

export const CSRF_CONFIG = {
  TOKEN_NAME: 'csrf_token',
  HEADER_NAME: 'x-csrf-token',
  COOKIE_NAME: 'csrf_token',
  TOKEN_LENGTH: 32,
  MAX_AGE: 24 * 60 * 60, // 24 hours in seconds
} as const

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('base64url')
}

/**
 * Set CSRF token as cookie
 */
export function setCsrfCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: CSRF_CONFIG.COOKIE_NAME,
    value: token,
    httpOnly: false, // Must be accessible by JavaScript to send in headers
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CSRF_CONFIG.MAX_AGE,
    path: '/',
  })

  return response
}

/**
 * Get CSRF token from cookie
 */
export function getCsrfTokenFromCookie(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_CONFIG.COOKIE_NAME)?.value
}

/**
 * Get CSRF token from request header
 */
export function getCsrfTokenFromHeader(request: NextRequest): string | undefined {
  return request.headers.get(CSRF_CONFIG.HEADER_NAME) || undefined
}

/**
 * Verify CSRF token
 * Compares token from cookie with token from header
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
  const method = request.method.toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true
  }

  const tokenFromCookie = getCsrfTokenFromCookie(request)
  const tokenFromHeader = getCsrfTokenFromHeader(request)

  // Both must exist and match
  if (!tokenFromCookie || !tokenFromHeader) {
    return false
  }

  // Use constant-time comparison to prevent timing attacks
  return timingSafeEqual(tokenFromCookie, tokenFromHeader)
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks by ensuring comparison always takes same time
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Apply CSRF protection to a route
 * Returns error response if CSRF check fails
 */
export function applyCsrfProtection(request: NextRequest): NextResponse | null {
  if (!verifyCsrfToken(request)) {
    return NextResponse.json(
      { error: 'CSRF token validation failed' },
      { status: 403 }
    )
  }

  return null
}

/**
 * Generate and set a new CSRF token
 * Should be called on login/register to establish CSRF protection
 */
export function initializeCsrfProtection(response: NextResponse): {
  response: NextResponse
  token: string
} {
  const token = generateCsrfToken()
  const updatedResponse = setCsrfCookie(response, token)

  return {
    response: updatedResponse,
    token,
  }
}
