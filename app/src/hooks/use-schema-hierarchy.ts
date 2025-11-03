"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import SchemaOrgMCPService, { SchemaNode } from "@/lib/schema-org-mcp-service"

interface UseSchemaHierarchyOptions {
  includeProperties?: boolean
  maxDepth?: number
}

export function useSchemaHierarchy(options: UseSchemaHierarchyOptions = {}) {
  const {
    includeProperties = false,
    maxDepth = 3
  } = options

  const [nodes, setNodes] = useState<SchemaNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Cache para evitar recarregar dados
  const [cache, setCache] = useState<Map<string, unknown>>(new Map())

  // Get MCP service instance
  const schemaService = useMemo(() => SchemaOrgMCPService.getInstance(), [])
  
  // Create a stable reference to avoid infinite loops
  const shouldLoad = useMemo(() => true, [])
  
  const loadSchemaHierarchy = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🌳 Loading Schema.org hierarchy via MCP server...')
      console.log('📌 Hierarchy starts from Thing as the single root')
      const hierarchy = await schemaService.loadCompleteHierarchy()
      
      console.log('📊 Hierarchy loaded:', {
        length: hierarchy.length,
        firstNode: hierarchy[0]?.name,
        firstNodeId: hierarchy[0]?.id,
        childrenCount: hierarchy[0]?.children?.length,
        sampleChildren: hierarchy[0]?.children?.slice(0, 10).map(c => ({ 
          name: c.name, 
          id: c.id,
          hasChildren: c.children?.length > 0
        }))
      })
      
      if (hierarchy.length === 0) {
        throw new Error('No hierarchy data loaded from MCP')
      }
      
      // Validate that Thing is the root
      if (hierarchy[0]?.name !== 'Thing') {
        console.warn('⚠️ Warning: First node is not Thing, got:', hierarchy[0]?.name)
      } else {
        console.log('✅ Hierarchy correctly starts from Thing')
        console.log(`✅ Thing has ${hierarchy[0]?.children?.length || 0} direct children`)
      }
      
      setNodes(hierarchy)
      console.log(`✅ Loaded complete hierarchy with ${hierarchy.length} root node(s) from MCP`)
      setLoading(false)
      
    } catch (err) {
      console.error('❌ Failed to load Schema.org hierarchy via MCP:', err)
      setError(`Failed to load Schema.org data via MCP: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setLoading(false)
    }
  }, [schemaService])

  useEffect(() => {
    if (shouldLoad) {
      loadSchemaHierarchy()
    }
  }, [shouldLoad, loadSchemaHierarchy])

  // Função para buscar no cache
  const getCachedData = (key: string) => {
    return cache.get(key)
  }

  // Função para filtrar children de um nó - envolvida em useCallback
  const filterNodeChildren = useCallback((node: SchemaNode, query: string): SchemaNode => {
    const filteredChildren = node.children
      .filter(child => 
        child.name.toLowerCase().includes(query) ||
        child.description.toLowerCase().includes(query)
      )
      .map(child => filterNodeChildren(child, query))

    return {
      ...node,
      children: filteredChildren
    }
  }, [])

  // Função para armazenar no cache
  const setCachedData = (key: string, data: unknown) => {
    setCache(prev => new Map(prev.set(key, data)))
  }

  // Filtrar nós baseado na busca
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes

    const query = searchQuery.toLowerCase()
    return nodes.filter(node => 
      node.name.toLowerCase().includes(query) ||
      node.description.toLowerCase().includes(query) ||
      node.entityType.toLowerCase().includes(query)
    ).map(node => filterNodeChildren(node, query))
  }, [nodes, searchQuery, filterNodeChildren])

  // Contar total de nós
  const totalNodes = useMemo(() => {
    const countNodes = (nodes: SchemaNode[]): number => {
      return nodes.reduce((count, node) => {
        return count + 1 + countNodes(node.children)
      }, 0)
    }
    return countNodes(nodes)
  }, [nodes])

  // Contar nós filtrados
  const filteredNodesCount = useMemo(() => {
    const countNodes = (nodes: SchemaNode[]): number => {
      return nodes.reduce((count, node) => {
        return count + 1 + countNodes(node.children)
      }, 0)
    }
    return countNodes(filteredNodes)
  }, [filteredNodes])

  return {
    nodes: filteredNodes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedNode,
    setSelectedNode,
    totalNodes,
    filteredNodesCount,
    reload: loadSchemaHierarchy,
    getCachedData,
    setCachedData
  }
}

export type { SchemaNode }
