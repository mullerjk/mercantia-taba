// Schema.org MCP Service - Unified interface for Schema.org data via MCP Server
// Provides comprehensive access to Schema.org vocabulary through MCP tools

export interface MCPSchemaType {
  name: string
  description: string
  id: string
  type: string | string[]
  superTypes: Array<{
    name: string
    id: string
  }>
  url: string
}

export interface MCPSchemaProperty {
  name: string
  description: string
  id: string
  expectedTypes: string[]
  inheritedFrom?: string
}

export interface MCPSchemaHierarchy {
  name: string
  id: string
  parents: Array<{
    name: string
    id: string
  }>
  children: Array<{
    name: string
    id: string
  }>
}

export interface SchemaNode {
  id: string
  name: string
  description: string
  entityType: string
  propertiesCount: number
  parentTypes: Array<{
    name: string
    id: string
  }>
  children: SchemaNode[]
  isAbstract: boolean
  url: string
  searchKeywords?: string[]
  category?: string
  popularity?: number
}

class SchemaOrgMCPService {
  private static instance: SchemaOrgMCPService
  private initialized = false
  private hierarchyCache: SchemaNode[] | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): SchemaOrgMCPService {
    if (!SchemaOrgMCPService.instance) {
      SchemaOrgMCPService.instance = new SchemaOrgMCPService()
    }
    return SchemaOrgMCPService.instance
  }

  private async callMCPTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    // For development with Cline, we'll simulate MCP calls
    // In production, this would communicate with the actual MCP server
    console.log(`🔧 MCP Tool Call: ${toolName}`, args)

    try {
      switch (toolName) {
        case 'get_schema_type': {
          const typeName = typeof args.typeName === 'string' ? args.typeName : String(args.typeName)
          return await this.getSchemaTypeDirect(typeName)
        }
        
        case 'search_schemas': {
          const query = typeof args.query === 'string' ? args.query : String(args.query)
          const limit = typeof args.limit === 'number' ? args.limit : 10
          return await this.searchSchemasDirect(query, limit)
        }
        
        case 'get_type_hierarchy': {
          const typeName = typeof args.typeName === 'string' ? args.typeName : String(args.typeName)
          return await this.getTypeHierarchyDirect(typeName)
        }
        
        case 'get_type_properties': {
          const typeName = typeof args.typeName === 'string' ? args.typeName : String(args.typeName)
          const includeInherited = typeof args.includeInherited === 'boolean' ? args.includeInherited : true
          return await this.getTypePropertiesDirect(typeName, includeInherited)
        }
        
        case 'generate_example': {
          const typeName = typeof args.typeName === 'string' ? args.typeName : String(args.typeName)
          const properties = args.properties as Record<string, unknown> | undefined
          return await this.generateExampleDirect(typeName, properties)
        }
        
        default:
          throw new Error(`Unknown MCP tool: ${toolName}`)
      }
    } catch (error) {
      console.error(`Error calling MCP tool ${toolName}:`, error)
      throw error
    }
  }

  // Direct schema.org API calls (simulating MCP responses)
  private async getSchemaTypeDirect(typeName: string): Promise<MCPSchemaType> {
    const { SchemaOrgClient } = await import('../../../mcp-schema-org/dist/schema-org-client.js')
    const client = new SchemaOrgClient()
    await client.initialize()
    return await client.getSchemaType(typeName)
  }

  private async searchSchemasDirect(query: string, limit: number = 10): Promise<unknown[]> {
    const { SchemaOrgClient } = await import('../../../mcp-schema-org/dist/schema-org-client.js')
    const client = new SchemaOrgClient()
    await client.initialize()
    return await client.searchSchemas(query, limit)
  }

  private async getTypeHierarchyDirect(typeName: string): Promise<MCPSchemaHierarchy> {
    const { SchemaOrgClient } = await import('../../../mcp-schema-org/dist/schema-org-client.js')
    const client = new SchemaOrgClient()
    await client.initialize()
    return await client.getTypeHierarchy(typeName)
  }

  private async getTypePropertiesDirect(typeName: string, includeInherited: boolean = true): Promise<MCPSchemaProperty[]> {
    const { SchemaOrgClient } = await import('../../../mcp-schema-org/dist/schema-org-client.js')
    const client = new SchemaOrgClient()
    await client.initialize()
    return await client.getTypeProperties(typeName, includeInherited)
  }

  private async generateExampleDirect(typeName: string, properties?: Record<string, unknown>): Promise<unknown> {
    const { SchemaOrgClient } = await import('../../../mcp-schema-org/dist/schema-org-client.js')
    const client = new SchemaOrgClient()
    await client.initialize()
    return await client.generateExample(typeName, properties)
  }

  async getSchemaType(typeName: string): Promise<MCPSchemaType> {
    return await this.callMCPTool('get_schema_type', { typeName }) as MCPSchemaType
  }

  async searchSchemas(query: string, limit: number = 10): Promise<unknown[]> {
    return await this.callMCPTool('search_schemas', { query, limit }) as unknown[]
  }

  async getTypeHierarchy(typeName: string): Promise<MCPSchemaHierarchy> {
    return await this.callMCPTool('get_type_hierarchy', { typeName }) as MCPSchemaHierarchy
  }

  async getTypeProperties(typeName: string, includeInherited: boolean = true): Promise<MCPSchemaProperty[]> {
    return await this.callMCPTool('get_type_properties', { typeName, includeInherited }) as MCPSchemaProperty[]
  }

  async generateExample(typeName: string, properties?: Record<string, unknown>): Promise<unknown> {
    return await this.callMCPTool('generate_example', { typeName, properties })
  }

  // High-level convenience methods
  async loadCompleteHierarchy(): Promise<SchemaNode[]> {
    // Check cache
    if (this.hierarchyCache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      console.log('📋 Using cached Schema.org hierarchy')
      return this.hierarchyCache
    }

    console.log('🔄 Loading complete Schema.org hierarchy via MCP...')
    console.log('📌 Schema.org hierarchy MUST start from Thing as the single root')

    try {
      // Clear cache first to force fresh load
      this.clearCache()
      
      // Schema.org has ONE true root: Thing
      // All other types inherit from Thing directly or indirectly
      console.log('🌳 Loading hierarchy starting from Thing (the Schema.org root)...')
      
      const hierarchy = await this.buildHierarchyFromRoot('Thing', 0, 4) // Increased depth to 4 for better exploration
      
      this.hierarchyCache = hierarchy
      this.cacheTimestamp = Date.now()
      console.log(`✅ Loaded ${this.countNodes(hierarchy)} Schema.org entities via MCP from Thing root`)
      return hierarchy
    } catch (error) {
      console.error('Failed to load Schema.org hierarchy:', error)
      throw new Error(`Failed to load Schema.org hierarchy: ${error}`)
    }
  }

  private async buildHierarchyFromRoot(typeName: string, depth: number, maxDepth: number): Promise<SchemaNode[]> {
    try {
      console.log(`${'  '.repeat(depth)}🔍 Building hierarchy for: ${typeName} (depth: ${depth}/${maxDepth})`)
      
      const hierarchy = await this.getTypeHierarchy(typeName)
      const typeInfo = await this.getSchemaType(typeName)
      const properties = await this.getTypeProperties(typeName, false) // Only direct properties for performance

      console.log(`${'  '.repeat(depth)}📊 ${typeName} has ${hierarchy.children.length} direct children`)

      const node: SchemaNode = {
        id: typeInfo.id,
        name: typeInfo.name,
        description: typeInfo.description,
        entityType: typeName,
        propertiesCount: properties.length,
        parentTypes: hierarchy.parents,
        children: [],
        isAbstract: hierarchy.children.length === 0, // Leaf nodes are concrete types
        url: typeInfo.url,
        searchKeywords: this.generateSearchKeywords(typeName, typeInfo.description),
        category: this.getTypeCategory(typeName),
        popularity: this.getPopularityScore(typeName)
      }

      // Load children recursively (no limit on children count)
      if (hierarchy.children.length > 0 && depth < maxDepth) {
        console.log(`${'  '.repeat(depth)}🌿 Loading all ${hierarchy.children.length} children for ${typeName}...`)
        
        const childPromises = hierarchy.children.map(async (child) => {
          try {
            return await this.buildHierarchyFromRoot(child.name, depth + 1, maxDepth)
          } catch (error) {
            console.warn(`${'  '.repeat(depth + 1)}⚠️ Failed to load child ${child.name}:`, error)
            return []
          }
        })

        const childResults = await Promise.all(childPromises)
        node.children = childResults.flat()
        
        console.log(`${'  '.repeat(depth)}✅ Loaded ${node.children.length} children for ${typeName}`)
      } else if (depth >= maxDepth && hierarchy.children.length > 0) {
        console.log(`${'  '.repeat(depth)}⚠️ Max depth reached for ${typeName}, skipping ${hierarchy.children.length} children`)
      }

      return [node]
    } catch (error) {
      console.error(`${'  '.repeat(depth)}❌ Error building hierarchy for ${typeName}:`, error)
      return [{
        id: `schema:${typeName}`,
        name: typeName,
        description: 'Failed to load description',
        entityType: typeName,
        propertiesCount: 0,
        parentTypes: [],
        children: [],
        isAbstract: true,
        url: `https://schema.org/${typeName}`,
        searchKeywords: [typeName.toLowerCase()],
        category: 'general',
        popularity: 50
      }]
    }
  }

  private generateSearchKeywords(typeName: string, description: string): string[] {
    const keywords = [
      typeName.toLowerCase(),
      ...typeName.toLowerCase().split(' '),
      ...description.toLowerCase().split(' ').slice(0, 5)
    ]
    return [...new Set(keywords)].filter((keyword, index, array) => array.indexOf(keyword) === index)
  }

  private getTypeCategory(typeName: string): string {
    const categories: Record<string, string> = {
      'Action': 'activity',
      'Event': 'events',
      'Organization': 'organizations',
      'Place': 'geography',
      'Person': 'people',
      'Product': 'commerce',
      'CreativeWork': 'media',
      'BioChemEntity': 'science',
      'Taxon': 'biology',
      'MedicalEntity': 'healthcare',
      'Intangible': 'abstract'
    }
    return categories[typeName] || 'general'
  }

  private getPopularityScore(typeName: string): number {
    const scores: Record<string, number> = {
      'Thing': 100,
      'Person': 97,
      'Product': 94,
      'Event': 98,
      'Organization': 92,
      'Place': 88,
      'CreativeWork': 91,
      'Action': 85,
      'LocalBusiness': 95,
      'Article': 90,
      'Restaurant': 85,
      'Store': 80
    }
    return scores[typeName] || 50
  }

  private countNodes(nodes: SchemaNode[]): number {
    return nodes.reduce((count, node) => {
      return count + 1 + this.countNodes(node.children)
    }, 0)
  }

  // Search functionality
  searchHierarchy(query: string, hierarchy: SchemaNode[], limit: number = 50): SchemaNode[] {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) return []

    const results: Array<SchemaNode & { score: number }> = []

    const searchNode = (node: SchemaNode, depth: number = 0) => {
      let score = 0
      
      if (node.name.toLowerCase().includes(searchTerm)) {
        score += 100 - depth * 5
      }
      
      if (node.description.toLowerCase().includes(searchTerm)) {
        score += 50 - depth * 3
      }
      
      if (node.searchKeywords) {
        const keywordMatch = node.searchKeywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        )
        if (keywordMatch) {
          score += 75 - depth * 4
        }
      }
      
      if (node.category?.toLowerCase().includes(searchTerm)) {
        score += 40 - depth * 2
      }
      
      score += (node.popularity || 50) * 0.1

      if (score > 10) {
        results.push({ ...node, score })
      }
      
      node.children?.forEach(child => searchNode(child, depth + 1))
    }

    hierarchy.forEach(node => searchNode(node))
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score: _score, ...node }) => node)
  }

  // Cache management
  clearCache(): void {
    this.hierarchyCache = null
    this.cacheTimestamp = 0
    console.log('🧹 Schema.org MCP cache cleared')
  }

  getCacheStatus(): { hasCache: boolean; age: number } {
    return {
      hasCache: this.hierarchyCache !== null,
      age: this.cacheTimestamp > 0 ? Date.now() - this.cacheTimestamp : 0
    }
  }
}

export default SchemaOrgMCPService
