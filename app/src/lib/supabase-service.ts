/**
 * Supabase Service Client for server-side operations (webhooks, admin tasks)
 * Uses service role key for full access without user authentication
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables')
}

// Create Supabase service client with full access (admin)
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper functions for order management
export async function updateOrderStatus(orderId: string, status: string, metadata?: any) {
  console.log(`🔄 Updating order ${orderId} to status: ${status}`)

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Set specific timestamp based on status
    switch (status) {
      case 'confirmed':
        updateData.confirmed_at = new Date().toISOString()
        break
      case 'shipped':
        updateData.shipped_at = new Date().toISOString()
        break
      case 'delivered':
        updateData.delivered_at = new Date().toISOString()
        break
    }

    // Insert payment metadata if provided
    if (metadata) {
      // Could add a payment_events table or add to order notes
      updateData.notes = JSON.stringify({ ...JSON.parse(updateData.notes || '{}'), payment_metadata: metadata })
    }

    const { error } = await supabaseService
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (error) {
      console.error(`❌ Error updating order ${orderId}:`, error)
      throw error
    }

    console.log(`✅ Order ${orderId} updated successfully to status: ${status}`)
    return true

  } catch (error) {
    console.error(`❌ Failed to update order ${orderId}:`, error)
    throw error
  }
}

// Function to find order by Pagar.me reference
export async function findOrderByPagarMeId(pagarmeOrderId: string) {
  try {
    // First try to find by direct ID mapping
    const { data: order, error } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', pagarmeOrderId)
      .single()

    if (order) return order

    // For mock orders, create a test order if not found
    if (pagarmeOrderId.startsWith('or_mock_')) {
      console.log('🎭 Mock order detected, creating test order in database')

      // Create a mock order for testing purposes
      // Use a simplified version without foreign key constraints for testing
      const { data: newOrder, error: insertError } = await supabaseService
        .from('orders')
        .insert({
          id: pagarmeOrderId,
          user_id: 'ce1b8d74-57f4-45ac-91ba-bb10435da860', // Test user ID - may need to adjust
          status: 'pending',
          subtotal: 1110,
          tax: 0,
          shipping_cost: 0,
          discount: 0,
          total: 1110,
          notes: JSON.stringify({
            pagarme_order_id: pagarmeOrderId,
            is_mock_order: true,
            created_via: 'mock_pix_simulator'
          })
        })
        .select()
        .single()

      if (newOrder) {
        console.log('✅ Mock order created:', newOrder.id)
        return newOrder
      }

      console.log('❌ Failed to create mock order:', insertError)
    }

    // If not found, try looking in metadata/notes or might need a separate mapping table
    // For now, return null - implement proper mapping later
    console.log(`ℹ️ Order with Pagar.me ID ${pagarmeOrderId} not found in database`)
    return null

  } catch (error) {
    console.error(`❌ Error finding order by Pagar.me ID ${pagarmeOrderId}:`, error)
    return null
  }
}

// Function to create payment record in database
export async function createPaymentRecord(orderId: string, paymentData: any) {
  try {
    console.log(`💰 Creating payment record for order ${orderId}`)
    console.log('💰 Payment data:', paymentData)

    // Check if payments table exists
    // For now, add to order notes as fallback since payments table might not exist
    const { data: existingOrder } = await supabaseService
      .from('orders')
      .select('notes')
      .eq('id', orderId)
      .single()

    let notes: any = {}
    if (existingOrder?.notes) {
      try {
        notes = JSON.parse(existingOrder.notes)
      } catch (e) {
        // notes corrupted, start fresh
        notes = {}
      }
    }

    // Add payment data to notes
    const updatedNotes = {
      ...notes,
      payments: [
        ...(notes.payments || []),
        {
          ...paymentData,
          recorded_at: new Date().toISOString(),
        }
      ]
    }

    // Update order with payment information
    const { error: updateError } = await supabaseService
      .from('orders')
      .update({
        notes: JSON.stringify(updatedNotes),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error(`❌ Error updating order ${orderId} with payment data:`, updateError)
      throw updateError
    }

    console.log(`✅ Payment record created for order ${orderId}`)
    return true

  } catch (error) {
    console.error(`❌ Error creating payment record for order ${orderId}:`, error)
    throw error
  }
}
