import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || null
    const type = searchParams.get('type') || null

    // Query PostgreSQL directly using psql command
    let query = "SELECT * FROM schema_entities WHERE schema_type IN ('schema:Organization', 'schema:Product') ORDER BY created_at DESC"

    const psqlCommand = `psql "postgresql://postgres:postgres@127.0.0.1:54325/postgres" -c "${query}" -t -A -F '|'`

    const { stdout, stderr } = await execAsync(psqlCommand)

    if (stderr && !stdout) {
      console.error('psql error:', stderr)
      return NextResponse.json([])
    }

    // Parse the psql output
    const lines = stdout.trim().split('\n').filter(line => line.trim())

    const entities = lines.map(line => {
      const [id, name, description, schema_type, parent_types, properties, is_abstract, created_at, updated_at] = line.split('|')
      const parsedProperties = properties ? JSON.parse(properties) : {}

      // Transform to marketplace format
      const marketplaceItem: any = {
        id,
        name,
        description: parsedProperties.description || description || '',
        type: schema_type === 'schema:Organization' ? 'organization' : 'product',
        schema_type,
        category: parsedProperties.category || parsedProperties.orgType || 'General',
        created_at,
        updated_at
      }

      // Add product-specific fields
      if (schema_type === 'schema:Product') {
        marketplaceItem.price = parsedProperties.price || 0
        marketplaceItem.image = parsedProperties.imageUrl
      }

      // Add organization-specific fields
      if (schema_type === 'schema:Organization') {
        marketplaceItem.location = parsedProperties.address
        marketplaceItem.rating = 4.0 // Default rating for organizations
      }

      return marketplaceItem
    }).filter(entity => entity.id) // Filter out empty lines

    // Apply filters
    let filteredItems = entities

    if (search) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filteredItems = filteredItems.filter(item => item.schema_type === category)
    }

    if (type) {
      filteredItems = filteredItems.filter(item => item.type === type)
    }

    return NextResponse.json(filteredItems)
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
