"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, FileText, Trees, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DockNavigationProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export function DockNavigation({ showSidebar, onToggleSidebar }: DockNavigationProps) {
  const pathname = usePathname();
  const [showMercantia, setShowMercantia] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center mb-6">
        <Dock direction="middle" className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <DockIcon>
            <Link
              href="/"
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                !showMercantia && pathname === "/" ? "bg-gray-200 dark:bg-gray-700" : 
                !showMercantia ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""
              }`}
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </DockIcon>

          <DockIcon>
            <button
              onClick={onToggleSidebar}
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                !showMercantia && showSidebar ? "bg-gray-200 dark:bg-gray-700" : 
                !showMercantia ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""
              }`}
              aria-label={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            >
              <Trees className="w-4 h-4" />
            </button>
          </DockIcon>

          <DockIcon>
            <Link
              href="/demo"
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                !showMercantia && pathname === "/demo" ? "bg-gray-200 dark:bg-gray-700" : 
                !showMercantia ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""
              }`}
              aria-label="Demo"
            >
              <FileText className="w-4 h-4" />
            </Link>
          </DockIcon>

          <DockIcon>
            <button
              onClick={() => setShowMercantia(!showMercantia)}
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                showMercantia ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </DockIcon>
        </Dock>
      </div>

      {/* Mercantia Full Screen Iframe */}
      {showMercantia && (
        <iframe 
          src="https://mercantia.app"
          className="fixed inset-0 w-full h-full border-0 z-[50] bg-white"
          title="Mercantia Marketplace"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}
    </>
  );
}
