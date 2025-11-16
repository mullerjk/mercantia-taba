import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { stores, products } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

/**
 * GET /api/stores
 * Get all stores for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all stores for this user
    const userStores = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, userId))

    // Get product counts for each store
    const storesWithCounts = await Promise.all(
      userStores.map(async (store) => {
        const productCount = await db
          .select({ count: count() })
          .from(products)
          .where(and(
            eq(products.storeId, store.id),
            eq(products.isActive, true)
          ))

        return {
          ...store,
          productCount: productCount[0]?.count || 0,
        }
      })
    )

    return NextResponse.json(storesWithCounts)
  } catch (error) {
    console.error('Error getting stores:', error)
    return NextResponse.json(
      { error: 'Failed to get stores' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/stores
 * Create a new store for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, slug, description, email, phone, website, address, logoUrl, bannerUrl } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const existingStore = await db
      .select()
      .from(stores)
      .where(eq(stores.slug, slug))
      .limit(1)

    if (existingStore.length > 0) {
      return NextResponse.json(
        { error: 'Slug already in use' },
        { status: 400 }
      )
    }

    // Create the store
    const newStore = await db
      .insert(stores)
      .values({
        userId,
        name,
        slug,
        description: description || null,
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
        email: email || null,
        phone: phone || null,
        website: website || null,
        address: address || null,
        isActive: true,
      })
      .returning()

    return NextResponse.json(newStore[0], { status: 201 })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    )
  }
}
