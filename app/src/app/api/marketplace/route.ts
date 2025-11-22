import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || null
    const type = searchParams.get('type') || null

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Query schema_entities through Supabase
    let query = supabase
      .from('schema_entities')
      .select('*')
      .in('schema_type', ['schema:Organization', 'schema:Product'])
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('schema_type', category)
    }

    if (type) {
      const schemaType = type === 'organization' ? 'schema:Organization' : 'schema:Product'
      query = query.eq('schema_type', schemaType)
    }

    const { data: entities, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json([])
    }

    if (!entities) {
      return NextResponse.json([])
    }

    // Transform to marketplace format
    const marketplaceItems = entities.map((entity: any) => {
      const parsedProperties = entity.properties || {}

      // Transform to marketplace format
      const marketplaceItem: any = {
        id: entity.id,
        name: entity.name,
        description: parsedProperties.description || entity.description || '',
        type: entity.schema_type === 'schema:Organization' ? 'organization' : 'product',
        schema_type: entity.schema_type,
        category: parsedProperties.category || parsedProperties.orgType || 'General',
        created_at: entity.created_at,
        updated_at: entity.updated_at
      }

      // Add product-specific fields
      if (entity.schema_type === 'schema:Product') {
        marketplaceItem.price = parsedProperties.price || 0
        marketplaceItem.image = parsedProperties.imageUrl
      }

      // Add organization-specific fields
      if (entity.schema_type === 'schema:Organization') {
        marketplaceItem.location = parsedProperties.address
        marketplaceItem.rating = 4.0 // Default rating for organizations
      }

      return marketplaceItem
    })

    return NextResponse.json(marketplaceItems)
  } catch (error) {
    console.error('Error in marketplace API:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // For now, just return success - marketplace items are managed through schema_entities
    return NextResponse.json({ success: true, message: 'Marketplace item registered' }, { status: 201 })
  } catch (error) {
    console.error('Error in marketplace POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
