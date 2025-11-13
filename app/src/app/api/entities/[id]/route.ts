/**
 * API Route: /api/entities/[id]
 * Single entity operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const UpdateEntitySchema = z.object({
  type: z.string().min(1).max(100).optional(),
  properties: z.record(z.unknown()).optional(),
  trustScore: z.number().min(0).max(100).optional(),
})

// GET /api/entities/[id] - Get single entity with relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: entityId } = await params

    // Get entity
    const [entity] = await db.select()
      .from(schema.entities)
      .where(eq(schema.entities.id, entityId))

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    // Get verifications
    const entityVerifications = await db.select()
      .from(schema.verifications)
      .where(eq(schema.verifications.entityId, entityId))

    // Get relations where this entity is the agent
    const actionsAsAgent = await db.select()
      .from(schema.relationsTable)
      .where(eq(schema.relationsTable.agentId, entityId))

    // Get relations where this entity is the object
    const actionsAsObject = await db.select()
      .from(schema.relationsTable)
      .where(eq(schema.relationsTable.objectId, entityId))

    return NextResponse.json({
      entity,
      verifications: entityVerifications,
      relations: {
        asAgent: actionsAsAgent,
        asObject: actionsAsObject,
      }
    })
  } catch (error) {
    console.error('GET /api/entities/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/entities/[id] - Update entity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: entityId } = await params
    const body = await request.json()
    const validated = UpdateEntitySchema.parse(body)

    const [updated] = await db.update(schema.entities)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(schema.entities.id, entityId))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/entities/[id] error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/entities/[id] - Delete entity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: entityId } = await params

    const [deleted] = await db.delete(schema.entities)
      .where(eq(schema.entities.id, entityId))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id: entityId })
  } catch (error) {
    console.error('DELETE /api/entities/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
