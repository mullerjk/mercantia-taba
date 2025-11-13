"use client"

import { useState, useEffect, useCallback } from 'react'
import { schemaCache } from '@/lib/schema-cache'
import { schemaLoader, type LazySchemaNode } from '@/lib/schema-loader'

interface UseSchemaLazyReturn {
  nodes: LazySchemaNode[]
  loading: boolean
  error: string | null
  expandNode: (nodeId: string) => Promise<void>
  reload: () => Promise<void>
  stats: {
    loadedNodes: number
    cacheHit: boolean
  }
}

export function useSchemaLazy(): UseSchemaLazyReturn {
  const [nodes, setNodes] = useState<LazySchemaNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cacheHit, setCacheHit] = useState(false)

  const loadHierarchy = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const startTime = performance.now()
    console.log('🔄 Loading Schema.org hierarchy (lazy mode)...')

    try {
      // Try cache first
      const cached = await schemaCache.getHierarchy() as LazySchemaNode[] | null
      
      if (cached && cached.length > 0) {
        setCacheHit(true)
        setNodes(cached)
        const elapsed = performance.now() - startTime
        console.log(`⚡ Loaded from cache in ${elapsed.toFixed(0)}ms`)
        setLoading(false)
        return
      }

      // Cache miss - load fresh
      setCacheHit(false)
      const hierarchy = await schemaLoader.loadInitial()
      
      // Cache for next time
      await schemaCache.setHierarchy(hierarchy)
      
      setNodes(hierarchy)
      
      const elapsed = performance.now() - startTime
      console.log(`✅ Fresh load complete in ${elapsed.toFixed(0)}ms`)
      setLoading(false)
      
    } catch (err) {
      console.error('❌ Failed to load hierarchy:', err)
      setError(err instanceof Error ? err.message : 'Failed to load Schema.org')
      setLoading(false)
    }
  }, [])

  const expandNode = useCallback(async (nodeId: string) => {
    console.log(`🔽 Hook: Expanding node: ${nodeId}`)
    
    try {
      const expanded = await schemaLoader.expandNode(nodeId)
      
      if (!expanded) {
        console.error(`❌ Hook: No data returned for ${nodeId}`)
        return
      }
      
      console.log(`✅ Hook: Expanded node ${nodeId}, has ${expanded.children?.length || 0} children`)
      
      // Update nodes tree with expanded data
      setNodes(current => {
        console.log(`🔄 Hook: Updating tree, current nodes:`, current.length)
        
        const updateTree = (nodes: LazySchemaNode[]): LazySchemaNode[] => {
          return nodes.map(node => {
            if (node.id === nodeId) {
              console.log(`✅ Hook: Found and updating node ${nodeId}`)
              return { ...expanded, isExpanded: true }
            }
            if (node.children) {
              return { ...node, children: updateTree(node.children) }
            }
            return node
          })
        }
        
        const updated = updateTree(current)
        
        // Update cache async
        schemaCache.setHierarchy(updated).catch(console.error)
        
        return updated
      })
    } catch (err) {
      console.error(`❌ Hook: Failed to expand node ${nodeId}:`, err)
      throw err
    }
  }, [])

  const reload = useCallback(async () => {
    await schemaCache.clear()
    schemaLoader.clear()
    await loadHierarchy()
  }, [loadHierarchy])

  useEffect(() => {
    loadHierarchy()
  }, [loadHierarchy])

  return {
    nodes,
    loading,
    error,
    expandNode,
    reload,
    stats: {
      loadedNodes: schemaLoader.getStats().loadedNodes,
      cacheHit,
    },
  }
}
