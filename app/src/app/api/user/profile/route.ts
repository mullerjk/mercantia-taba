import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, entities } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getAuthToken } from '@/lib/cookies'
import jwt from 'jsonwebtoken'
import { config } from '@/lib/config'
import { PersonSchema } from '@/types/person'

/**
 * GET /api/user/profile
 * Get current user's profile with Person entity
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get or create Person entity for user
    const personEntities = await db
      .select()
      .from(entities)
      .where(eq(entities.createdBy, user.id))
      .limit(1)

    const personEntity = personEntities[0]

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        role: user.role,
      },
      person: personEntity ? {
        id: personEntity.id,
        ...personEntity.properties,
      } : null,
    })

  } catch (error) {
    console.error('GET /api/user/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/profile
 * Update current user's profile and Person entity
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get auth token
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get request body
    const body: Partial<PersonSchema> = await request.json()

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user basic fields
    const userUpdates: any = {
      updatedAt: new Date(),
    }

    if (body.name) {
      userUpdates.fullName = body.name
    }

    if (typeof body.image === 'string' && body.image) {
      userUpdates.avatarUrl = body.image
    }

    // Update user table
    await db
      .update(users)
      .set(userUpdates)
      .where(eq(users.id, user.id))

    // Get or create Person entity
    const personEntities = await db
      .select()
      .from(entities)
      .where(eq(entities.createdBy, user.id))
      .limit(1)

    let personEntity = personEntities[0]

    // Prepare person properties
    const personProperties: Partial<PersonSchema> = {
      '@type': 'Person',
      name: body.name || user.fullName || '',
      givenName: body.givenName,
      familyName: body.familyName,
      additionalName: body.additionalName,
      honorificPrefix: body.honorificPrefix,
      honorificSuffix: body.honorificSuffix,
      alternateName: body.alternateName,
      email: body.email || user.email,
      telephone: body.telephone,
      faxNumber: body.faxNumber,
      address: body.address,
      birthDate: body.birthDate,
      gender: body.gender,
      description: body.description,
      image: body.image,
      jobTitle: body.jobTitle,
      worksFor: body.worksFor,
      award: body.award,
      url: body.url,
      sameAs: body.sameAs,
      nationality: body.nationality,
      height: body.height,
      weight: body.weight,
      taxID: body.taxID,
    }

    // Remove undefined values
    Object.keys(personProperties).forEach(key => {
      if ((personProperties as any)[key] === undefined) {
        delete (personProperties as any)[key]
      }
    })

    if (personEntity) {
      // Update existing entity
      const [updated] = await db
        .update(entities)
        .set({
          properties: personProperties,
          updatedAt: new Date(),
        })
        .where(eq(entities.id, personEntity.id))
        .returning()

      personEntity = updated
    } else {
      // Create new entity
      const [created] = await db
        .insert(entities)
        .values({
          type: 'schema:Person',
          properties: personProperties,
          createdBy: user.id,
          trustScore: 50,
        })
        .returning()

      personEntity = created
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: userUpdates.fullName || user.fullName,
        avatarUrl: userUpdates.avatarUrl || user.avatarUrl,
        emailVerified: user.emailVerified,
        role: user.role,
      },
      person: {
        id: personEntity.id,
        ...personEntity.properties,
      },
    })

  } catch (error) {
    console.error('PATCH /api/user/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
