import { z } from 'zod'

/**
 * Validation schemas for marketplace endpoints
 */

// ============================================
// STORE VALIDATIONS
// ============================================

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(2, 'Store name must be at least 2 characters')
    .max(255, 'Store name is too long')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description is too long')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .nullable(),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .nullable(),
  logoUrl: z
    .string()
    .url('Invalid logo URL')
    .optional()
    .nullable(),
  bannerUrl: z
    .string()
    .url('Invalid banner URL')
    .optional()
    .nullable(),
  address: z
    .object({
      street: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      state: z.string().optional().nullable(),
      zipCode: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})

export const updateStoreSchema = createStoreSchema.partial()

// ============================================
// PRODUCT VALIDATIONS
// ============================================

export const createProductSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(255, 'Product name is too long')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),
  description: z
    .string()
    .max(5000, 'Description is too long')
    .optional()
    .nullable(),
  price: z
    .number()
    .int('Price must be an integer (in cents)')
    .positive('Price must be greater than 0'),
  cost: z
    .number()
    .int('Cost must be an integer (in cents)')
    .positive('Cost must be greater than 0')
    .optional()
    .nullable(),
  currency: z
    .string()
    .length(3, 'Currency must be 3 characters')
    .default('USD'),
  sku: z
    .string()
    .max(100, 'SKU is too long')
    .optional()
    .nullable(),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().optional().nullable(),
      })
    )
    .default([]),
  inventory: z
    .number()
    .int('Inventory must be an integer')
    .nonnegative('Inventory cannot be negative')
    .default(0),
  category: z
    .string()
    .max(100, 'Category is too long')
    .optional()
    .nullable(),
  tags: z
    .array(z.string())
    .default([]),
})

export const updateProductSchema = createProductSchema.partial().extend({
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL').optional(),
        alt: z.string().optional().nullable(),
      })
    )
    .optional(),
})

// ============================================
// CART VALIDATIONS
// ============================================

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .positive('Quantity must be at least 1'),
})

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .positive('Quantity must be at least 1'),
})

// ============================================
// SHIPPING ADDRESS VALIDATIONS
// ============================================

export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(255, 'Full name is too long')
    .trim(),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .nullable(),
  street: z
    .string()
    .min(2, 'Street must be at least 2 characters')
    .max(255, 'Street is too long')
    .trim(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City is too long')
    .trim(),
  state: z
    .string()
    .max(100, 'State is too long')
    .trim()
    .optional()
    .nullable(),
  zipCode: z
    .string()
    .min(2, 'ZIP code must be at least 2 characters')
    .max(20, 'ZIP code is too long')
    .trim(),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country is too long')
    .trim(),
  isDefault: z.boolean().default(false),
})

export const createShippingAddressSchema = shippingAddressSchema

export const updateShippingAddressSchema = shippingAddressSchema.partial()

// ============================================
// ORDER VALIDATIONS
// ============================================

export const createOrderSchema = z.object({
  shippingAddressId: z.string().uuid('Invalid shipping address ID'),
  notes: z
    .string()
    .max(1000, 'Notes are too long')
    .optional()
    .nullable(),
})

export const updateOrderStatusSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .default('pending'),
})

// ============================================
// PAGINATION VALIDATIONS
// ============================================

export const paginationSchema = z.object({
  limit: z
    .number()
    .int('Limit must be an integer')
    .positive('Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  offset: z
    .number()
    .int('Offset must be an integer')
    .nonnegative('Offset cannot be negative')
    .default(0),
})

// ============================================
// PRODUCT FILTER VALIDATIONS
// ============================================

export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['newest', 'price-asc', 'price-desc', 'rating']).default('newest'),
  ...paginationSchema.shape,
})

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateStoreInput = z.infer<typeof createStoreSchema>
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>

export type CreateShippingAddressInput = z.infer<typeof createShippingAddressSchema>
export type UpdateShippingAddressInput = z.infer<typeof updateShippingAddressSchema>
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

export type PaginationInput = z.infer<typeof paginationSchema>
export type ProductFilterInput = z.infer<typeof productFilterSchema>
