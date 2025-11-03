/**
 * Create Seller → Product Relations (OwnsAction)
 * Links sellers to their products in the Knowledge Graph
 */

import { db, schema } from '@/db'
import { sql, eq } from 'drizzle-orm'

export async function syncSellerProductRelations() {
  console.log('🔗 Creating Seller → Product relations (OwnsAction)...\n')
  const startTime = Date.now()

  let created = 0
  let skipped = 0

  try {
    // Get all products with sellerId
    const products = await db.select()
      .from(schema.entities)
      .where(sql`
        type = 'Product' 
        AND properties->>'vendureType' = 'product'
        AND properties->>'sellerId' IS NOT NULL
      `)

    console.log(`📦 Found ${products.length} products with sellers\n`)

    for (const product of products) {
      const sellerId = product.properties.sellerId as number

      // Find seller organization entity
      const [seller] = await db.select()
        .from(schema.entities)
        .where(sql`
          type = 'Organization'
          AND properties->>'vendureId' = ${sellerId.toString()}
        `)
        .limit(1)

      if (!seller) {
        console.log(`⚠️  Seller ${sellerId} not found for product ${product.id}`)
        skipped++
        continue
      }

      // Check if relation already exists
      const existing = await db.select()
        .from(schema.relationsTable)
        .where(sql`
          type = 'OwnsAction'
          AND "agentId" = ${seller.id}
          AND "objectId" = ${product.id}
        `)

      if (existing.length > 0) {
        skipped++
        continue
      }

      // Create OwnsAction relation
      await db.insert(schema.relationsTable).values({
        type: 'OwnsAction',
        agentId: seller.id,
        objectId: product.id,
        context: {
          relationship: 'seller-product',
          vendureSellerId: sellerId,
        },
        trustScore: 100, // High trust for direct ownership
      })

      created++
      process.stdout.write(`  → Created: ${created} OwnsAction relations\r`)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('\n\n━'.repeat(50))
    console.log('✅ Seller-Product relations completed!')
    console.log(`📊 Created: ${created}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`⏱️  Duration: ${duration}s`)
    console.log('━'.repeat(50))

  } catch (error) {
    console.error('\n❌ Failed:', error)
    throw error
  }

  process.exit(0)
}

// CLI execution
if (require.main === module) {
  syncSellerProductRelations()
}
