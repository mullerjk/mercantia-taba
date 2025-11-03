"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import SchemaOrgMCPService from "@/lib/schema-org-mcp-service"

interface MCPContextValue {
  service: SchemaOrgMCPService
  isReady: boolean
  error: string | null
}

const MCPContext = createContext<MCPContextValue | null>(null)

export function MCPProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [service] = useState(() => SchemaOrgMCPService.getInstance())

  useEffect(() => {
    console.log("🚀 Initializing MCP Service as the single source of truth for Schema.org")
    console.log("📌 Schema.org hierarchy will start from Thing as the root")
    
    // Service is already a singleton, so we just mark it as ready
    setIsReady(true)
    console.log("✅ MCP Service ready to use")
  }, [service])

  return (
    <MCPContext.Provider value={{ service, isReady, error }}>
      {children}
    </MCPContext.Provider>
  )
}

export function useMCP() {
  const context = useContext(MCPContext)
  if (!context) {
    throw new Error("useMCP must be used within MCPProvider")
  }
  return context
}

export function useMCPService() {
  const { service, isReady } = useMCP()
  return { service, isReady }
}
