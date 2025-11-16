"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShineBorder } from "@/components/ui/shine-border";
import { Home, ShoppingBag, ShoppingCart, User, Users, Package, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface DockNavigationProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onNavigate?: (page: string) => void;
}

export function DockNavigation({ showSidebar, onToggleSidebar, onNavigate }: DockNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showMercantia, setShowMercantia] = useState(false);
  const { state } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevItemCountRef = useRef(state.itemCount);

  // Animate cart badge only when item is actually added (count increases)
  useEffect(() => {
    if (state.itemCount > prevItemCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    prevItemCountRef.current = state.itemCount;
  }, [state.itemCount]);

  // Handle Home navigation - always closes Mercantia and goes to home
  const handleHomeClick = () => {
    setShowMercantia(false);
    router.push('/');
  };

  // Handle Marketplace navigation
  const handleMarketplaceClick = () => {
    if (onNavigate) {
      onNavigate('marketplace');
    }
  };

  // Handle Cart navigation
  const handleCartClick = () => {
    if (onNavigate) {
      onNavigate('cart');
    }
  };

  // Get current page from URL or pathname
  const getCurrentPage = () => {
    if (pathname === '/' || pathname === '') return 'dashboard';
    const segments = pathname.split('/').filter(Boolean);
    return segments[0] || 'dashboard';
  };

  const currentPage = getCurrentPage();



  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center mb-6">
        <div className="relative overflow-hidden rounded-3xl">
          <Dock direction="middle" className="bg-background/30 backdrop-blur-sm relative rounded-3xl border border-border/40">
            
            {/* Home Icon - Active only when not in Mercantia AND on home route */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleHomeClick}
                    className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                      !showMercantia && currentPage === "dashboard" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                    }`}
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[70]">
                  <p>Início</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>



            {/* ShoppingBag Icon - Navigate to marketplace */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleMarketplaceClick}
                    className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                      currentPage === "marketplace"
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    aria-label="Marketplace"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[70]">
                  <p>Marketplace</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            {/* ShoppingCart Icon - Only show when there are items in cart */}
            {state.itemCount > 0 && (
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCartClick}
                      className={`relative flex size-12 rounded-full items-center justify-center transition-colors ${
                        currentPage === "cart" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                      }`}
                      aria-label="Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <Badge
                        variant="destructive"
                        className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs transition-all duration-300 z-20 ${
                          isAnimating
                            ? 'animate-bounce scale-125'
                            : 'scale-100'
                        }`}
                      >
                        {state.itemCount}
                      </Badge>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[70]">
                    <p>Carrinho ({state.itemCount})</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            )}

            {/* Separator */}
            <div className="flex items-center px-2">
              <div className="w-px h-8 bg-border"></div>
            </div>

            {/* My Account Icon */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate?.('account')}
                    className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                      currentPage === "account" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                    }`}
                    aria-label="My Account"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[70]">
                  <p>Minha Conta</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            {/* My Relationships Icon */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate?.('relationships')}
                    className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                      currentPage === "relationships" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                    }`}
                    aria-label="My Relationships"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[70]">
                  <p>Minhas Relações</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            {/* Inventory Icon */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate?.('inventory')}
                    className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                      currentPage === "inventory" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                    }`}
                    aria-label="Inventory"
                  >
                    <Package className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[70]">
                  <p>Inventário</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            {/* My Finances Icon */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate?.('finances')}
                    className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                      currentPage === "finances" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                    }`}
                    aria-label="My Finances"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[70]">
                  <p>Minhas Finanças</p>
                </TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
}
