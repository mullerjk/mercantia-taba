import { NextRequest } from 'next/server'

/**
 * Helper function to create a mock NextRequest for testing
 */
export function createMockRequest(options: {
  method?: string
  url?: string
  body?: any
  headers?: Record<string, string>
}): NextRequest {
  const {
    method = 'GET',
    url = 'http://localhost:3000',
    body,
    headers = {},
  } = options

  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    init.body = JSON.stringify(body)
  }

  return new NextRequest(url, init)
}

/**
 * Helper to extract JSON from Response
 */
export async function getResponseJson(response: Response) {
  return await response.json()
}
