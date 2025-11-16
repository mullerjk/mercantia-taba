import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, orderItems, orderAddresses, cartItems, carts, products, shippingAddresses } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { validateData, createOrderSchema, paginationSchema } from '@/lib/validations'

/**
 * GET /api/orders
 * Get user's orders
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

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0') || 0

    // Get user's orders
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .limit(limit)
      .offset(offset)

    // Get total count
    const countResult = await db
      .select({ count: orders.id })
      .from(orders)
      .where(eq(orders.userId, userId))

    const total = countResult.length

    return NextResponse.json({
      data: userOrders,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error getting orders:', error)
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders
 * Create a new order from cart
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

    // Validate request body
    const validation = validateData(createOrderSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    const { shippingAddressId, notes } = validation.data

    // Get user's cart
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1)

    if (cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    // Get cart items
    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        pricePerUnit: cartItems.pricePerUnit,
      })
      .from(cartItems)
      .where(eq(cartItems.cartId, cart[0].id))

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Get shipping address
    const address = await db
      .select()
      .from(shippingAddresses)
      .where(and(eq(shippingAddresses.id, shippingAddressId), eq(shippingAddresses.userId, userId)))
      .limit(1)

    if (address.length === 0) {
      return NextResponse.json(
        { error: 'Shipping address not found' },
        { status: 404 }
      )
    }

    // Group items by store and calculate totals
    const itemsByStore: Record<string, any[]> = {}
    let totalSubtotal = 0

    for (const item of items) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1)

      if (product.length === 0 || product[0].inventory < item.quantity) {
        return NextResponse.json(
          { error: `Product ${item.productId} is not available in requested quantity` },
          { status: 400 }
        )
      }

      const storeId = product[0].storeId
      if (!itemsByStore[storeId]) {
        itemsByStore[storeId] = []
      }

      itemsByStore[storeId].push({
        ...item,
        storeId,
        productName: product[0].name,
      })

      totalSubtotal += item.pricePerUnit * item.quantity
    }

    // Create orders for each store
    const createdOrders = []

    for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
      const subtotal = storeItems.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0)
      const tax = Math.round(subtotal * 0.1) // 10% tax (simplified)
      const shippingCost = 1000 // $10 (in cents) - simplified

      const newOrder = await db
        .insert(orders)
        .values({
          userId,
          storeId,
          status: 'pending',
          subtotal,
          tax,
          shippingCost,
          discount: 0,
          total: subtotal + tax + shippingCost,
          notes: notes || null,
        })
        .returning()

      // Create order items
      for (const item of storeItems) {
        await db
          .insert(orderItems)
          .values({
            orderId: newOrder[0].id,
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
            total: item.pricePerUnit * item.quantity,
          })
      }

      // Create order address (snapshot)
      await db
        .insert(orderAddresses)
        .values({
          orderId: newOrder[0].id,
          fullName: address[0].fullName,
          phone: address[0].phone || null,
          email: address[0].email || null,
          street: address[0].street,
          city: address[0].city,
          state: address[0].state || null,
          zipCode: address[0].zipCode,
          country: address[0].country,
        })

      // Update product inventory
      for (const item of storeItems) {
        const product = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1)

        await db
          .update(products)
          .set({
            inventory: (product[0].inventory || 0) - item.quantity,
          })
          .where(eq(products.id, item.productId))
      }

      createdOrders.push(newOrder[0])
    }

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id))

    return NextResponse.json(
      {
        message: 'Orders created successfully',
        orders: createdOrders,
        orderCount: createdOrders.length,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
