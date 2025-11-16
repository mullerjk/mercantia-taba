import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { shippingAddresses } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { validateData, createShippingAddressSchema } from '@/lib/validations'

/**
 * PATCH /api/shipping-addresses/[id]
 * Update a shipping address
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    // Check if address exists and belongs to user
    const existingAddress = await db
      .select()
      .from(shippingAddresses)
      .where(
        and(
          eq(shippingAddresses.id, id),
          eq(shippingAddresses.userId, userId)
        )
      )

    if (existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db
        .update(shippingAddresses)
        .set({ isDefault: false })
        .where(eq(shippingAddresses.userId, userId))
    }

    // Update the address
    const updatedAddress = await db
      .update(shippingAddresses)
      .set({
        fullName,
        phone: phone || null,
        email: email || null,
        street,
        city,
        state: state || null,
        zipCode,
        country,
        isDefault: isDefault || false,
        updatedAt: new Date(),
      })
      .where(eq(shippingAddresses.id, id))
      .returning()

    return NextResponse.json(updatedAddress[0])
  } catch (error) {
    console.error('Error updating shipping address:', error)
    return NextResponse.json(
      { error: 'Failed to update shipping address' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/shipping-addresses/[id]
 * Delete a shipping address
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if address exists and belongs to user
    const existingAddress = await db
      .select()
      .from(shippingAddresses)
      .where(
        and(
          eq(shippingAddresses.id, id),
          eq(shippingAddresses.userId, userId)
        )
      )

    if (existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Delete the address
    await db
      .delete(shippingAddresses)
      .where(eq(shippingAddresses.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shipping address:', error)
    return NextResponse.json(
      { error: 'Failed to delete shipping address' },
      { status: 500 }
    )
  }
}
