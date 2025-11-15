import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/login/route'
import { createMockRequest, getResponseJson } from '@/tests/helpers/api'
import { db } from '@/db'
import bcrypt from 'bcryptjs'

// Mock the database
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve([])),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
      })),
    })),
  },
}))

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if email is missing', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { password: 'password123' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details).toBeDefined()
    expect(data.details.some((d: any) => d.field === 'email')).toBe(true)
  })

  it('should return 400 if password is missing', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { email: 'test@example.com' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details).toBeDefined()
    expect(data.details.some((d: any) => d.field === 'password')).toBe(true)
  })

  it('should return 400 if email format is invalid', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { email: 'invalid-email', password: 'password123' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details.some((d: any) => d.field === 'email')).toBe(true)
  })

  it('should return 400 if password is too short', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { email: 'test@example.com', password: '123' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details.some((d: any) => d.field === 'password')).toBe(true)
  })

  it('should return 401 if user does not exist', async () => {
    // Mock empty user result
    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { email: 'nonexistent@example.com', password: 'password123' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })

  it('should return 401 if password is incorrect', async () => {
    const passwordHash = await bcrypt.hash('correctpassword', 12)

    // Mock user exists but wrong password
    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([{
            id: '123',
            email: 'test@example.com',
            passwordHash,
            role: 'user',
          }])),
        })),
      })),
    })

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { email: 'test@example.com', password: 'wrongpassword' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })

  it('should return 200 and token if login is successful', async () => {
    const password = 'password123'
    const passwordHash = await bcrypt.hash(password, 12)

    // Mock successful login
    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([{
            id: '123',
            email: 'test@example.com',
            passwordHash,
            role: 'user',
            fullName: 'Test User',
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: null,
          }])),
        })),
      })),
    })

    mockDb.insert.mockReturnValue({
      values: vi.fn(() => Promise.resolve([])),
    })

    mockDb.update.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
      })),
    })

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { email: 'test@example.com', password },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(200)
    expect(data.token).toBeDefined()
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.passwordHash).toBeUndefined() // Should not return password hash
    expect(data.message).toBe('Login successful')
  })
})
