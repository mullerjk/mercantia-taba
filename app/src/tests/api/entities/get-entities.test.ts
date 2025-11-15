import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/entities/route'
import { createMockRequest, getResponseJson } from '@/tests/helpers/api'
import { db } from '@/db'

// Mock the database
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => Promise.resolve([])),
        })),
        orderBy: vi.fn(() => Promise.resolve([])),
      })),
    })),
  },
}))

describe('GET /api/entities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all entities when no type filter is provided', async () => {
    const mockEntities = [
      {
        id: '123',
        type: 'schema:Person',
        properties: { name: 'John Doe', description: 'A person' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '456',
        type: 'schema:Product',
        properties: { name: 'Test Product', description: 'A product' },
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ]

    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        orderBy: vi.fn(() => Promise.resolve(mockEntities)),
      })),
    })

    const request = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/entities',
    })

    const response = await GET(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(2)
    expect(data[0].name).toBe('John Doe')
    expect(data[0].schema_type).toBe('schema:Person')
  })

  it('should filter entities by type', async () => {
    const mockEntities = [
      {
        id: '123',
        type: 'schema:Person',
        properties: { name: 'John Doe', description: 'A person' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ]

    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => Promise.resolve(mockEntities)),
        })),
      })),
    })

    const request = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/entities?type=Person',
    })

    const response = await GET(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(1)
    expect(data[0].schema_type).toBe('schema:Person')
  })

  it('should handle empty results gracefully', async () => {
    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        orderBy: vi.fn(() => Promise.resolve([])),
      })),
    })

    const request = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/entities',
    })

    const response = await GET(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(0)
  })

  it('should return empty array on database error', async () => {
    const mockDb = db as any
    mockDb.select.mockImplementation(() => {
      throw new Error('Database connection failed')
    })

    const request = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/entities',
    })

    const response = await GET(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(0)
  })
})
