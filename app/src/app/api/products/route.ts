import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { products, stores } from '@/db/schema'
import { eq, like, and, gte, lte, desc, asc } from 'drizzle-orm'
import { validateData, validateQueryParams, productFilterSchema, createProductSchema } from '@/lib/validations'

/**
 * GET /api/products
 * List all active products with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Validate query parameters
    const validation = validateQueryParams(productFilterSchema, searchParams)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    const { search, category, minPrice, maxPrice, sortBy, limit, offset } = validation.data

    // Build query filters
    const filters: any[] = [eq(products.isActive, true)]

    if (search) {
      // First try to match by slug, then by name
      filters.push(
        like(products.slug, `%${search}%`)
      )
    }

    if (category) {
      filters.push(eq(products.category, category))
    }

    if (minPrice !== undefined) {
      filters.push(gte(products.price, minPrice))
    }

    if (maxPrice !== undefined) {
      filters.push(lte(products.price, maxPrice))
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

    // Query products with store information
    const result = await db
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

    // Get total count for pagination
    const countResult = await db
      .select({ count: products.id })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(and(...filters))

    const total = countResult.length

    return NextResponse.json({
      data: result,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error listing products:', error)
    return NextResponse.json(
      { error: 'Failed to list products' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products
 * Create a new product (requires authentication as store owner)
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = validateData(createProductSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    let { storeId, name, slug, description, price, cost, currency, sku, images, inventory, category, tags } = validation.data

    // Filter images to ensure all have valid urls
    if (Array.isArray(images)) {
      images = images
        .filter((img: any) => img.url)
        .map((img: any) => ({ url: img.url, alt: img.alt }))
    }

    // Verify the store belongs to the user
    const store = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, storeId), eq(stores.userId, userId)))
      .limit(1)

    if (store.length === 0) {
      return NextResponse.json(
        { error: 'Store not found or not authorized' },
        { status: 403 }
      )
    }

    // Create the product
    const newProduct = await db
      .insert(products)
      .values({
        storeId,
        name,
        slug,
        description: description || null,
        price,
        cost: cost || null,
        currency,
        sku: sku || null,
        images: images as { url: string; alt?: string }[],
        inventory: inventory || 0,
        category: category || null,
        tags: tags || [],
      })
      .returning()

    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
