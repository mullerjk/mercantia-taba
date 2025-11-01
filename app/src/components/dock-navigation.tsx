"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, FileText, Trees } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SchemaExplorerModal from "@/components/schema-explorer-modal";

export function DockNavigation() {
  const [isSchemaExplorerOpen, setIsSchemaExplorerOpen] = useState(false)

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

          {/* Schema Explorer Icon */}
          <DockIcon>
            <button
              onClick={() => setIsSchemaExplorerOpen(true)}
              className="flex size-12 rounded-full items-center justify-center hover:bg-muted transition-colors"
              aria-label="Schema Explorer"
              title="Schema Explorer"
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
      
      {/* Schema Explorer Modal */}
      <SchemaExplorerModal 
        isOpen={isSchemaExplorerOpen}
        onClose={() => setIsSchemaExplorerOpen(false)}
      />
    </>
  )
}
