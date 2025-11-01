"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, FileText, Trees, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DockNavigationProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export function DockNavigation({ showSidebar, onToggleSidebar }: DockNavigationProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center mb-6">
        <Dock direction="middle">
          <DockIcon>
            <Link
              href="/"
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                pathname === "/" ? "bg-gray-200" : "hover:bg-gray-50"
              }`}
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </DockIcon>

          <DockIcon>
            <button
              onClick={onToggleSidebar}
              className="flex size-12 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            >
              <Trees className="w-4 h-4" />
            </button>
          </DockIcon>

          <DockIcon>
            <Link
              href="/demo"
              className={`flex size-12 rounded-full items-center justify-center transition-colors ${
                pathname === "/demo" ? "bg-gray-200" : "hover:bg-gray-50"
              }`}
              aria-label="Demo"
            >
              <FileText className="w-4 h-4" />
            </Link>
          </DockIcon>

          <DockIcon>
            <button
              className="flex size-12 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </DockIcon>
        </Dock>
      </div>
    </>
  );
}
