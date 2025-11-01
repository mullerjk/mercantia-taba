"use client";

import React, { useState, useEffect } from "react";
import { Tree, Folder, File } from "./magicui/file-tree";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface GlobalSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onRouteChange: (route: string) => void;
  className?: string;
}

export function GlobalSidebar({ isVisible, onClose, onRouteChange, className }: GlobalSidebarProps) {
  const [currentRoute, setCurrentRoute] = useState<string>("thing");

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

  const handleRouteChange = (route: string) => {
    setCurrentRoute(route);
    onRouteChange(route);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45] pointer-events-auto"
        onClick={onClose}
      />
      
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">World Explorer</h2>
                <p className="text-sm text-muted-foreground">Browse entities by type</p>
              </div>
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
              Current: <code className="bg-muted px-1 rounded text-foreground">{currentRoute}</code>
            </div>
          </div>
          
          {/* Tree Navigation */}
          <div className="flex-1 overflow-auto p-4">
            <Tree className="h-full">
              {/* Thing (Root) */}
              <Folder
                element="Thing (Root)"
                value="thing"
                isSelectable={true}
                handleSelect={handleRouteChange}
              >
                <File 
                  value="bio-entity" 
                  isSelectable={true} 
                  handleSelect={handleRouteChange}
                  className={cn(
                    "text-foreground",
                    currentRoute === "bio-entity" ? "font-bold bg-secondary" : ""
                  )}
                >
                  BioChemEntity
                </File>
                
                <File 
                  value="chemical-substance" 
                  isSelectable={true} 
                  handleSelect={handleRouteChange}
                  className={cn(
                    "text-foreground",
                    currentRoute === "chemical-substance" ? "font-bold bg-secondary" : ""
                  )}
                >
                  ChemicalSubstance
                </File>
                
                <File 
                  value="action" 
                  isSelectable={true} 
                  handleSelect={handleRouteChange}
                  className={cn(
                    "text-foreground",
                    currentRoute === "action" ? "font-bold bg-secondary" : ""
                  )}
                >
                  Action
                </File>
                
                {/* CreativeWork */}
                <Folder
                  element="CreativeWork"
                  value="creative-work"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="blog-posting" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "blog-posting" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    BlogPosting
                  </File>
                  <File 
                    value="news-article" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "news-article" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    NewsArticle
                  </File>
                  <File 
                    value="scholarly-article" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "scholarly-article" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    ScholarlyArticle
                  </File>
                  <File 
                    value="book" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "book" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Book
                  </File>
                  <File 
                    value="movie" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "movie" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Movie
                  </File>
                </Folder>
                
                {/* Organization */}
                <Folder
                  element="Organization"
                  value="organization"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="corporation" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "corporation" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Corporation
                  </File>
                  <File 
                    value="local-business" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "local-business" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    LocalBusiness
                  </File>
                  <File 
                    value="nonprofit" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "nonprofit" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    NonprofitOrganization
                  </File>
                </Folder>
                
                {/* Person */}
                <Folder
                  element="Person"
                  value="person"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="person-profile" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "person-profile" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Person Profile
                  </File>
                </Folder>
                
                {/* Event */}
                <Folder
                  element="Event"
                  value="event"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="business-event" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "business-event" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    BusinessEvent
                  </File>
                  <File 
                    value="festival" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "festival" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Festival
                  </File>
                </Folder>
                
                {/* Product */}
                <Folder
                  element="Product"
                  value="product"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="software-app" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "software-app" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    SoftwareApplication
                  </File>
                  <File 
                    value="vehicle" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "vehicle" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Vehicle
                  </File>
                </Folder>
                
                {/* Place */}
                <Folder
                  element="Place"
                  value="place"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="administrative-area" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "administrative-area" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    AdministrativeArea
                  </File>
                  <File 
                    value="residence" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "residence" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Residence
                  </File>
                </Folder>
                
                {/* Intangible */}
                <Folder
                  element="Intangible"
                  value="intangible"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="brand" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "brand" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Brand
                  </File>
                  <File 
                    value="service" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={cn(
                      "text-foreground",
                      currentRoute === "service" ? "font-bold bg-secondary" : ""
                    )}
                  >
                    Service
                  </File>
                </Folder>
              </Folder>
            </Tree>
          </div>
        </div>
      </div>
    </>
  );
}
