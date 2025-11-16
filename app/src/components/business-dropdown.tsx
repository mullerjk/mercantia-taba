"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, TrendingUp, Package, ShoppingCart, BarChart3, Calendar, Settings } from "lucide-react";

interface Store {
  id: string;
  name: string;
}

const businessMenuItems = [
  { tab: "overview", label: "Visão Geral", icon: TrendingUp },
  { tab: "products", label: "Produtos", icon: Package },
  { tab: "orders", label: "Pedidos", icon: ShoppingCart },
  { tab: "reports", label: "Relatórios", icon: BarChart3 },
  { tab: "history", label: "Histórico", icon: Calendar },
  { tab: "settings", label: "Configurações", icon: Settings },
];

export function BusinessDropdown({ sidebarCompact }: { sidebarCompact: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStores, setExpandedStores] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchStores();
  }, [user]);

  const fetchStores = async () => {
    try {
      setLoading(false);
      const response = await fetch("/api/stores", {
        headers: {
          "x-user-id": user?.id || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data);

        // Auto-expand current store if on business page
        if (pathname.startsWith("/business/")) {
          const storeId = pathname.split("/")[2]?.split("?")[0];
          if (storeId && storeId !== "") {
            setExpandedStores([storeId]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStore = (storeId: string) => {
    setExpandedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const isStoreActive = (storeId: string) => {
    const basePathname = pathname.split("?")[0];
    return basePathname.startsWith(`/business/${storeId}`);
  };

  const isMenuItemActive = (storeId: string, tab: string) => {
    const basePathname = pathname.split("?")[0];
    if (!basePathname.startsWith(`/business/${storeId}`)) return false;
    return currentTab === tab;
  };

  if (loading) {
    return null;
  }

  if (stores.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {stores.map((store) => (
        <Collapsible
          key={store.id}
          open={expandedStores.includes(store.id)}
          onOpenChange={() => toggleStore(store.id)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <button
              className={`flex w-full items-center py-2 hover:bg-accent rounded-md transition-colors ${
                sidebarCompact ? "justify-center px-1" : "gap-2 px-3"
              } ${
                isStoreActive(store.id)
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-label={store.name}
            >
              {expandedStores.includes(store.id) ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
              {!sidebarCompact && (
                <span className="font-medium text-sm truncate flex-1 text-left">
                  {store.name}
                </span>
              )}
            </button>
          </CollapsibleTrigger>

          {!sidebarCompact && (
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
              <div className="ml-4 space-y-1 mt-1">
                {businessMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isMenuItemActive(store.id, item.tab);
                  const href = `/business/${store.id}?tab=${item.tab}`;

                  return (
                    <Link
                      key={`${store.id}-${item.tab}`}
                      href={href}
                      className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      ))}
    </div>
  );
}
