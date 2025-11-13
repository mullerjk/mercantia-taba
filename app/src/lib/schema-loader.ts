/**
 * Schema.org Lazy Loader
 * Loads schema hierarchy progressively instead of all at once
 */

import { SchemaOrgClient } from '../../../mcp-schema-org/dist/schema-org-client.js'

export interface LazySchemaNode {
  id: string
  name: string
  description: string
  parentTypes: Array<{ name: string; id: string }>
  childrenCount: number
  propertiesCount: number
  children?: LazySchemaNode[]
  isLoaded: boolean
  isExpanded: boolean
}

class SchemaLoader {
  private client: SchemaOrgClient | null = null
  private loadedNodes = new Map<string, LazySchemaNode>()

  private async getClient(): Promise<SchemaOrgClient> {
    if (!this.client) {
      this.client = new SchemaOrgClient()
      await this.client.initialize()
    }
    return this.client
  }

  /**
   * Load only Thing + direct children (initial load)
   */
  async loadInitial(): Promise<LazySchemaNode[]> {
    console.log('🚀 Lazy loading: Thing + direct children metadata')
    const startTime = performance.now()

    const client = await this.getClient()
    
    // Get Thing info
    const thingType = await client.getSchemaType('Thing')
    const thingHierarchy = await client.getTypeHierarchy('Thing')
    const thingProps = await client.getTypeProperties('Thing', false)

    console.log(`📊 Thing has ${thingHierarchy.children.length} direct children, loading metadata...`)

    // Helper to normalize strings (handle JSON-LD format)
    const normalizeString = (value: unknown): string => {
      if (typeof value === 'string') return value
      if (value && typeof value === 'object' && '@value' in value) {
        return String((value as Record<string, unknown>)['@value'])
      }
      return String(value || '')
    }

    // Helper para ordenar: pastas primeiro, depois alfabético
    const sortNodes = <T extends { name: unknown; childrenCount: number }>(nodes: T[]): T[] => {
      return nodes.sort((a, b) => {
        // Pastas primeiro (com children)
        const aHasChildren = a.childrenCount > 0
        const bHasChildren = b.childrenCount > 0
        
        if (aHasChildren && !bHasChildren) return -1
        if (!aHasChildren && bHasChildren) return 1
        
        // Depois alfabético (normalize strings first)
        const aName = normalizeString(a.name)
        const bName = normalizeString(b.name)
        return aName.localeCompare(bName)
      })
    }

    // Load metadata (childrenCount) for each direct child in parallel
    const childrenMetadata = await Promise.all(
      thingHierarchy.children.map(async (child) => {
        try {
          const childHierarchy = await client.getTypeHierarchy(child.name)
          return {
            id: child.id,
            name: child.name,
            description: '',
            parentTypes: [{ name: 'Thing', id: 'schema:Thing' }],
            childrenCount: childHierarchy.children.length, // Quantos filhos tem
            propertiesCount: 0,
            isLoaded: false,
            isExpanded: false,
          }
        } catch (error) {
          console.warn(`Failed to load metadata for ${child.name}:`, error)
          return {
            id: child.id,
            name: child.name,
            description: '',
            parentTypes: [{ name: 'Thing', id: 'schema:Thing' }],
            childrenCount: 0,
            propertiesCount: 0,
            isLoaded: false,
            isExpanded: false,
          }
        }
      })
    )

    // Sort children: folders first, then alphabetically
    const sortedChildren = sortNodes(childrenMetadata)
    
    // Debug: log sorting results
    console.log('📁 Sorted children:')
    sortedChildren.forEach(child => {
      const type = child.childrenCount > 0 ? '📁 Folder' : '📄 File'
      console.log(`  ${type} ${child.name.padEnd(20)} (${child.childrenCount} children)`)
    })

    // Create Thing node with children placeholders
    const thingNode: LazySchemaNode = {
      id: thingType.id,
      name: thingType.name,
      description: thingType.description,
      parentTypes: [],
      childrenCount: thingHierarchy.children.length,
      propertiesCount: thingProps.length,
      children: sortedChildren,
      isLoaded: true,
      isExpanded: true,
    }

    this.loadedNodes.set(thingNode.id, thingNode)

    const elapsed = performance.now() - startTime
    console.log(`✅ Initial load complete in ${elapsed.toFixed(0)}ms (${thingHierarchy.children.length} direct children with metadata)`)

    return [thingNode]
  }

