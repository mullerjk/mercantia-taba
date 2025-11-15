import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/register/route'
import { createMockRequest, getResponseJson } from '@/tests/helpers/api'
import { db } from '@/db'

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
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
      })),
    })),
  },
}))

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if email is missing', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: { password: 'Password123' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details.some((d: any) => d.field === 'email')).toBe(true)
  })

  it('should return 400 if password is missing', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: { email: 'test@example.com' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details.some((d: any) => d.field === 'password')).toBe(true)
  })

  it('should return 400 if email format is invalid', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: { email: 'invalid-email', password: 'Password123' },
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
      url: 'http://localhost:3000/api/auth/register',
      body: { email: 'test@example.com', password: 'Pass1' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details.some((d: any) => d.field === 'password')).toBe(true)
  })

  it('should return 400 if password does not meet complexity requirements', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: { email: 'test@example.com', password: 'password' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(data.details.some((d: any) => d.field === 'password')).toBe(true)
  })

  it('should return 409 if user already exists', async () => {
    // Mock user exists
    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([{
            id: '123',
            email: 'existing@example.com',
          }])),
        })),
      })),
    })

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: { email: 'existing@example.com', password: 'Password123' },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(409)
    expect(data.error).toBe('User with this email already exists')
  })

  it('should return 200 and create user if registration is successful', async () => {
    // Mock no existing user
    const mockDb = db as any
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })

    // Mock successful user creation
    mockDb.insert.mockReturnValue({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{
          id: '123',
          email: 'newuser@example.com',
          fullName: 'New User',
          passwordHash: 'hashed',
          role: 'user',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: null,
        }])),
      })),
    })

    mockDb.update.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
      })),
    })

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: {
        email: 'newuser@example.com',
        password: 'Password123',
        fullName: 'New User',
      },
    })

    const response = await POST(request)
    const data = await getResponseJson(response)

    expect(response.status).toBe(200)
    expect(data.token).toBeDefined()
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('newuser@example.com')
    expect(data.user.passwordHash).toBeUndefined() // Should not return password hash
    expect(data.message).toBe('User registered successfully')
  })
})
