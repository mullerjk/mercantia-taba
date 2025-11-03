"use client"

import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { MCPProvider } from "@/components/mcp-provider";
import { DockNavigation } from "@/components/dock-navigation";
import { SchemaOrgExplorer } from "@/components/schema-org-explorer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>World Explorer - Mercantia TABA</title>
        <meta name="description" content="Explore schema.org entities with interactive UI and MCP integration" />
      </head>
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MCPProvider>
            {/* Main Content */}
            {children}

            {/* Schema Explorer Sidebar - Global */}
            {showSidebar && (
              <div 
                className="fixed inset-0 z-40 bg-black/50"
                onClick={() => setShowSidebar(false)}
              >
                <div 
                  className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Schema.org Explorer</h2>
                    <SchemaOrgExplorer />
                  </div>
                </div>
              </div>
            )}

            {/* Dock Navigation - Global */}
            <DockNavigation 
              showSidebar={showSidebar} 
              onToggleSidebar={() => setShowSidebar(!showSidebar)} 
            />
          </MCPProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
