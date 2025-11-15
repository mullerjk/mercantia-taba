import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { userSessions } from '@/db/schema'
import { getAuthToken, clearAuthCookie } from '@/lib/cookies'

export async function POST(request: NextRequest) {
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

    // Delete the session from database
    await db
      .delete(userSessions)
      .where(eq(userSessions.token, token))

    let response = NextResponse.json({
      message: 'Logged out successfully'
    })

    // Clear the auth cookie
    response = clearAuthCookie(response)

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
