/**
 * API Route: /api/sync/vendure-webhook
 * Webhook endpoint for automatic Vendure → Knowledge Graph sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { sql } from 'drizzle-orm'

interface VendureWebhookPayload {
  type: 'product.created' | 'product.updated' | 'customer.created' | 'order.placed'
  entity: {
    id: number
    [key: string]: unknown
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('x-vendure-webhook-secret')
    if (authHeader !== process.env.VENDURE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload: VendureWebhookPayload = await request.json()

    console.log(`[Webhook] Received: ${payload.type}`, payload.entity.id)

    switch (payload.type) {
      case 'product.created':
      case 'product.updated':
        await syncProduct(payload.entity.id)
        break

      case 'customer.created':
        await syncCustomer(payload.entity.id)
        break

      case 'order.placed':
        await syncOrder(payload.entity.id)
        break

      default:
        console.log(`[Webhook] Unhandled type: ${payload.type}`)
    }

    return NextResponse.json({ 
      success: true,
      processed: payload.type
    })

  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
async function syncProduct(vendureId: number) {
  // TODO: Implement single product sync
  console.log(`[Sync] Product ${vendureId}`)
  
  // Check if exists
  const existing = await db.select()
    .from(schema.entities)
    .where(sql`properties->>'vendureId' = ${vendureId.toString()}`)
    .limit(1)

  if (existing.length > 0) {
    console.log(`[Sync] Product ${vendureId} already exists, skipping`)
    return
  }

  // Fetch from Vendure and insert
  // Implementation depends on Vendure API access
}

async function syncCustomer(vendureId: number) {
  console.log(`[Sync] Customer ${vendureId}`)
  // Similar to syncProduct
}

async function syncOrder(vendureId: number) {
  console.log(`[Sync] Order ${vendureId}`)
  // Create BuyAction relation
}
