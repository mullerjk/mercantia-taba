import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { products, stores } from '@/db/schema'
import { eq, and, desc, asc, gte, lte, like } from 'drizzle-orm'

/**
 * GET /api/stores/[id]/products
 * Get all products from a specific store
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'newest'

    // Build filters
    const filters: any[] = [
      eq(products.isActive, true),
      eq(products.storeId, id),
    ]

    if (search) {
      filters.push(like(products.name, `%${search}%`))
    }

    if (category) {
      filters.push(eq(products.category, category))
    }

    // Determine sort order
    let orderBy: any = desc(products.createdAt)
    if (sortBy === 'price-asc') {
      orderBy = asc(products.price)
    } else if (sortBy === 'price-desc') {
      orderBy = desc(products.price)
    } else if (sortBy === 'rating') {
      orderBy = desc(products.rating)
    }

    // Get store info
    const storeInfo = await db
      .select()
      .from(stores)
      .where(eq(stores.id, id))
      .limit(1)

    if (storeInfo.length === 0) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Get products
    const productList = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        currency: products.currency,
        sku: products.sku,
        images: products.images,
        inventory: products.inventory,
        category: products.category,
        tags: products.tags,
        rating: products.rating,
        reviewCount: products.reviewCount,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        // Store information
        storeId: stores.id,
        storeName: stores.name,
        storeSlug: stores.slug,
        storeDescription: stores.description,
        storeLogoUrl: stores.logoUrl,
        storeRating: stores.rating,
        storeReviewCount: stores.reviewCount,
        storeEmail: stores.email,
        storePhone: stores.phone,
        storeWebsite: stores.website,
        storeIsVerified: stores.isVerified,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(and(...filters))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count
    const countResult = await db
      .select({ count: products.id })
      .from(products)
      .where(and(...filters))

    const total = countResult.length

    return NextResponse.json({
      store: storeInfo[0],
      products: productList,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error getting store products:', error)
    return NextResponse.json(
      { error: 'Failed to get store products' },
      { status: 500 }
    )
  }
}
