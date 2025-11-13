/**
 * Relations Seed Generator
 * Cria relações realistas entre entidades existentes no banco
 */

import { faker } from '@faker-js/faker'
import { db, schema } from '@/db'
import { eq, sql } from 'drizzle-orm'

interface RelationConfig {
  type: string
  agentType: string
  objectType: string
  probability: number // 0-1: probabilidade de criar a relação
  contextGenerator?: () => Record<string, unknown>
}

// Configurações de relações comuns
const RELATION_CONFIGS: RelationConfig[] = [
  {
    type: 'ConsumeAction',
    agentType: 'Person',
    objectType: 'Product',
    probability: 0.3, // 30% das pessoas consumem produtos
    contextGenerator: () => ({
      quantity: faker.number.int({ min: 1, max: 5 }),
      satisfaction: faker.helpers.arrayElement(['excellent', 'good', 'average', 'poor']),
      rating: faker.number.int({ min: 1, max: 5 }),
    })
  },
  {
    type: 'BuyAction',
    agentType: 'Person',
    objectType: 'Product',
    probability: 0.25,
    contextGenerator: () => ({
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      currency: 'BRL',
      paymentMethod: faker.helpers.arrayElement(['credit_card', 'debit_card', 'pix', 'cash']),
      installments: faker.number.int({ min: 1, max: 12 }),
    })
  },
  {
    type: 'ReviewAction',
    agentType: 'Person',
    objectType: 'Product',
    probability: 0.15,
    contextGenerator: () => ({
      rating: faker.number.int({ min: 1, max: 5 }),
      reviewBody: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      wouldRecommend: faker.datatype.boolean(),
    })
  },
  {
    type: 'ReviewAction',
    agentType: 'Person',
    objectType: 'Restaurant',
    probability: 0.2,
    contextGenerator: () => ({
      rating: faker.number.int({ min: 1, max: 5 }),
      reviewBody: faker.lorem.sentences(2),
      foodQuality: faker.number.int({ min: 1, max: 5 }),
      serviceQuality: faker.number.int({ min: 1, max: 5 }),
      ambience: faker.number.int({ min: 1, max: 5 }),
    })
  },
  {
    type: 'VisitAction',
    agentType: 'Person',
    objectType: 'Place',
    probability: 0.2,
    contextGenerator: () => ({
      duration: faker.number.int({ min: 15, max: 240 }), // minutes
      purpose: faker.helpers.arrayElement(['tourism', 'business', 'personal', 'leisure']),
    })
  },
  {
    type: 'VisitAction',
    agentType: 'Person',
    objectType: 'LocalBusiness',
    probability: 0.25,
    contextGenerator: () => ({
      duration: faker.number.int({ min: 10, max: 120 }),
      purchaseMade: faker.datatype.boolean(),
    })
  },
  {
    type: 'AttendAction',
    agentType: 'Person',
    objectType: 'Event',
    probability: 0.15,
    contextGenerator: () => ({
      attended: true,
      ticketType: faker.helpers.arrayElement(['regular', 'vip', 'student', 'free']),
      enjoymentLevel: faker.number.int({ min: 1, max: 5 }),
    })
  },
  {
    type: 'WorksForAction',
    agentType: 'Person',
    objectType: 'Organization',
    probability: 0.1,
    contextGenerator: () => ({
      position: faker.person.jobTitle(),
      startDate: faker.date.past({ years: 5 }).toISOString(),
      employmentType: faker.helpers.arrayElement(['full_time', 'part_time', 'contractor', 'intern']),
    })
  },
  {
    type: 'OwnsAction',
    agentType: 'Person',
    objectType: 'Product',
    probability: 0.2,
    contextGenerator: () => ({
      acquiredDate: faker.date.past({ years: 2 }).toISOString(),
      condition: faker.helpers.arrayElement(['new', 'used', 'refurbished']),
    })
  },
  {
    type: 'CreateAction',
    agentType: 'Person',
    objectType: 'CreativeWork',
    probability: 0.1,
    contextGenerator: () => ({
      createdDate: faker.date.past({ years: 1 }).toISOString(),
      medium: faker.helpers.arrayElement(['digital', 'physical', 'mixed']),
    })
  },
]

