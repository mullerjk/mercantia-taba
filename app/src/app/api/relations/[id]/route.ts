/**
 * API Route: /api/relations/[id]
 * Single relation operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const UpdateRelationSchema = z.object({
  type: z.string().min(1).max(100).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  context: z.record(z.unknown()).optional(),
  trustScore: z.number().min(0).max(100).optional(),
})

// GET /api/relations/[id] - Get single relation with entities
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: relationId } = await params

    const [relation] = await db.select()
      .from(schema.relationsTable)
      .where(eq(schema.relationsTable.id, relationId))

    if (!relation) {
      return NextResponse.json(
        { error: 'Relation not found' },
        { status: 404 }
      )
    }

    // Get agent
    const [agent] = await db.select()
      .from(schema.entities)
      .where(eq(schema.entities.id, relation.agentId))

    // Get object
    const [object] = await db.select()
      .from(schema.entities)
      .where(eq(schema.entities.id, relation.objectId))

    // Get location if exists
    let location = null
    if (relation.locationId) {
      const [loc] = await db.select()
        .from(schema.entities)
        .where(eq(schema.entities.id, relation.locationId))
      location = loc
    }

    // Get proofs
    const proofs = await db.select()
      .from(schema.proofs)
      .where(eq(schema.proofs.relationId, relationId))

    // Get witnesses
    const witnesses = await db.select()
      .from(schema.witnesses)
      .where(eq(schema.witnesses.relationId, relationId))

    return NextResponse.json({
      relation,
      agent,
      object,
      location,
      proofs,
      witnesses,
    })
  } catch (error) {
    console.error('GET /api/relations/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/relations/[id] - Update relation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: relationId } = await params
    const body = await request.json()
    const validated = UpdateRelationSchema.parse(body)

    const updateData: any = { ...validated }
    
    if (validated.startTime) {
      updateData.startTime = new Date(validated.startTime)
    }
    if (validated.endTime) {
      updateData.endTime = new Date(validated.endTime)
    }

    const [updated] = await db.update(schema.relationsTable)
      .set(updateData)
      .where(eq(schema.relationsTable.id, relationId))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { error: 'Relation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/relations/[id] error:', error)
    
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

// DELETE /api/relations/[id] - Delete relation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: relationId } = await params

    const [deleted] = await db.delete(schema.relationsTable)
      .where(eq(schema.relationsTable.id, relationId))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { error: 'Relation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id: relationId })
  } catch (error) {
    console.error('DELETE /api/relations/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
