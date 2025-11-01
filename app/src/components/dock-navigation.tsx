"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, FileText, Trees } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DockNavigationProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export function DockNavigation({ showSidebar, onToggleSidebar }: DockNavigationProps) {
  const [showMercantia, setShowMercantia] = useState(false);

  return (
    <>
      {/* Mercantia Full Screen Iframe */}
      {showMercantia && (
        <iframe 
          src="https://mercantia.app"
          className="fixed inset-0 w-full h-full border-0 z-[60] bg-white"
          title="Mercantia Marketplace"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}
      
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center mb-6">
        <Dock direction="middle">
          <DockIcon>
            <Link
              href="/"
              className="flex size-12 rounded-full items-center justify-center hover:bg-muted transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4 text-foreground" />
            </Link>
          </DockIcon>

          {/* Schema Explorer Toggle */}
          <DockIcon>
            <button
              onClick={() => {
                console.log('Toggle button clicked');
                onToggleSidebar();
              }}
              className="flex size-12 rounded-full items-center justify-center hover:bg-muted transition-colors"
              aria-label={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            >
              <Trees className="w-4 h-4 text-foreground" />
            </button>
          </DockIcon>

          <DockIcon>
            <Link
              href="/demo"
              className="flex size-12 rounded-full items-center justify-center hover:bg-muted transition-colors"
              aria-label="Demo"
            >
              <FileText className="w-4 h-4 text-foreground" />
            </Link>
          </DockIcon>

          {/* Mercantia Marketplace */}
          <DockIcon>
            <button
              onClick={() => setShowMercantia(!showMercantia)}
              className="flex size-12 rounded-full items-center justify-center hover:bg-muted transition-colors"
              aria-label="Mercantia Marketplace"
              title="Mercantia Marketplace"
            >
              <img 
                src="https://mercantia.app/logoMercantia.png" 
                alt="Mercantia"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to a simple icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallbackIcon = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackIcon) {
                    fallbackIcon.style.display = 'block';
                  }
                }}
              />
              <Trees className="w-4 h-4 text-foreground hidden" />
            </button>
          </DockIcon>
        </Dock>
      </div>
    </>
  );
}
