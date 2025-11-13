"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SchemaExplorerTree } from "./schema-explorer-tree";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, ShoppingBag, ShoppingCart } from "lucide-react";

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
  const { user, profile, signOut } = useAuth();
  const { state } = useCart();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

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
            <div className="flex items-center justify-between">
              {/* User Section */}
              <div className="flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {profile?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {profile?.role || 'user'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Close Button */}
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

            {/* User Actions */}
            {user && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <Link href="/marketplace">
                  <Button variant="ghost" size="sm" className="h-8">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Marketplace
                  </Button>
                </Link>
                {state.itemCount > 0 && (
                  <Link href="/checkout">
                    <Button variant="ghost" size="sm" className="h-8 relative">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {state.itemCount}
                      </Badge>
                    </Button>
                  </Link>
                )}
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground">
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
