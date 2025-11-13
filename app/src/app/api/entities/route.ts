import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { entities } from '@/db/schema'
import { eq, inArray, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let entitiesData

    if (type) {
      // Ensure type has schema: prefix
      const schemaType = type.startsWith('schema:') ? type : `schema:${type}`

      // For parent types, include subclasses (e.g., Organization includes LocalBusiness, etc.)
      // This is a simplified approach - in a real implementation, you'd have a proper hierarchy table
      const parentTypes = [
        'schema:Thing', 'schema:Action', 'schema:Place', 'schema:Person',
        'schema:Organization', 'schema:Product', 'schema:Event', 'schema:CreativeWork'
      ]

      if (parentTypes.includes(schemaType)) {
        // For parent types, include direct subclasses
        const typeMappings: Record<string, string[]> = {
          'schema:Organization': ['schema:Organization', 'schema:LocalBusiness', 'schema:Corporation'],
          'schema:Person': ['schema:Person'],
          'schema:Product': ['schema:Product'],
          'schema:Place': ['schema:Place', 'schema:LocalBusiness'],
          'schema:Thing': ['schema:Thing', 'schema:Person', 'schema:Organization', 'schema:Product', 'schema:Place'],
          // Add more mappings as needed
        }

        const subtypes = typeMappings[schemaType] || [schemaType]
        entitiesData = await db.select().from(entities).where(inArray(entities.type, subtypes)).orderBy(desc(entities.createdAt))
      } else {
        // For specific types, exact match
        entitiesData = await db.select().from(entities).where(eq(entities.type, schemaType)).orderBy(desc(entities.createdAt))
      }
    } else {
      entitiesData = await db.select().from(entities).orderBy(desc(entities.createdAt))
    }

    // Transform the data to match the expected format
    const formattedEntities = entitiesData.map(entity => ({
      id: entity.id,
      name: entity.properties?.name || 'Unknown',
      description: entity.properties?.description || '',
      schema_type: entity.type,
      parent_types: [], // This would need a separate hierarchy table
      properties: entity.properties || {},
      is_abstract: false, // Default for now
      created_at: entity.createdAt?.toISOString(),
      updated_at: entity.updatedAt?.toISOString()
    }))

    return NextResponse.json(formattedEntities)
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const entityData = await request.json()

    // For now, just return success with mock response
    // Replace with real database logic when available
    const mockResponse = {
      id: `mock-${Date.now()}`,
      name: entityData.name || `${entityData.givenName || ''} ${entityData.familyName || ''}`.trim(),
      schema_type: entityData.schema_type,
      properties: entityData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Entity created (mock):', mockResponse)
    return NextResponse.json(mockResponse, { status: 201 })
  } catch (error) {
    console.error('Error creating entity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
