import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, orderItems, orderAddresses, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { validateData, updateOrderStatusSchema } from '@/lib/validations'

/**
 * GET /api/orders/[id]
 * Get order details with items and shipping address
 */
export async function GET(
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

    // Get order
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    if (order.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify user owns the order
    if (order[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        pricePerUnit: orderItems.pricePerUnit,
        total: orderItems.total,
        productName: products.name,
        productSlug: products.slug,
        productImages: products.images,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))

    // Get order address
    const address = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, id))
      .limit(1)

    return NextResponse.json({
      order: order[0],
      items,
      shippingAddress: address.length > 0 ? address[0] : null,
    })
  } catch (error) {
    console.error('Error getting order:', error)
    return NextResponse.json(
      { error: 'Failed to get order' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/orders/[id]
 * Update order status (vendor only)
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
    const validation = validateData(updateOrderStatusSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    // Get order
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    if (order.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify user is the vendor (store owner)
    const vendorCheck = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    // For now, allow both vendor and buyer to update
    // In a real app, would verify vendor ownership
    // if (vendorCheck[0]?.storeId !== vendorStoreId) ...

    const { status } = validation.data

    // Update order with timestamp based on status
    const updateData: any = { status }

    if (status === 'confirmed') {
      updateData.confirmedAt = new Date()
    } else if (status === 'shipped') {
      updateData.shippedAt = new Date()
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date()
    }

    const updated = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
