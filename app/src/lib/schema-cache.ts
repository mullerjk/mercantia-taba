/**
 * Schema.org Cache Layer using IndexedDB
 * Provides persistent client-side caching for Schema.org hierarchy
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface SchemaDB extends DBSchema {
  hierarchy: {
    key: string
    value: {
      version: string
      data: unknown
      timestamp: number
    }
  }
  nodes: {
    key: string
    value: {
      id: string
      data: unknown
      timestamp: number
    }
  }
}

const DB_NAME = 'schema-org-cache'
const DB_VERSION = 1
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

class SchemaCache {
  private db: IDBPDatabase<SchemaDB> | null = null
  private version = '3.0.0' // UPDATED: Metadata completa com childrenCount correto

  async init() {
    if (this.db) return

    try {
      this.db = await openDB<SchemaDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('hierarchy')) {
            db.createObjectStore('hierarchy')
          }
          if (!db.objectStoreNames.contains('nodes')) {
            db.createObjectStore('nodes')
          }
        },
      })
      console.log('✅ Schema cache initialized')
    } catch (error) {
      console.error('Failed to initialize cache:', error)
    }
  }

  async getHierarchy(): Promise<unknown | null> {
    if (!this.db) await this.init()
    if (!this.db) return null

    try {
      const cached = await this.db.get('hierarchy', 'full')
      
      if (!cached) {
        console.log('📦 Cache miss: hierarchy')
        return null
      }

      // Check version
      if (cached.version !== this.version) {
        console.log('🔄 Cache invalidated: version mismatch')
        await this.clear()
        return null
      }

      // Check TTL
      const age = Date.now() - cached.timestamp
      if (age > CACHE_TTL) {
        console.log('⏰ Cache expired:', Math.round(age / 1000 / 60), 'minutes old')
        await this.db.delete('hierarchy', 'full')
        return null
      }

      console.log('✅ Cache hit: hierarchy (age:', Math.round(age / 1000 / 60), 'min)')
      return cached.data
    } catch (error) {
      console.error('Cache read error:', error)
      return null
    }
  }

  async setHierarchy(data: unknown): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    try {
      await this.db.put('hierarchy', {
        version: this.version,
        data,
        timestamp: Date.now(),
      }, 'full')
      
      console.log('💾 Hierarchy cached')
    } catch (error) {
      console.error('Cache write error:', error)
    }
  }

  async getNode(nodeId: string): Promise<unknown | null> {
    if (!this.db) await this.init()
    if (!this.db) return null

    try {
      const cached = await this.db.get('nodes', nodeId)
      
      if (!cached) return null

      const age = Date.now() - cached.timestamp
      if (age > CACHE_TTL) {
        await this.db.delete('nodes', nodeId)
        return null
      }

      return cached.data
    } catch (error) {
      console.error('Node cache read error:', error)
      return null
    }
  }

  async setNode(nodeId: string, data: unknown): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    try {
      await this.db.put('nodes', {
        id: nodeId,
        data,
        timestamp: Date.now(),
      }, nodeId)
    } catch (error) {
      console.error('Node cache write error:', error)
    }
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    try {
      await this.db.clear('hierarchy')
      await this.db.clear('nodes')
      console.log('🧹 Cache cleared')
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  async getStats() {
    if (!this.db) await this.init()
    if (!this.db) return null

    try {
      const hierarchyCount = await this.db.count('hierarchy')
      const nodesCount = await this.db.count('nodes')
      
      return {
        version: this.version,
        hierarchyCount,
        nodesCount,
        dbSize: await this.estimateSize(),
      }
    } catch (error) {
      console.error('Stats error:', error)
      return null
    }
  }

  private async estimateSize(): Promise<string> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      return `${(usage / 1024 / 1024).toFixed(2)} MB`
    }
    return 'unknown'
  }
}

export const schemaCache = new SchemaCache()
