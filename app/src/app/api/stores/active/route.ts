import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { stores } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

/**
 * GET /api/stores/active
 * Get all active stores for the public marketplace
 */
export async function GET(request: NextRequest) {
  try {
    const limit = 12 // Show up to 12 stores

    const activeStores = await db
      .select()
      .from(stores)
      .where(eq(stores.isActive, true))
      .orderBy(desc(stores.rating), desc(stores.createdAt))
      .limit(limit)

    return NextResponse.json(activeStores)
  } catch (error) {
    console.error('Error getting active stores:', error)
    return NextResponse.json(
      { error: 'Failed to get active stores' },
      { status: 500 }
    )
  }
}
