import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { carts, cartItems, products } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/cart
 * Get user's shopping cart with items
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

    // Get or create cart
    let cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1)

    if (cart.length === 0) {
      const newCart = await db
        .insert(carts)
        .values({ userId })
        .returning()
      cart = newCart
    }

    // Get cart items with product details
    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        pricePerUnit: cartItems.pricePerUnit,
        addedAt: cartItems.addedAt,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          images: products.images,
          currentPrice: products.price,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart[0].id))

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0)

    return NextResponse.json({
      cart: {
        id: cart[0].id,
        userId,
        createdAt: cart[0].createdAt,
        updatedAt: cart[0].updatedAt,
      },
      items,
      totals: {
        subtotal,
        itemCount: items.length,
      },
    })
  } catch (error) {
    console.error('Error getting cart:', error)
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    )
  }
}
