/**
 * Knowledge Graph Types
 * Based on Schema.org and RDF triples
 */

// Base Entity (Node in the graph)
export interface Entity {
  id: string                    // UUID global único
  type: string                  // Schema.org type
  properties: Record<string, unknown>
  
  // Metadata
  createdAt: string
  createdBy?: string
  updatedAt?: string
  
  // Verification
  verifications: Verification[]
  trustScore?: number           // 0-100
}

// Verification proof
export interface Verification {
  method: string                // "government_id", "email", "phone", etc
  verifiedBy: string            // Authority/Oracle that verified
  timestamp: string
  expiresAt?: string
  proof?: {
    type: string
    url?: string
    hash?: string
  }
}

// Relation (Edge in the graph / Action)
export interface Relation {
  id: string
  type: string                  // Schema.org Action type
  
  // Triple structure
  agent: string                 // Entity ID who performs
  object: string                // Entity ID affected
  
  // Context
  startTime?: string
  endTime?: string
  location?: string             // Entity ID of Place
  
  // Verification
  proofs: Proof[]
  witnesses?: string[]          // Entity IDs
  
  // Metadata
  createdAt: string
  trustScore?: number
}

// Proof of a fact/relation
export interface Proof {
  type: string                  // "receipt", "photo", "document", "blockchain"
  url?: string                  // IPFS, Arweave, or regular URL
  hash?: string                 // SHA-256 or similar
  timestamp?: string
  verifiedBy?: string
  metadata?: Record<string, unknown>
}

// Source of data
export interface Source {
  type: string                  // "user_input", "api", "scraping", "sensor"
  url?: string
  timestamp: string
  reliability?: number          // 0-100
}

// Example entity types (Schema.org based)
export interface Person extends Entity {
  type: "Person"
  properties: {
    name: string
    email?: string
    telephone?: string
    birthDate?: string
    nationality?: string
    address?: string
    image?: string
    [key: string]: unknown
  }
}

export interface Product extends Entity {
  type: "Product"
  properties: {
    name: string
    description?: string
    brand?: string
    manufacturer?: string
    sku?: string
    image?: string
    category?: string
    price?: {
      value: number
      currency: string
    }
    [key: string]: unknown
  }
}

export interface Organization extends Entity {
  type: "Organization"
  properties: {
    name: string
    legalName?: string
    description?: string
    email?: string
    telephone?: string
    address?: string
    logo?: string
    foundingDate?: string
    [key: string]: unknown
  }
}

export interface Place extends Entity {
  type: "Place"
  properties: {
    name: string
    address?: string
    geo?: {
      latitude: number
      longitude: number
    }
    [key: string]: unknown
  }
}

// Example action types (Schema.org based)
export interface ConsumeAction extends Relation {
  type: "ConsumeAction"
  agent: string       // Person or Organization
  object: string      // Product or Service
}

export interface BuyAction extends Relation {
  type: "BuyAction"
  agent: string       // Person or Organization (buyer)
  object: string      // Product or Service
  seller?: string     // Organization ID
  price?: {
    value: number
    currency: string
  }
}

export interface ProduceAction extends Relation {
  type: "ProduceAction"
  agent: string       // Person or Organization (producer)
  object: string      // Product or CreativeWork
}

// Graph query result
export interface GraphNode {
  entity: Entity
  relations: {
    asAgent: Relation[]
    asObject: Relation[]
  }
  relatedEntities: Entity[]
}
