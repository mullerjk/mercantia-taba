import { z } from 'zod'

/**
 * Validation schemas for entity endpoints
 */

// Common entity types
const entityTypes = [
  'schema:Person',
  'schema:Product',
  'schema:Organization',
  'schema:LocalBusiness',
  'schema:Place',
  'schema:Event',
  'schema:Restaurant',
  'schema:Store',
  'schema:CreativeWork',
  'schema:Review',
] as const

// Relation types
const relationTypes = [
  'schema:ConsumeAction',
  'schema:BuyAction',
  'schema:ReviewAction',
  'schema:VisitAction',
  'schema:AttendAction',
  'schema:WorksForAction',
  'schema:OwnsAction',
  'schema:CreateAction',
] as const

export const createEntitySchema = z.object({
  type: z.enum(entityTypes, {
    errorMap: () => ({ message: 'Invalid entity type' }),
  }),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(500, 'Name is too long')
    .trim(),
  description: z
    .string()
    .max(5000, 'Description is too long')
    .trim()
    .optional()
    .nullable(),
  properties: z
    .record(z.any())
    .optional()
    .nullable(),
  trustScore: z
    .number()
    .min(0, 'Trust score must be at least 0')
    .max(100, 'Trust score must be at most 100')
    .optional()
    .default(50),
})

export const updateEntitySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(500, 'Name is too long')
    .trim()
    .optional(),
  description: z
    .string()
    .max(5000, 'Description is too long')
    .trim()
    .optional()
    .nullable(),
  properties: z
    .record(z.any())
    .optional()
    .nullable(),
  trustScore: z
    .number()
    .min(0, 'Trust score must be at least 0')
    .max(100, 'Trust score must be at most 100')
    .optional(),
})

export const createRelationSchema = z.object({
  type: z.enum(relationTypes, {
    errorMap: () => ({ message: 'Invalid relation type' }),
  }),
  fromEntityId: z
    .string()
    .uuid('Invalid entity ID format'),
  toEntityId: z
    .string()
    .uuid('Invalid entity ID format'),
  properties: z
    .record(z.any())
    .optional()
    .nullable(),
  trustScore: z
    .number()
    .min(0, 'Trust score must be at least 0')
    .max(100, 'Trust score must be at most 100')
    .optional()
    .default(50),
})

export const entityQuerySchema = z.object({
  type: z.enum([...entityTypes, 'all'] as const).optional(),
  search: z.string().max(200).optional(),
  limit: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20),
  offset: z
    .number()
    .min(0)
    .optional()
    .default(0),
})

// Type exports
export type CreateEntityInput = z.infer<typeof createEntitySchema>
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>
export type CreateRelationInput = z.infer<typeof createRelationSchema>
export type EntityQuery = z.infer<typeof entityQuerySchema>
