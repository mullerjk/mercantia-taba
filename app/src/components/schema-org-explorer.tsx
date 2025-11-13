"use client"

import React, { useState } from "react"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { SchemaTreeSimple } from "@/components/schema-tree-simple"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useSchemaLazy } from "@/hooks/use-schema-lazy"
import type { LazySchemaNode } from "@/lib/schema-loader"

interface SchemaOrgExplorerProps {
  onEntitySelect?: (entityName: string, entityId: string) => void
  className?: string
}

export function SchemaOrgExplorer({ onEntitySelect, className }: SchemaOrgExplorerProps) {
  const { nodes, loading, error, expandNode } = useSchemaLazy()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandingNodes, setExpandingNodes] = useState<Set<string>>(new Set())

  const handleSelect = (name: string, id: string) => {
    console.log('🎯 Entity selected:', name, id)
    setSelectedId(id)
    
    // Navigate to dynamic route using Next.js router
    if (typeof window !== 'undefined') {
      window.location.href = `/schema/${name}`
    }
    
    if (onEntitySelect) {
      onEntitySelect(name, id)
    }
  }

  const handleFolderClick = async (node: LazySchemaNode, event?: React.MouseEvent) => {
    console.log('📁 Folder clicked:', node.name, 'isLoaded:', node.isLoaded, 'children:', node.children?.length)
    
    // Prevent event propagation
    if (event) {
      event.stopPropagation()
    }
    
    // Select the node
    handleSelect(node.name, node.id)
    
    // If not loaded, expand it
    if (!node.isLoaded && !expandingNodes.has(node.id)) {
      setExpandingNodes(prev => new Set(prev).add(node.id))
      console.log('🔽 Expanding node:', node.id)
      
      try {
        await expandNode(node.id)
        console.log('✅ Node expanded successfully:', node.id)
      } catch (error) {
        console.error('❌ Failed to expand node:', error)
      } finally {
        setExpandingNodes(prev => {
          const next = new Set(prev)
          next.delete(node.id)
          return next
        })
      }
    }
  }

  const handleExpand = async (nodeId: string) => {
    console.log('🔽 Component: handleExpand called for:', nodeId)
    await expandNode(nodeId)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Loader2 className="size-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Loading Schema.org...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <AlertCircle className="size-8 text-destructive mb-4" />
          <p className="text-sm text-destructive font-medium mb-2">Failed to load Schema.org</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (nodes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <AlertCircle className="size-8 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No Schema.org data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Search bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search Schema.org types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tree */}
      <div className="border rounded-lg p-4 max-h-[600px] overflow-auto bg-card">
        <SchemaTreeSimple
          nodes={nodes}
          onExpand={handleExpand}
          onSelect={handleSelect}
          selectedId={selectedId}
          expandingNodes={expandingNodes}
        />
      </div>
    </div>
  )
}
