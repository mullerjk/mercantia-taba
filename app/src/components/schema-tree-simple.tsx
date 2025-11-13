"use client"

import React, { useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { ChevronRight, ChevronDown, Loader2, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LazySchemaNode } from "@/lib/schema-loader"

// Helper para normalizar strings que podem vir como objetos JSON-LD
function normalizeString(value: any): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    // JSON-LD format: {"@language": "en", "@value": "text"}
    if ('@value' in value) return String(value['@value'])
    // Fallback
    return JSON.stringify(value)
  }
  return String(value || '')
}

interface SchemaTreeNodeProps {
  node: LazySchemaNode
  onExpand: (nodeId: string) => Promise<void>
  onSelect: (name: string, id: string) => void
  selectedId: string | null
  expandingNodes: Set<string>
  level?: number
}

function SchemaTreeNode({ 
  node, 
  onExpand, 
  onSelect, 
  selectedId, 
  expandingNodes,
  level = 0 
}: SchemaTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0) // Thing expandido por padrão
  const isSelected = selectedId === node.id
  const isExpanding = expandingNodes.has(node.id)
  const hasChildren = node.childrenCount > 0

  const handleChevronClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Impede propagação para não selecionar
    const newOpen = !isOpen
    console.log('🔽 Chevron clicked:', node.name, 'newOpen:', newOpen)
    
    setIsOpen(newOpen)
    
    // Se está abrindo e ainda não carregou, carregar agora
    if (newOpen && !node.isLoaded) {
      console.log('📥 Loading children for:', node.id)
      await onExpand(node.id)
    }
  }

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nodeName = normalizeString(node.name)
    console.log('🎯 Name clicked:', nodeName)
    onSelect(nodeName, node.id)
  }

  const displayName = normalizeString(node.name)

  if (!hasChildren) {
    // Leaf node - sem children (taxonomia final)
    return (
      <div
        onClick={handleNameClick}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isSelected && "bg-muted font-medium"
        )}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <Database className="size-4 text-blue-500" />
        <span>{displayName}</span>
      </div>
    )
  }

  // Node com children (pasta) - expandir no chevron, selecionar no nome
  return (
    <Collapsible.Root open={isOpen}>
      <div style={{ marginLeft: `${level * 20}px` }}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isSelected && "bg-muted font-medium"
          )}
        >
            {/* Chevron - APENAS expande/colapsa */}
            <button
              onClick={handleChevronClick}
              className="p-0 hover:opacity-70 transition-opacity"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isExpanding ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : isOpen ? (
                <ChevronDown className="size-4 text-muted-foreground transition-transform" />
              ) : (
                <ChevronRight className="size-4 text-muted-foreground transition-transform" />
              )}
            </button>
            
            {/* Nome - APENAS seleciona */}
            <span 
              className="flex-1 cursor-pointer" 
              onClick={handleNameClick}
            >
              {displayName}
            </span>
            
            {/* Badge de children count */}
            {!node.isLoaded && (
              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                {node.childrenCount}
              </span>
            )}
        </div>

        {/* Children */}
        <Collapsible.Content className={isOpen ? "" : "hidden"}>
          {node.children && node.isLoaded ? (
            <div className="mt-1">
              {node.children.map(child => (
                <SchemaTreeNode
                  key={child.id}
                  node={child}
                  onExpand={onExpand}
                  onSelect={onSelect}
                  selectedId={selectedId}
                  expandingNodes={expandingNodes}
                  level={level + 1}
                />
              ))}
            </div>
          ) : isOpen && !node.isLoaded ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground italic">
              <Loader2 className="size-3 animate-spin" />
              Loading {node.childrenCount} children...
            </div>
          ) : null}
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  )
}

interface SchemaTreeSimpleProps {
  nodes: LazySchemaNode[]
  onExpand: (nodeId: string) => Promise<void>
  onSelect: (name: string, id: string) => void
  selectedId: string | null
  expandingNodes: Set<string>
}

export function SchemaTreeSimple({ 
  nodes, 
  onExpand, 
  onSelect, 
  selectedId, 
  expandingNodes 
}: SchemaTreeSimpleProps) {
  return (
    <div className="space-y-1">
      {nodes.map(node => (
        <SchemaTreeNode
          key={node.id}
          node={node}
          onExpand={onExpand}
          onSelect={onSelect}
          selectedId={selectedId}
          expandingNodes={expandingNodes}
          level={0}
        />
      ))}
    </div>
  )
}
