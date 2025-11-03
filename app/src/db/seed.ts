/**
 * Database Seed Script
 * Popula o banco com dados de teste usando Mock Generator
 */

import { db, schema } from './index'
import { mockGenerator } from '@/lib/mock-generator'
import type { SchemaOrgType } from '@/types/schema-org'

interface SeedConfig {
  totalEntities: number
  distribution: Record<SchemaOrgType, number>
}

const DEFAULT_CONFIG: SeedConfig = {
  totalEntities: 1000,
  distribution: {
    Person: 300,
    Organization: 100,
    Product: 200,
    LocalBusiness: 100,
    Restaurant: 50,
    Store: 50,
    Place: 80,
    Event: 60,
    CreativeWork: 40,
    Review: 20,
  } as Record<SchemaOrgType, number>,
}

async function seed(config: SeedConfig = DEFAULT_CONFIG) {
  console.log('🌱 Starting database seed...\n')

  const startTime = Date.now()
  let totalInserted = 0

  try {
    // Limpar dados existentes (opcional - comentar se quiser manter dados)
    // console.log('🗑️  Clearing existing data...')
    // await db.delete(schema.entities)
    // console.log('✓ Data cleared\n')

    console.log(`📊 Target: ${config.totalEntities} entities\n`)

    // Seed por tipo
    for (const [type, count] of Object.entries(config.distribution)) {
      if (count === 0) continue

      console.log(`📝 Generating ${count} ${type} entities...`)
      
      const entities = mockGenerator.generateEntities(type as SchemaOrgType, count)
      
      // Inserir em batches de 100 para evitar timeouts
      const batchSize = 100
      for (let i = 0; i < entities.length; i += batchSize) {
        const batch = entities.slice(i, i + batchSize)
        
        await db.insert(schema.entities).values(
          batch.map((entity) => ({
            type: entity.type,
            properties: entity.properties,
            trustScore: entity.trustScore,
          }))
        )
        
        totalInserted += batch.length
        process.stdout.write(`  → Inserted ${totalInserted}/${config.totalEntities}\r`)
      }
      
      console.log(`✓ ${count} ${type} entities inserted`)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log('\n')
    console.log('━'.repeat(50))
    console.log('✅ Seed completed successfully!')
    console.log(`📊 Total entities: ${totalInserted}`)
    console.log(`⏱️  Duration: ${duration}s`)
    console.log(`⚡ Rate: ${Math.floor(totalInserted / parseFloat(duration))} entities/sec`)
    console.log('━'.repeat(50))

    // Estatísticas
    console.log('\n📈 Database statistics:')
    
    const stats = await db
      .select({
        type: schema.entities.type,
      })
      .from(schema.entities)

    // Count manually
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

// CLI Arguments parsing
const args = process.argv.slice(2)
const customCount = args[0] ? parseInt(args[0]) : undefined

if (customCount) {
  console.log(`🎯 Custom seed: ${customCount} entities\n`)
  
  // Distribuição proporcional
  const totalRatio = Object.values(DEFAULT_CONFIG.distribution).reduce((a, b) => a + b, 0)
  const customDistribution = Object.fromEntries(
    Object.entries(DEFAULT_CONFIG.distribution).map(([type, count]) => [
      type,
      Math.floor((count / totalRatio) * customCount),
    ])
  ) as Record<SchemaOrgType, number>

  seed({
    totalEntities: customCount,
    distribution: customDistribution,
  })
} else {
  seed()
}

// Handle ctrl-c gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Seed interrupted by user')
  process.exit(1)
})
