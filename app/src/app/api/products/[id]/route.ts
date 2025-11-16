import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { products, stores } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { validateData, updateProductSchema } from '@/lib/validations'

/**
 * GET /api/products/[id]
 * Get product details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db
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
      .where(eq(products.id, id))
      .limit(1)

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product[0])
  } catch (error) {
    console.error('Error getting product:', error)
    return NextResponse.json(
      { error: 'Failed to get product' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/products/[id]
 * Update product details (requires authorization as store owner)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validation = validateData(updateProductSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    // Verify product exists and user owns the store
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const store = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, product[0].storeId), eq(stores.userId, userId)))
      .limit(1)

    if (store.length === 0) {
      return NextResponse.json(
        { error: 'Not authorized to update this product' },
        { status: 403 }
      )
    }

    // Build update data, filtering images if present
    const updateData: any = {}

    for (const [key, value] of Object.entries(validation.data)) {
      if (key === 'images' && Array.isArray(value)) {
        // Filter and remap images to ensure url is present
        const filtered = value
          .filter((img: any) => img.url)
          .map((img: any) => ({ url: img.url, alt: img.alt }))
        if (filtered.length > 0 || value.length === 0) {
          updateData[key] = filtered
        }
      } else if (value !== undefined) {
        updateData[key] = value
      }
    }

    // Update product
    const updated = await db
      .update(products)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product (requires authorization as store owner)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify product exists and user owns the store
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const store = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, product[0].storeId), eq(stores.userId, userId)))
      .limit(1)

    if (store.length === 0) {
      return NextResponse.json(
        { error: 'Not authorized to delete this product' },
        { status: 403 }
      )
    }

    // Delete product
    await db.delete(products).where(eq(products.id, id))

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
