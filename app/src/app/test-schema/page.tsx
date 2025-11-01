"use client"

import { SchemaExplorerTree } from "@/components/schema-explorer-tree"
import { useState } from "react"

export default function TestSchemaPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)

  const handleEntitySelect = (entityName: string) => {
    setSelectedEntity(entityName)
    console.log("Selected entity:", entityName)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Schema Explorer</h1>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Schema Explorer Tree</h2>
          <div className="border rounded-lg">
            <SchemaExplorerTree 
              onEntitySelect={handleEntitySelect}
              className="h-96"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Selected Entity</h2>
          <div className="border rounded-lg p-4">
            <p>Selected entity: {selectedEntity || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
