import { NextResponse } from 'next/server'
import { generateCsrfToken, setCsrfCookie } from '@/lib/csrf'

/**
 * GET /api/auth/csrf
 * Generate and return a CSRF token
 * This endpoint should be called before making any POST requests
 */
export async function GET() {
  const token = generateCsrfToken()

  const response = NextResponse.json({
    csrfToken: token,
  })

  // Set the token as a cookie
  setCsrfCookie(response, token)

  return response
}
