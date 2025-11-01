"use client";

import React, { useState, useEffect } from "react";
import { Tree, Folder, File } from "./magicui/file-tree";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface GlobalSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export function GlobalSidebar({ isVisible, onClose, className }: GlobalSidebarProps) {
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
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-[46] pointer-events-auto shadow-xl",
        "transform transition-transform duration-300 ease-in-out",
        isVisible ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Schema Explorer</h2>
                <p className="text-sm text-muted-foreground">Browse entities by type</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Current: <code className="bg-muted px-1 rounded">{currentRoute}</code>
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
                  className={currentRoute === "bio-entity" ? "font-bold bg-muted" : ""}
                >
                  BioChemEntity
                </File>
                
                <File 
                  value="chemical-substance" 
                  isSelectable={true} 
                  handleSelect={handleRouteChange}
                  className={currentRoute === "chemical-substance" ? "font-bold bg-muted" : ""}
                >
                  ChemicalSubstance
                </File>
                
                <File 
                  value="action" 
                  isSelectable={true} 
                  handleSelect={handleRouteChange}
                  className={currentRoute === "action" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "blog-posting" ? "font-bold bg-muted" : ""}
                  >
                    BlogPosting
                  </File>
                  <File 
                    value="news-article" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "news-article" ? "font-bold bg-muted" : ""}
                  >
                    NewsArticle
                  </File>
                  <File 
                    value="scholarly-article" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "scholarly-article" ? "font-bold bg-muted" : ""}
                  >
                    ScholarlyArticle
                  </File>
                  <File 
                    value="book" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "book" ? "font-bold bg-muted" : ""}
                  >
                    Book
                  </File>
                  <File 
                    value="movie" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "movie" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "corporation" ? "font-bold bg-muted" : ""}
                  >
                    Corporation
                  </File>
                  <File 
                    value="local-business" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "local-business" ? "font-bold bg-muted" : ""}
                  >
                    LocalBusiness
                  </File>
                  <File 
                    value="nonprofit" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "nonprofit" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "person-profile" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "business-event" ? "font-bold bg-muted" : ""}
                  >
                    BusinessEvent
                  </File>
                  <File 
                    value="festival" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "festival" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "software-app" ? "font-bold bg-muted" : ""}
                  >
                    SoftwareApplication
                  </File>
                  <File 
                    value="vehicle" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "vehicle" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "administrative-area" ? "font-bold bg-muted" : ""}
                  >
                    AdministrativeArea
                  </File>
                  <File 
                    value="residence" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "residence" ? "font-bold bg-muted" : ""}
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
                    className={currentRoute === "brand" ? "font-bold bg-muted" : ""}
                  >
                    Brand
                  </File>
                  <File 
                    value="service" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "service" ? "font-bold bg-muted" : ""}
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
