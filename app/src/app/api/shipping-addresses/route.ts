import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { shippingAddresses } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { validateData, createShippingAddressSchema } from '@/lib/validations'

/**
 * GET /api/shipping-addresses
 * Get user's shipping addresses
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

    const addresses = await db
      .select()
      .from(shippingAddresses)
      .where(eq(shippingAddresses.userId, userId))

    return NextResponse.json({ data: addresses })
  } catch (error) {
    console.error('Error getting shipping addresses:', error)
    return NextResponse.json(
      { error: 'Failed to get shipping addresses' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/shipping-addresses
 * Create a new shipping address
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
    const validation = validateData(createShippingAddressSchema, body)
    if ('error' in validation && !validation.success) {
      return validation.error
    }

    const { fullName, phone, email, street, city, state, zipCode, country, isDefault } = validation.data

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db
        .update(shippingAddresses)
        .set({ isDefault: false })
        .where(eq(shippingAddresses.userId, userId))
    }

    // Create the address
    const newAddress = await db
      .insert(shippingAddresses)
      .values({
        userId,
        fullName,
        phone: phone || null,
        email: email || null,
        street,
        city,
        state: state || null,
        zipCode,
        country,
        isDefault: isDefault || false,
      })
      .returning()

    return NextResponse.json(newAddress[0], { status: 201 })
  } catch (error) {
    console.error('Error creating shipping address:', error)
    return NextResponse.json(
      { error: 'Failed to create shipping address' },
      { status: 500 }
    )
  }
}
