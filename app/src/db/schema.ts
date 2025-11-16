/**
 * Drizzle ORM Schema for Knowledge Graph and Authentication
 * Based on Schema.org entities and relations
 */

import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  integer,
  index,
  text,
  boolean
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table for authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(), // 'user', 'admin', 'moderator'

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  lastLoginAt: timestamp('last_login_at'),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  roleIdx: index('idx_users_role').on(table.role),
}))

// User sessions for JWT tokens
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 support
}, (table) => ({
  userIdIdx: index('idx_user_sessions_user_id').on(table.userId),
  tokenIdx: index('idx_user_sessions_token').on(table.token),
  expiresAtIdx: index('idx_user_sessions_expires_at').on(table.expiresAt),
}))

// Main entities table (nodes in the graph)
export const entities = pgTable('entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 100 }).notNull(), // Schema.org type
  properties: jsonb('properties').notNull().$type<Record<string, unknown>>(),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: uuid('created_by'),
  updatedAt: timestamp('updated_at'),
  
  // Trust and verification
  trustScore: integer('trust_score'), // 0-100
}, (table) => ({
  typeIdx: index('idx_entities_type').on(table.type),
  createdAtIdx: index('idx_entities_created_at').on(table.createdAt),
}))

// Relations table (edges in the graph / Schema.org Actions)
export const relationsTable = pgTable('relations', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 100 }).notNull(), // Schema.org Action type
  
  // Triple structure: subject-predicate-object
  agentId: uuid('agent_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  objectId: uuid('object_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  
  // Context
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  locationId: uuid('location_id').references(() => entities.id),
  context: jsonb('context').$type<Record<string, unknown>>(),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  trustScore: integer('trust_score'), // 0-100
}, (table) => ({
  agentIdx: index('idx_relations_agent').on(table.agentId),
  objectIdx: index('idx_relations_object').on(table.objectId),
  typeIdx: index('idx_relations_type').on(table.type),
  startTimeIdx: index('idx_relations_start_time').on(table.startTime),
}))

// Verifications table
export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityId: uuid('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  
  method: varchar('method', { length: 100 }).notNull(), // e.g., "government_id", "email"
  verifiedBy: varchar('verified_by', { length: 255 }).notNull(), // Authority
  
  timestamp: timestamp('timestamp').notNull(),
  expiresAt: timestamp('expires_at'),
  
  proof: jsonb('proof').$type<{
    type: string
    url?: string
    hash?: string
  }>(),
}, (table) => ({
  entityIdx: index('idx_verifications_entity').on(table.entityId),
  methodIdx: index('idx_verifications_method').on(table.method),
}))

// Proofs table (evidence for relations)
export const proofs = pgTable('proofs', {
  id: uuid('id').primaryKey().defaultRandom(),
  relationId: uuid('relation_id').notNull().references(() => relationsTable.id, { onDelete: 'cascade' }),
  
  type: varchar('type', { length: 50 }).notNull(), // "photo", "receipt", "document", "blockchain"
  url: text('url'), // IPFS, Arweave, or regular URL
  hash: varchar('hash', { length: 255 }), // SHA-256 or similar
  
  timestamp: timestamp('timestamp'),
  verifiedBy: varchar('verified_by', { length: 255 }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
}, (table) => ({
  relationIdx: index('idx_proofs_relation').on(table.relationId),
  typeIdx: index('idx_proofs_type').on(table.type),
}))

// Witnesses table (people who witnessed a relation/fact)
export const witnesses = pgTable('witnesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  relationId: uuid('relation_id').notNull().references(() => relationsTable.id, { onDelete: 'cascade' }),
  entityId: uuid('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  relationIdx: index('idx_witnesses_relation').on(table.relationId),
  entityIdx: index('idx_witnesses_entity').on(table.entityId),
}))

// Drizzle Relations (for joins)
export const entitiesRelations = relations(entities, ({ many }) => ({
  actionsAsAgent: many(relationsTable, { relationName: 'agent' }),
  actionsAsObject: many(relationsTable, { relationName: 'object' }),
  verifications: many(verifications),
}))

export const relationsRelations = relations(relationsTable, ({ one, many }) => ({
  agent: one(entities, {
    fields: [relationsTable.agentId],
    references: [entities.id],
    relationName: 'agent'
  }),
  object: one(entities, {
    fields: [relationsTable.objectId],
    references: [entities.id],
    relationName: 'object'
  }),
  location: one(entities, {
    fields: [relationsTable.locationId],
    references: [entities.id],
  }),
  proofs: many(proofs),
  witnesses: many(witnesses),
}))

export const verificationsRelations = relations(verifications, ({ one }) => ({
  entity: one(entities, {
    fields: [verifications.entityId],
    references: [entities.id],
  }),
}))

