import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, userSessions } from '@/db/schema'
import { config } from '@/lib/config'
import { validateData, registerSchema } from '@/lib/validations'
import { applyRateLimit, addRateLimitHeaders } from '@/lib/middleware/rate-limit-middleware'
import { RateLimitPresets } from '@/lib/rate-limit'
import { setAuthCookie } from '@/lib/cookies'

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
    const validation = validateData(registerSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    const { email, password, fullName } = validation.data

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        fullName: fullName || null,
        emailVerified: false,
        role: 'user',
      })
      .returning()

    // Create JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.insert(userSessions).values({
      userId: newUser.id,
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
      .where(eq(users.id, newUser.id))

    // Return user data (without password hash)
    const { passwordHash: _, ...userData } = newUser

    // Generate CSRF token
    const csrfToken = (await import('@/lib/csrf')).generateCsrfToken()

    const response = NextResponse.json({
      user: userData,
      token, // Still return token for backward compatibility (can be removed later)
      message: 'User registered successfully',
      csrfToken,
    })

    // Set auth token as httpOnly cookie
    setAuthCookie(response, token)

    // Set CSRF token as cookie
    response.cookies.set({
      name: 'csrf_token',
      value: csrfToken,
      httpOnly: false, // Must be accessible by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    // Add rate limit headers to response
    return addRateLimitHeaders(response, rateLimitResult)

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
