"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, Trees, ShoppingBag } from "lucide-react";
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

  // Handle Home navigation - always closes Mercantia and goes to home
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setShowMercantia(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center mb-6">
        <Dock direction="middle" className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          
          {/* Home Icon - Active only when not in Mercantia AND on home route */}
          <DockIcon>
            <Link
              href="/"
              onClick={handleHomeClick}
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                !showMercantia && pathname === "/" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </DockIcon>

          {/* Sidebar Toggle Icon - Independent state based only on showSidebar prop */}
          <DockIcon>
            <button
              onClick={onToggleSidebar}
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                showSidebar ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-label={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            >
              <Trees className="w-4 h-4" />
            </button>
          </DockIcon>

          {/* ShoppingBag Icon - Independent state based only on showMercantia state */}
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

      {/* Mercantia Full Screen Iframe - Independent overlay */}
      {showMercantia && (
        <iframe 
          src="https://mercantia.app"
          className="fixed inset-0 w-full h-full border-0 z-[40] bg-white"
          title="Mercantia Marketplace"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}
    </>
  );
}
