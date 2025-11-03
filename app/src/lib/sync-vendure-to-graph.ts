/**
 * Vendure to Knowledge Graph Sync
 * Sincroniza dados do e-commerce Vendure com o Knowledge Graph
 */

import postgres from 'postgres'
import { db, schema } from '@/db'
import { sql } from 'drizzle-orm'

// Vendure database connection
const vendureDb = postgres(process.env.DATABASE_URL || '', {
  max: 5,
  idle_timeout: 20,
})

interface SyncStats {
  products: { total: number; synced: number; skipped: number }
  sellers: { total: number; synced: number; skipped: number }
  customers: { total: number; synced: number; skipped: number }
  relations: { total: number; created: number }
}

export async function syncVendureToGraph(options: {
  syncProducts?: boolean
  syncSellers?: boolean
  syncCustomers?: boolean
  syncOrders?: boolean
  limit?: number
}) {
  const {
    syncProducts = true,
    syncSellers = true,
    syncCustomers = true,
    syncOrders = true,
    limit = 100
  } = options

  console.log('🔄 Starting Vendure → Knowledge Graph sync...\n')
  const startTime = Date.now()

  const stats: SyncStats = {
    products: { total: 0, synced: 0, skipped: 0 },
    sellers: { total: 0, synced: 0, skipped: 0 },
    customers: { total: 0, synced: 0, skipped: 0 },
    relations: { total: 0, created: 0 }
  }

  try {
    // 1. Sync Sellers (Organizations)
    if (syncSellers) {
      console.log('📊 Syncing Sellers → Organizations...')
      const sellers = await vendureDb`
        SELECT 
          s.id,
          s.name,
          s."customFieldsCorporatename" as corporate_name,
          s."customFieldsTradename" as trade_name,
          s."customFieldsCnpj" as cnpj,
          s."customFieldsCity" as city,
          s."customFieldsState" as state,
          s."customFieldsLegalrepresentativeemail" as email,
          s."customFieldsWhatsappphone" as phone,
          s."createdAt",
          s."updatedAt"
        FROM seller s
        WHERE s."deletedAt" IS NULL
        LIMIT ${limit}
      `

      stats.sellers.total = sellers.length

      for (const seller of sellers) {
        try {
          // Check if already exists
          const existing = await db.select()
            .from(schema.entities)
            .where(sql`properties->>'vendureId' = ${seller.id.toString()}`)

          if (existing.length > 0) {
            stats.sellers.skipped++
            continue
          }

          await db.insert(schema.entities).values({
            type: 'Organization',
            properties: {
              '@type': 'Organization',
              name: seller.name || seller.trade_name || `Seller ${seller.id}`,
              vendureId: seller.id,
              vendureType: 'seller',
              legalName: seller.corporate_name,
              alternateName: seller.trade_name,
              taxID: seller.cnpj,
              email: seller.email,
              telephone: seller.phone,
              address: {
                '@type': 'PostalAddress',
                addressLocality: seller.city,
                addressRegion: seller.state,
                addressCountry: 'BR',
              },
              foundingDate: seller.createdAt?.toISOString(),
            },
            trustScore: 85,
            createdAt: seller.createdAt || new Date(),
          })

          stats.sellers.synced++
          process.stdout.write(`  → Sellers: ${stats.sellers.synced}/${stats.sellers.total}\r`)
        } catch (error) {
          console.error(`Error syncing seller ${seller.id}:`, error)
          stats.sellers.skipped++
        }
      }
      console.log(`✓ Synced ${stats.sellers.synced} sellers\n`)
    }

    // 2. Sync Products
    if (syncProducts) {
      console.log('📦 Syncing Products...')
      const products = await vendureDb`
        SELECT 
          pv.id,
          pv.sku,
          pv."createdAt",
          pv."updatedAt",
          pt.name,
          pt.description,
          pvp.price,
          ch."sellerId",
          s.name as seller_name
        FROM product_variant pv
        JOIN product p ON pv."productId" = p.id
        LEFT JOIN product_translation pt ON p.id = pt."baseId" AND pt."languageCode" = 'pt'
        LEFT JOIN product_variant_channels_channel pvcc ON pv.id = pvcc."productVariantId"
        LEFT JOIN channel ch ON pvcc."channelId" = ch.id
        LEFT JOIN seller s ON ch."sellerId" = s.id
        LEFT JOIN (
          SELECT 
            "variantId",
            MAX(price) as price
          FROM product_variant_price
          GROUP BY "variantId"
        ) pvp ON pv.id = pvp."variantId"
        WHERE pv."deletedAt" IS NULL
          AND p."deletedAt" IS NULL
        LIMIT ${limit}
      `

      stats.products.total = products.length

      for (const product of products) {
        try {
          const existing = await db.select()
            .from(schema.entities)
            .where(sql`properties->>'vendureId' = ${product.id.toString()}`)

          if (existing.length > 0) {
            stats.products.skipped++
            continue
          }

          await db.insert(schema.entities).values({
            type: 'Product',
            properties: {
              '@type': 'Product',
              name: product.name || 'Unnamed Product',
              description: product.description,
              sku: product.sku,
              vendureId: product.id,
              vendureType: 'product',
              price: product.price ? product.price / 100 : undefined,
              priceCurrency: 'BRL',
              sellerId: product.sellerId,
              sellerName: product.seller_name,
            },
            trustScore: 90,
            createdAt: product.createdAt || new Date(),
          })

          stats.products.synced++
          process.stdout.write(`  → Products: ${stats.products.synced}/${stats.products.total}\r`)
        } catch (error) {
          console.error(`Error syncing product ${product.id}:`, error)
          stats.products.skipped++
        }
      }
      console.log(`✓ Synced ${stats.products.synced} products\n`)
    }

    // 3. Sync Customers (Persons)
    if (syncCustomers) {
      console.log('👤 Syncing Customers → Persons...')
      const customers = await vendureDb`
        SELECT 
          c.id,
          c."firstName",
          c."lastName",
          c."emailAddress",
          c."phoneNumber",
          c."createdAt",
          c."updatedAt"
        FROM customer c
        WHERE c."deletedAt" IS NULL
        LIMIT ${limit}
      `

      stats.customers.total = customers.length

      for (const customer of customers) {
        try {
          const existing = await db.select()
            .from(schema.entities)
            .where(sql`properties->>'vendureId' = ${customer.id.toString()}`)

          if (existing.length > 0) {
            stats.customers.skipped++
            continue
          }

          const fullName = [customer.firstName, customer.lastName]
            .filter(Boolean)
            .join(' ') || `Customer ${customer.id}`

          await db.insert(schema.entities).values({
            type: 'Person',
            properties: {
              '@type': 'Person',
              name: fullName,
              givenName: customer.firstName,
              familyName: customer.lastName,
              email: customer.emailAddress,
              telephone: customer.phoneNumber,
              vendureId: customer.id,
              vendureType: 'customer',
            },
            trustScore: 80,
            createdAt: customer.createdAt || new Date(),
          })

          stats.customers.synced++
          process.stdout.write(`  → Customers: ${stats.customers.synced}/${stats.customers.total}\r`)
        } catch (error) {
          console.error(`Error syncing customer ${customer.id}:`, error)
          stats.customers.skipped++
        }
      }
      console.log(`✓ Synced ${stats.customers.synced} customers\n`)
    }

    // 4. Sync Orders → Relations (BuyAction)
    if (syncOrders) {
      console.log('🛒 Syncing Orders → BuyAction relations...')
      const orders = await vendureDb`
        SELECT 
          o.id,
          o."customerId",
          ol."productVariantId",
          o."orderPlacedAt",
          o."subTotalWithTax" as total,
          o.state
        FROM "order" o
        JOIN order_line ol ON o.id = ol."orderId"
        WHERE o.state IN ('PaymentSettled', 'Shipped', 'Delivered')
          AND o."customerId" IS NOT NULL
        LIMIT ${limit}
      `

      stats.relations.total = orders.length

      for (const order of orders) {
        try {
          // Find customer entity
          const [customer] = await db.select()
            .from(schema.entities)
            .where(sql`properties->>'vendureId' = ${order.customerId.toString()}`)
            .limit(1)

          // Find product entity
          const [product] = await db.select()
            .from(schema.entities)
            .where(sql`properties->>'vendureId' = ${order.productVariantId.toString()}`)
            .limit(1)

          if (!customer || !product) {
            continue
          }

          // Check if relation already exists
          const existingRelation = await db.select()
            .from(schema.relationsTable)
            .where(sql`
              type = 'BuyAction' 
              AND agent_id = ${customer.id}
              AND object_id = ${product.id}
              AND context->>'vendureOrderId' = ${order.id.toString()}
            `)

          if (existingRelation.length > 0) {
            continue
          }

          await db.insert(schema.relationsTable).values({
            type: 'BuyAction',
            agentId: customer.id,
            objectId: product.id,
            startTime: order.orderPlacedAt || new Date(),
            context: {
              vendureOrderId: order.id,
              price: order.total / 100,
              currency: 'BRL',
              orderState: order.state,
            },
            trustScore: 95,
          })

          stats.relations.created++
          process.stdout.write(`  → Relations: ${stats.relations.created}/${stats.relations.total}\r`)
        } catch (error) {
          console.error(`Error creating relation for order ${order.id}:`, error)
        }
      }
      console.log(`✓ Created ${stats.relations.created} BuyAction relations\n`)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('\n━'.repeat(50))
    console.log('✅ Sync completed!')
    console.log(`⏱️  Duration: ${duration}s`)
    console.log('\n📊 Summary:')
    console.log(`  Sellers: ${stats.sellers.synced}/${stats.sellers.total} synced`)
    console.log(`  Products: ${stats.products.synced}/${stats.products.total} synced`)
    console.log(`  Customers: ${stats.customers.synced}/${stats.customers.total} synced`)
    console.log(`  Relations: ${stats.relations.created}/${stats.relations.total} created`)
    console.log('━'.repeat(50))

  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    throw error
  } finally {
    await vendureDb.end()
  }

  process.exit(0)
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2)
  const limit = args[0] ? parseInt(args[0]) : 100

  console.log(`🎯 Syncing ${limit} items per type\n`)
  
  syncVendureToGraph({
    syncProducts: true,
    syncSellers: true,
    syncCustomers: true,
    syncOrders: true,
    limit
  })
}

// Handle ctrl-c
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Sync interrupted by user')
  process.exit(1)
})
