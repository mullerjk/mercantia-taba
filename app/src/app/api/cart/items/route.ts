import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { carts, cartItems, products } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { validateData, addToCartSchema, updateCartItemSchema } from '@/lib/validations'

/**
 * POST /api/cart/items
 * Add an item to the cart
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
    const validation = validateData(addToCartSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    const { productId, quantity } = validation.data

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

    // Get product details
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check inventory
    if (product[0].inventory < quantity) {
      return NextResponse.json(
        { error: `Only ${product[0].inventory} items available` },
        { status: 400 }
      )
    }

    // Check if item already in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart[0].id),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1)

    if (existingItem.length > 0) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + quantity
      if (product[0].inventory < newQuantity) {
        return NextResponse.json(
          { error: `Only ${product[0].inventory} items available` },
          { status: 400 }
        )
      }

      const updated = await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning()

      return NextResponse.json(updated[0], { status: 200 })
    }

    // Add new item to cart
    const newItem = await db
      .insert(cartItems)
      .values({
        cartId: cart[0].id,
        productId,
        quantity,
        pricePerUnit: product[0].price,
      })
      .returning()

    return NextResponse.json(newItem[0], { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/cart/items/[itemId]
 * Update cart item quantity
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = validateData(updateCartItemSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    const { quantity } = validation.data

    // Get the cart item
    const item = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, itemId))
      .limit(1)

    if (item.length === 0) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify user owns the cart
    const cart = await db
      .select()
      .from(carts)
      .where(and(eq(carts.id, item[0].cartId), eq(carts.userId, userId)))
      .limit(1)

    if (cart.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check inventory
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, item[0].productId))
      .limit(1)

    if (product.length === 0 || product[0].inventory < quantity) {
      return NextResponse.json(
        { error: `Only ${product?.[0]?.inventory || 0} items available` },
        { status: 400 }
      )
    }

    // Update quantity
    const updated = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart/items/[itemId]
 * Remove item from cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Get the cart item
    const item = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, itemId))
      .limit(1)

    if (item.length === 0) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify user owns the cart
    const cart = await db
      .select()
      .from(carts)
      .where(and(eq(carts.id, item[0].cartId), eq(carts.userId, userId)))
      .limit(1)

    if (cart.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the item
    await db.delete(cartItems).where(eq(cartItems.id, itemId))

    return NextResponse.json({ success: true, message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
