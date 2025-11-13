"use client";

import React, { useState, useEffect } from "react";
import { SchemaExplorerTree } from "./schema-explorer-tree";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";

interface GlobalSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onRouteChange: (route: string) => void;
  onEntitySelect?: (entityName: string) => void;
  className?: string;
}

export function GlobalSidebar({ isVisible, onClose, onRouteChange, onEntitySelect, className }: GlobalSidebarProps) {
  const [currentRoute, setCurrentRoute] = useState<string>("thing");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const { t } = useTranslation();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  const handleEntitySelect = (entityName: string) => {
    console.log("GlobalSidebar: Entity selected:", entityName);
    setSelectedEntity(entityName);
    setCurrentRoute(entityName);
    onRouteChange(entityName);
    // Call the parent's entity select handler
    if (onEntitySelect) {
      console.log("GlobalSidebar: Calling parent onEntitySelect with:", entityName);
      onEntitySelect(entityName);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45] pointer-events-none"
        onClick={onClose}
      >
        {/* Clickable overlay that doesn't interfere with sidebar scroll */}
        <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
      </div>
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-[46] pointer-events-auto shadow-xl",
        "transform transition-transform duration-300 ease-in-out",
        isVisible ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {t('sidebar.current')} <code className="bg-muted px-1 rounded text-foreground">{currentRoute}</code>
              {selectedEntity && (
                <div className="mt-1">
                  {t('sidebar.selected')} <code className="bg-secondary px-1 rounded text-foreground">{selectedEntity}</code>
                </div>
              )}
            </div>
          </div>
          
          {/* Schema Explorer Tree */}
          <div className="flex-1 overflow-auto">
            <SchemaExplorerTree 
              onEntitySelect={handleEntitySelect}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
