import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, userSessions } from '@/db/schema'
import { config } from '@/lib/config'
import { validateData, loginSchema } from '@/lib/validations'
import { applyRateLimit, addRateLimitHeaders } from '@/lib/middleware/rate-limit-middleware'
import { RateLimitPresets } from '@/lib/rate-limit'
import { setAuthCookie } from '@/lib/cookies'
import { initializeCsrfProtection } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 requests per minute for auth)
    const { response: rateLimitResponse, result: rateLimitResult } = applyRateLimit(
      request,
      RateLimitPresets.AUTH
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()

    // Validate input with Zod
    const validation = validateData(loginSchema, body)
    if (!validation.success) {
      return validation.error
    }

    const { email, password } = validation.data

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = userResult[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.insert(userSessions).values({
      userId: user.id,
      token,
      expiresAt,
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'unknown',
    })

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id))

    // Return user data (without password hash)
    const { passwordHash: _, ...userData } = user

    let response = NextResponse.json({
      user: userData,
      token, // Still return token for backward compatibility (can be removed later)
      message: 'Login successful'
    })

    // Set auth token as httpOnly cookie
    response = setAuthCookie(response, token)

    // Initialize CSRF protection
    const { response: csrfResponse, token: csrfToken } = initializeCsrfProtection(response)
    response = csrfResponse

    // Add CSRF token to response body for client-side storage
    const responseBody = await response.json()
    response = NextResponse.json({
      ...responseBody,
      csrfToken,
    })

    // Re-apply cookies after modifying response
    response = setAuthCookie(response, token)
    const { response: finalResponse } = initializeCsrfProtection(response)

    // Add rate limit headers to response
    return addRateLimitHeaders(finalResponse, rateLimitResult)

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
