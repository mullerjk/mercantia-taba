import { NextResponse } from 'next/server'
import { config } from './config'

/**
 * Cookie configuration
 */
export const COOKIE_CONFIG = {
  TOKEN_NAME: 'auth_token',
  MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
  PATH: '/',
  SAME_SITE: 'lax' as const,
  SECURE: config.isProduction, // Only secure in production (HTTPS)
  HTTP_ONLY: true,
} as const

/**
 * Set authentication token as httpOnly cookie
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: COOKIE_CONFIG.TOKEN_NAME,
    value: token,
    httpOnly: COOKIE_CONFIG.HTTP_ONLY,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    maxAge: COOKIE_CONFIG.MAX_AGE,
    path: COOKIE_CONFIG.PATH,
  })

  return response
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_CONFIG.TOKEN_NAME,
    value: '',
    httpOnly: COOKIE_CONFIG.HTTP_ONLY,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    maxAge: 0,
    path: COOKIE_CONFIG.PATH,
  })

  return response
}

/**
 * Get authentication token from cookies
 */
export function getAuthToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined

  // Parse cookie header
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [name, ...rest] = cookie.trim().split('=')
      return [name, rest.join('=')]
    })
  )

  return cookies[COOKIE_CONFIG.TOKEN_NAME]
}
