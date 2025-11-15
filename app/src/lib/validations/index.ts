import { z } from 'zod'
import { NextResponse } from 'next/server'

/**
 * Validates data against a Zod schema and returns errors if validation fails
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with validated data or error response
 */
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: NextResponse } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: errors,
          },
          { status: 400 }
        ),
      }
    }

    // Unexpected error
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      ),
    }
  }
}

/**
 * Validates query parameters from URL searchParams
 *
 * @param schema - Zod schema to validate against
 * @param searchParams - URLSearchParams object
 * @returns Object with validated data or error response
 */
export function validateQueryParams<T extends z.ZodType>(
  schema: T,
  searchParams: URLSearchParams
): { success: true; data: z.infer<T> } | { success: false; error: NextResponse } {
  // Convert URLSearchParams to object
  const params: Record<string, string | number> = {}

  searchParams.forEach((value, key) => {
    // Try to parse as number if it looks like a number
    if (/^\d+$/.test(value)) {
      params[key] = parseInt(value, 10)
    } else {
      params[key] = value
    }
  })

  return validateData(schema, params)
}

// Re-export validation schemas
export * from './auth'
export * from './entities'
