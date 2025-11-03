"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShineBorder } from "@/components/ui/shine-border";
import { Home, Trees, ShoppingBag, Settings } from "lucide-react";
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
  const handleHomeClick = () => {
    setShowMercantia(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center mb-6">
        <div className="relative overflow-hidden rounded-3xl">
          <Dock direction="middle" className="bg-background relative rounded-3xl">
            
            {/* Home Icon - Active only when not in Mercantia AND on home route */}
            <DockIcon>
              <Link
                href="/"
                onClick={handleHomeClick}
                className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                  !showMercantia && pathname === "/" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
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
                  showSidebar ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
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
                  showMercantia ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </DockIcon>

            {/* Separator */}
            <div className="flex items-center px-2">
              <div className="w-px h-8 bg-border"></div>
            </div>

            {/* Settings Icon */}
            <DockIcon>
              <Link
                href="/settings"
                className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                  pathname === "/settings" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
                }`}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </DockIcon>

            {/* BorderBeam Effect - Inside the dock */}
            <BorderBeam 
              duration={12}
              size={30}
              colorFrom="#B8A5FF"
              colorTo="#F5B5D8"
              className="absolute inset-2 pointer-events-none rounded-3xl"
            />
            
            {/* ShineBorder Effect - Inside the dock */}
            <ShineBorder 
              borderWidth={1}
              duration={20}
              shineColor={["#B8A5FF", "#F5B5D8", "#FFD8B5"]}
              className="absolute inset-0 pointer-events-none rounded-3xl"
            />
          </Dock>
        </div>
      </div>

      {/* Mercantia Full Screen Iframe - Independent overlay */}
      {showMercantia && (
        <iframe 
          src="https://mercantia.app"
          className="fixed inset-0 w-full h-full border-0 z-[40] bg-background"
          title="Mercantia Marketplace"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}
    </>
  );
}
