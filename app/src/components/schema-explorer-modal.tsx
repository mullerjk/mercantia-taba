"use client"

import React, { useState } from "react"
import { X, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import EntityNavigator from "./magicui/entity-navigator"

interface SchemaExplorerModalProps {
  isOpen: boolean
  onClose: () => void
  showSidebar?: boolean
}

export default function SchemaExplorerModal({ isOpen, onClose, showSidebar = true }: SchemaExplorerModalProps) {
  if (!isOpen) return null

  const [isSidebarVisible, setIsSidebarVisible] = useState(showSidebar)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <Card className="w-[95vw] h-[90vh] max-w-[1200px] max-h-[800px] flex flex-col overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">World Explorer</h2>
            <p className="text-sm text-muted-foreground">
              Navigate through Schema.org entities and types
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
              title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              {isSidebarVisible ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <EntityNavigator showSidebar={isSidebarVisible} />
        </div>
      </Card>
    </div>
  )
}