export const proofsRelations = relations(proofs, ({ one }) => ({
  relation: one(relationsTable, {
    fields: [proofs.relationId],
    references: [relationsTable.id],
  }),
}))

export const witnessesRelations = relations(witnesses, ({ one }) => ({
  relation: one(relationsTable, {
    fields: [witnesses.relationId],
    references: [relationsTable.id],
  }),
  entity: one(entities, {
    fields: [witnesses.entityId],
    references: [entities.id],
  }),
}))

// ============================================
// MARKETPLACE TABLES
// ============================================

// Stores table (vendor shops/businesses)
export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  bannerUrl: text('banner_url'),

  // Contact information
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  website: text('website'),

  // Location (stored as JSONB for flexibility)
  address: jsonb('address').$type<{
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }>(),

  // Store metadata
  rating: integer('rating').default(0), // 0-5
  reviewCount: integer('review_count').default(0),
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  userIdIdx: index('idx_stores_user_id').on(table.userId),
  slugIdx: index('idx_stores_slug').on(table.slug),
  isActiveIdx: index('idx_stores_is_active').on(table.isActive),
}))

// Products/Services table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),

  // Pricing
  price: integer('price').notNull(), // Price in cents (e.g., 9999 = $99.99)
  cost: integer('cost'), // Cost for vendor (for profit tracking)
  currency: varchar('currency', { length: 3 }).default('USD'),

  // Product details
  sku: varchar('sku', { length: 100 }),
  images: jsonb('images').$type<Array<{ url: string; alt?: string }>>().default([]),

  // Inventory
  inventory: integer('inventory').default(0), // Stock quantity

  // Categorization
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags').$type<string[]>().default([]),

  // Metadata
  rating: integer('rating').default(0), // 0-5
  reviewCount: integer('review_count').default(0),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  storeIdIdx: index('idx_products_store_id').on(table.storeId),
  slugIdx: index('idx_products_slug').on(table.slug),
  categoryIdx: index('idx_products_category').on(table.category),
  isActiveIdx: index('idx_products_is_active').on(table.isActive),
}))

// Carts table
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_carts_user_id').on(table.userId),
}))

// Cart Items table
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),

  quantity: integer('quantity').notNull().default(1),
  pricePerUnit: integer('price_per_unit').notNull(), // Snapshot of price at time of addition (in cents)

  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  cartIdIdx: index('idx_cart_items_cart_id').on(table.cartId),
  productIdIdx: index('idx_cart_items_product_id').on(table.productId),
}))

// Orders table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'restrict' }),

  // Order status: pending, confirmed, processing, shipped, delivered, cancelled, refunded
  status: varchar('status', { length: 50 }).notNull().default('pending'),

  // Pricing breakdown (in cents)
  subtotal: integer('subtotal').notNull(), // Sum of item prices
  tax: integer('tax').notNull().default(0),
  shippingCost: integer('shipping_cost').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  total: integer('total').notNull(), // subtotal + tax + shippingCost - discount

  // Customer notes
  notes: text('notes'),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  confirmedAt: timestamp('confirmed_at'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
}, (table) => ({
  userIdIdx: index('idx_orders_user_id').on(table.userId),
  storeIdIdx: index('idx_orders_store_id').on(table.storeId),
  statusIdx: index('idx_orders_status').on(table.status),
  createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
}))

// Order Items table
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),

  quantity: integer('quantity').notNull(),
  pricePerUnit: integer('price_per_unit').notNull(), // Price at time of order (in cents)
  total: integer('total').notNull(), // quantity * pricePerUnit
}, (table) => ({
  orderIdIdx: index('idx_order_items_order_id').on(table.orderId),
  productIdIdx: index('idx_order_items_product_id').on(table.productId),
}))

// Shipping Addresses table
export const shippingAddresses = pgTable('shipping_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Address details
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),

  street: varchar('street', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),

  // Metadata
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  userIdIdx: index('idx_shipping_addresses_user_id').on(table.userId),
  isDefaultIdx: index('idx_shipping_addresses_is_default').on(table.isDefault),
}))

// Order Addresses (snapshot of shipping address at order time)
export const orderAddresses = pgTable('order_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }).unique(),

  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),

  street: varchar('street', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
}, (table) => ({
  orderIdIdx: index('idx_order_addresses_order_id').on(table.orderId),
}))

// ============================================
// RELATIONS (for Drizzle ORM joins)
// ============================================

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  products: many(products),
  orders: many(orders),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}))

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  items: many(orderItems),
  shippingAddress: one(orderAddresses),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const shippingAddressesRelations = relations(shippingAddresses, ({ one }) => ({
  user: one(users, {
    fields: [shippingAddresses.userId],
    references: [users.id],
  }),
}))

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [orderAddresses.orderId],
    references: [orders.id],
  }),
}))
