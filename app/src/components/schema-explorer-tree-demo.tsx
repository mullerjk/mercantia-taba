"use client"

import React from "react"
import { SchemaExplorerTree } from "@/components/schema-explorer-tree"

interface SchemaExplorerTreeDemoProps {
  className?: string
}

export function SchemaExplorerTreeDemo({ className }: SchemaExplorerTreeDemoProps) {
  const handleEntitySelect = (entityName: string) => {
    console.log("Selected entity:", entityName)
    // Here you could open a modal, navigate to a detail page, etc.
    // Example: showEntityDetails(entityName)
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <div className="bg-background p-4 border-b">
        <h2 className="text-lg font-semibold">Schema.org Entity Explorer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Browse Schema.org entities organized in a hierarchical tree structure
        </p>
      </div>
      
      <SchemaExplorerTree 
        onEntitySelect={handleEntitySelect}
        className="h-96"
      />
    </div>
  )
}

// Example usage in a page component:
/*
import { SchemaExplorerTreeDemo } from "@/components/schema-explorer-tree-demo"

export default function SchemaDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schema.org Entity Explorer</h1>
      <SchemaExplorerTreeDemo className="max-w-4xl mx-auto" />
    </div>
  )
}
*/
