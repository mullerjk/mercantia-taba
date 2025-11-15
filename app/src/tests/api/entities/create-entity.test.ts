import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/entities/route'
import { createMockRequest, getResponseJson } from '@/tests/helpers/api'

// Mock the database
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('POST /api/entities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should create entity with valid data', async () => {
    const entityData = {
      schema_type: 'schema:Person',
      name: 'John Doe',
      givenName: 'John',
      familyName: 'Doe',
      email: 'john@example.com',
    }

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/entities',
      body: entityData,
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(201)
    expect(data.id).toBeDefined()
    expect(data.name).toBe('John Doe')
    expect(data.schema_type).toBe('schema:Person')
    expect(data.properties).toEqual(entityData)
  })

  it('should handle entity creation with minimal data', async () => {
    const entityData = {
      schema_type: 'schema:Product',
      name: 'Test Product',
    }

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/entities',
      body: entityData,
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(201)
    expect(data.name).toBe('Test Product')
  })

  it('should return 500 on malformed request', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/entities',
      body: null,
    })

    // Mock json() to throw error
    const mockRequest = {
      ...request,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as any

    const response = await POST(mockRequest)
    const data = await getResponseJson(response)

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })
})
