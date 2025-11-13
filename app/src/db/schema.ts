/**
 * Drizzle ORM Schema for Knowledge Graph
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
  text
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

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
