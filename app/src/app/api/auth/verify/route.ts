import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, userSessions } from '@/db/schema'
import { config } from '@/lib/config'
import { getAuthToken } from '@/lib/cookies'

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie first, fallback to Authorization header
    let token = getAuthToken(request)

    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if session exists and is not expired
    const sessionResult = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.token, token))
      .limit(1)

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 401 }
      )
    }

    const session = sessionResult[0]

    if (new Date() > session.expiresAt) {
      // Clean up expired session
      await db
        .delete(userSessions)
        .where(eq(userSessions.id, session.id))

      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    // Get user data
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const user = userResult[0]
    const { passwordHash: _, ...userData } = user

    return NextResponse.json({
      user: userData,
      token,
      message: 'Token is valid'
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
