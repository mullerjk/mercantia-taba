/**
 * API Route: /api/relations
 * CRUD operations for relations (Knowledge Graph edges / Schema.org Actions)
 */

import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { eq, and, or, desc } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const CreateRelationSchema = z.object({
  type: z.string().min(1).max(100), // e.g., "ConsumeAction", "BuyAction"
  agentId: z.string().uuid(),
  objectId: z.string().uuid(),
  locationId: z.string().uuid().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  context: z.record(z.unknown()).optional(),
  trustScore: z.number().min(0).max(100).optional(),
})

const QuerySchema = z.object({
  type: z.string().nullish(),
  agentId: z.string().uuid().nullish(),
  objectId: z.string().uuid().nullish(),
  entityId: z.string().uuid().nullish(), // Returns relations where entity is agent OR object
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
})

// GET /api/relations - List relations with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = QuerySchema.parse({
      type: searchParams.get('type'),
      agentId: searchParams.get('agentId'),
      objectId: searchParams.get('objectId'),
      entityId: searchParams.get('entityId'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    let query = db.select().from(schema.relationsTable)

    // Filter by type
    if (params.type) {
      query = query.where(eq(schema.relationsTable.type, params.type)) as typeof query
    }

    // Filter by agent
    if (params.agentId) {
      query = query.where(eq(schema.relationsTable.agentId, params.agentId)) as typeof query
    }

    // Filter by object
    if (params.objectId) {
      query = query.where(eq(schema.relationsTable.objectId, params.objectId)) as typeof query
    }

    // Filter by entityId (agent OR object)
    if (params.entityId) {
      query = query.where(
        or(
          eq(schema.relationsTable.agentId, params.entityId),
          eq(schema.relationsTable.objectId, params.entityId)
        )
      ) as typeof query
    }

    const results = await query
      .orderBy(desc(schema.relationsTable.createdAt))
      .limit(params.limit)
      .offset(params.offset)

    // Enrich with entity data
    const enrichedResults = await Promise.all(
      results.map(async (relation) => {
        const [agent] = await db.select()
          .from(schema.entities)
          .where(eq(schema.entities.id, relation.agentId))
        
        const [object] = await db.select()
          .from(schema.entities)
          .where(eq(schema.entities.id, relation.objectId))

        let location = null
        if (relation.locationId) {
          const [loc] = await db.select()
            .from(schema.entities)
            .where(eq(schema.entities.id, relation.locationId))
          location = loc
        }

        return {
          ...relation,
          agent,
          object,
          location,
        }
      })
    )

    return NextResponse.json({
      data: enrichedResults,
      meta: {
        limit: params.limit,
        offset: params.offset,
        count: results.length,
      }
    })
  } catch (error) {
    console.error('GET /api/relations error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/relations - Create new relation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CreateRelationSchema.parse(body)

    // Verify that agent and object exist
    const [agent] = await db.select()
      .from(schema.entities)
      .where(eq(schema.entities.id, validated.agentId))

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent entity not found' },
        { status: 404 }
      )
    }

    const [object] = await db.select()
      .from(schema.entities)
      .where(eq(schema.entities.id, validated.objectId))

    if (!object) {
      return NextResponse.json(
        { error: 'Object entity not found' },
        { status: 404 }
      )
    }

    // Verify location if provided
    if (validated.locationId) {
      const [location] = await db.select()
        .from(schema.entities)
        .where(eq(schema.entities.id, validated.locationId))

      if (!location) {
        return NextResponse.json(
          { error: 'Location entity not found' },
          { status: 404 }
        )
      }
    }

    const [relation] = await db.insert(schema.relationsTable)
      .values({
        type: validated.type,
        agentId: validated.agentId,
        objectId: validated.objectId,
        locationId: validated.locationId,
        startTime: validated.startTime ? new Date(validated.startTime) : null,
        endTime: validated.endTime ? new Date(validated.endTime) : null,
        context: validated.context,
        trustScore: validated.trustScore,
      })
      .returning()

    return NextResponse.json({
      ...relation,
      agent,
      object,
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/relations error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid relation data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
