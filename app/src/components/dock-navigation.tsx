"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, FileText, Trees } from "lucide-react";
import Link from "next/link";

interface DockNavigationProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export function DockNavigation({ showSidebar, onToggleSidebar }: DockNavigationProps) {
  return (
    <>
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
        </Dock>
      </div>
    </>
  )
}
