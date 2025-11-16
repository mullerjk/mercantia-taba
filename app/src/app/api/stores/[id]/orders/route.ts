import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, orderItems, products } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

/**
 * GET /api/stores/[id]/orders
 * Get all orders for a specific store (only if user owns the store)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0') || 0

    // Get store to verify user owns it
    const storeCheck = await db
      .select()
      .from(orders)
      .where(eq(orders.storeId, id))
      .limit(1)

    // Build filters
    const filters: any[] = [eq(orders.storeId, id)]
    if (status) {
      filters.push(eq(orders.status, status))
    }

    // Get store orders
    const storeOrders = await db
      .select()
      .from(orders)
      .where(and(...filters))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const countResult = await db
      .select({ count: orders.id })
      .from(orders)
      .where(and(...filters))

    const total = countResult.length

    // For each order, get the order items
    const ordersWithItems = await Promise.all(
      storeOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            pricePerUnit: orderItems.pricePerUnit,
            total: orderItems.total,
            productName: products.name,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id))

        return {
          ...order,
          items,
        }
      })
    )

    return NextResponse.json({
      orders: ordersWithItems,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error getting store orders:', error)
    return NextResponse.json(
      { error: 'Failed to get store orders' },
      { status: 500 }
    )
  }
}