export async function seedRelations(targetCount: number = 500) {
  console.log('🔗 Starting relations seed...\n')
  const startTime = Date.now()
  let totalCreated = 0

  try {
    // Get all entities grouped by type
    console.log('📊 Loading entities from database...')
    const allEntities = await db.select().from(schema.entities)
    
    const entitiesByType: Record<string, typeof allEntities> = {}
    for (const entity of allEntities) {
      if (!entitiesByType[entity.type]) {
        entitiesByType[entity.type] = []
      }
      entitiesByType[entity.type].push(entity)
    }

    console.log(`✓ Loaded ${allEntities.length} entities`)
    console.log(`  Types: ${Object.keys(entitiesByType).join(', ')}\n`)

    // Generate relations based on configs
    for (const config of RELATION_CONFIGS) {
      const agents = entitiesByType[config.agentType] || []
      const objects = entitiesByType[config.objectType] || []

      if (agents.length === 0 || objects.length === 0) {
        console.log(`⚠️  Skipping ${config.type}: no ${config.agentType} or ${config.objectType}`)
        continue
      }

      const potentialCount = Math.floor(agents.length * config.probability)
      const countToCreate = Math.min(potentialCount, Math.floor(targetCount / RELATION_CONFIGS.length))

      if (countToCreate === 0) continue

      console.log(`📝 Creating ${countToCreate} ${config.type} relations...`)

      const relationsToCreate = []

      for (let i = 0; i < countToCreate; i++) {
        const agent = faker.helpers.arrayElement(agents)
        const object = faker.helpers.arrayElement(objects)

        // Avoid duplicate agent-object pairs (simple check)
        const isDuplicate = relationsToCreate.some(
          r => r.agentId === agent.id && r.objectId === object.id
        )
        if (isDuplicate) continue

        const startTime = faker.date.recent({ days: 90 })
        const endTime = faker.datatype.boolean(0.3) 
          ? faker.date.soon({ days: 1, refDate: startTime })
          : null

        relationsToCreate.push({
          type: config.type,
          agentId: agent.id,
          objectId: object.id,
          startTime,
          endTime,
          context: config.contextGenerator ? config.contextGenerator() : null,
          trustScore: faker.number.int({ min: 75, max: 100 }),
        })

        if (relationsToCreate.length >= 50) {
          // Batch insert
          await db.insert(schema.relationsTable).values(relationsToCreate)
          totalCreated += relationsToCreate.length
          process.stdout.write(`  → Created ${totalCreated}/${targetCount}\r`)
          relationsToCreate.length = 0
        }
      }

      // Insert remaining
      if (relationsToCreate.length > 0) {
        await db.insert(schema.relationsTable).values(relationsToCreate)
        totalCreated += relationsToCreate.length
      }

      console.log(`✓ ${countToCreate} ${config.type} relations created`)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('\n')
    console.log('━'.repeat(50))
    console.log('✅ Relations seed completed!')
    console.log(`📊 Total relations: ${totalCreated}`)
    console.log(`⏱️  Duration: ${duration}s`)
    console.log(`⚡ Rate: ${Math.floor(totalCreated / parseFloat(duration))} relations/sec`)
    console.log('━'.repeat(50))

    // Statistics
    console.log('\n📈 Relations by type:')
    const stats = await db
      .select({
        type: schema.relationsTable.type,
      })
      .from(schema.relationsTable)

    const typeCounts: Record<string, number> = {}
    for (const stat of stats) {
      typeCounts[stat.type] = (typeCounts[stat.type] || 0) + 1
    }

    for (const [type, count] of Object.entries(typeCounts).sort()) {
      console.log(`  ${type}: ${count}`)
    }

  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    throw error
  }

  process.exit(0)
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2)
  const count = args[0] ? parseInt(args[0]) : 500

  console.log(`🎯 Seeding ${count} relations\n`)
  seedRelations(count)
}

// Handle ctrl-c gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Seed interrupted by user')
  process.exit(1)
})
