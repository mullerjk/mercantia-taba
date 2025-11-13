import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Query PostgreSQL directly using psql command
    let query = 'SELECT * FROM schema_entities ORDER BY created_at DESC'
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
        const typeList = subtypes.map(t => `'${t}'`).join(', ')
        query = `SELECT * FROM schema_entities WHERE schema_type IN (${typeList}) ORDER BY created_at DESC`
      } else {
        // For specific types, exact match
        query = `SELECT * FROM schema_entities WHERE schema_type = '${schemaType}' ORDER BY created_at DESC`
      }
    }

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
      return {
        id,
        name,
        description: description || '',
        schema_type,
        parent_types: parent_types ? parent_types.split(',') : [],
        properties: properties ? JSON.parse(properties) : {},
        is_abstract: is_abstract === 't',
        created_at,
        updated_at
      }
    }).filter(entity => entity.id) // Filter out empty lines

    return NextResponse.json(entities)
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
