import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { stores } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * GET /api/stores/[id]
 * Get a specific store (only if user owns it)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, id))
      .limit(1)

    if (store.length === 0) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Verify user owns this store if authenticated
    if (userId && store[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(store[0])
  } catch (error) {
    console.error('Error getting store:', error)
    return NextResponse.json(
      { error: 'Failed to get store' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/stores/[id]
 * Update a store (only if user owns it)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user owns this store
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, id))
      .limit(1)

    if (store.length === 0) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    if (store[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, email, phone, website, address, logoUrl, bannerUrl, isActive } = body

    // Update the store
    const updated = await db
      .update(stores)
      .set({
        name: name !== undefined ? name : store[0].name,
        description: description !== undefined ? description : store[0].description,
        email: email !== undefined ? email : store[0].email,
        phone: phone !== undefined ? phone : store[0].phone,
        website: website !== undefined ? website : store[0].website,
        address: address !== undefined ? address : store[0].address,
        logoUrl: logoUrl !== undefined ? logoUrl : store[0].logoUrl,
        bannerUrl: bannerUrl !== undefined ? bannerUrl : store[0].bannerUrl,
        isActive: isActive !== undefined ? isActive : store[0].isActive,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, id))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/stores/[id]
 * Delete a store (only if user owns it and has no products)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user owns this store
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, id))
      .limit(1)

    if (store.length === 0) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    if (store[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the store (cascade will handle products)
    await db.delete(stores).where(eq(stores.id, id))

    return NextResponse.json({ success: true, message: 'Store deleted' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}
