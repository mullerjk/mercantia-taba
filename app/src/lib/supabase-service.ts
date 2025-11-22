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

    // If not found, try looking in metadata/notes or might need a separate mapping table
    // For now, return null - implement proper mapping later
    console.log(`ℹ️ Order with Pargar.me ID ${pagarmeOrderId} not found in database`)
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

    // This would typically create a record in a payments table
    // For now, we'll just log it
    console.log('💰 Payment data:', paymentData)

    // TODO: Implement payments table or add to orders metadata
    return true

  } catch (error) {
    console.error(`❌ Error creating payment record for order ${orderId}:`, error)
    throw error
  }
}
