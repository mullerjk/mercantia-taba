/**
 * API Route: /api/entities
 * CRUD operations for entities (Knowledge Graph nodes)
 */

import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { eq, like, desc } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const CreateEntitySchema = z.object({
  type: z.string().min(1).max(100),
  properties: z.record(z.unknown()),
  trustScore: z.number().min(0).max(100).optional(),
  createdBy: z.string().uuid().optional(),
})

const QuerySchema = z.object({
  type: z.string().nullish(),
  search: z.string().nullish(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
})

// GET /api/entities - List entities with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = QuerySchema.parse({
      type: searchParams.get('type'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    let query = db.select().from(schema.entities)

    // Filter by type
    if (params.type) {
      query = query.where(eq(schema.entities.type, params.type)) as typeof query
    }

    // Search in properties (requires JSONB search)
    // Note: This is a simple implementation. For production, use PostgreSQL full-text search
    if (params.search) {
      // This is a placeholder - proper implementation would use pg's text search
      // For now, we'll just filter client-side or implement later
    }

    const results = await query
      .orderBy(desc(schema.entities.createdAt))
      .limit(params.limit)
      .offset(params.offset)

    return NextResponse.json({
      data: results,
      meta: {
        limit: params.limit,
        offset: params.offset,
        count: results.length,
      }
    })
  } catch (error) {
    console.error('GET /api/entities error:', error)
    
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

// POST /api/entities - Create new entity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CreateEntitySchema.parse(body)

    const [entity] = await db.insert(schema.entities)
      .values({
        type: validated.type,
        properties: validated.properties,
        trustScore: validated.trustScore,
        createdBy: validated.createdBy,
      })
      .returning()

    return NextResponse.json(entity, { status: 201 })
  } catch (error) {
    console.error('POST /api/entities error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid entity data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