  /**
   * Load children of a specific node on-demand
   */
  async expandNode(nodeId: string): Promise<LazySchemaNode | null> {
    const cached = this.loadedNodes.get(nodeId)
    
    // Already loaded
    if (cached?.isLoaded) {
      console.log(`✅ Node already loaded: ${cached.name}`)
      return cached
    }

    console.log(`📥 Loading node: ${nodeId}`)
    const startTime = performance.now()

    const client = await this.getClient()
    const typeName = nodeId.replace('schema:', '')

    try {
      const [typeInfo, hierarchy, props] = await Promise.all([
        client.getSchemaType(typeName),
        client.getTypeHierarchy(typeName),
        client.getTypeProperties(typeName, false),
      ])

      // Load metadata for children to enable proper sorting
      const childrenWithMetadata = await Promise.all(
        hierarchy.children.map(async (child) => {
          try {
            const childHierarchy = await client.getTypeHierarchy(child.name)
            return {
              id: child.id,
              name: child.name,
              description: '',
              parentTypes: [{ name: typeInfo.name, id: typeInfo.id }],
              childrenCount: childHierarchy.children.length,
              propertiesCount: 0,
              isLoaded: false,
              isExpanded: false,
            }
          } catch {
            return {
              id: child.id,
              name: child.name,
              description: '',
              parentTypes: [{ name: typeInfo.name, id: typeInfo.id }],
              childrenCount: 0,
              propertiesCount: 0,
              isLoaded: false,
              isExpanded: false,
            }
          }
        })
      )

      // Helper to normalize strings
      const normalizeString = (value: unknown): string => {
        if (typeof value === 'string') return value
        if (value && typeof value === 'object' && '@value' in value) {
          return String((value as Record<string, unknown>)['@value'])
        }
        return String(value || '')
      }

      // Sort: folders first, then alphabetically
      const sortedChildren = childrenWithMetadata.sort((a, b) => {
        const aHasChildren = a.childrenCount > 0
        const bHasChildren = b.childrenCount > 0
        
        if (aHasChildren && !bHasChildren) return -1
        if (!aHasChildren && bHasChildren) return 1
        
        const aName = normalizeString(a.name)
        const bName = normalizeString(b.name)
        return aName.localeCompare(bName)
      })

      const node: LazySchemaNode = {
        id: typeInfo.id,
        name: typeInfo.name,
        description: typeInfo.description,
        parentTypes: hierarchy.parents,
        childrenCount: hierarchy.children.length,
        propertiesCount: props.length,
        children: sortedChildren,
        isLoaded: true,
        isExpanded: false,
      }

      this.loadedNodes.set(nodeId, node)

      const elapsed = performance.now() - startTime
      console.log(`✅ Node loaded in ${elapsed.toFixed(0)}ms: ${node.name} (${hierarchy.children.length} children)`)

      return node
    } catch (error) {
      console.error(`Failed to load node ${nodeId}:`, error)
      return null
    }
  }

  /**
   * Get node from cache
   */
  getNode(nodeId: string): LazySchemaNode | undefined {
    return this.loadedNodes.get(nodeId)
  }

  /**
   * Clear all loaded nodes
   */
  clear() {
    this.loadedNodes.clear()
    console.log('🧹 Loader cache cleared')
  }

  /**
   * Get loader stats
   */
  getStats() {
    return {
      loadedNodes: this.loadedNodes.size,
      nodes: Array.from(this.loadedNodes.values()).map(n => ({
        name: n.name,
        loaded: n.isLoaded,
        childrenCount: n.childrenCount,
      })),
    }
  }
}

export const schemaLoader = new SchemaLoader()
