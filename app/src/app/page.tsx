"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - full width, not pushed by sidebar */}
      <div className="relative w-full">
        <h1 className="text-4xl font-bold text-center py-8">Welcome to Schema Explorer</h1>
        <p className="text-center text-muted-foreground mb-8">
          Explore Schema.org entities and types
        </p>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">CreativeWork</h3>
              <p className="text-sm text-muted-foreground">Books, movies, articles, and more</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Organization</h3>
              <p className="text-sm text-muted-foreground">Companies, businesses, and institutions</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Person</h3>
              <p className="text-sm text-muted-foreground">Individual people and profiles</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Event</h3>
              <p className="text-sm text-muted-foreground">Conferences, festivals, and gatherings</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Product</h3>
              <p className="text-sm text-muted-foreground">Goods, services, and software</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Place</h3>
              <p className="text-sm text-muted-foreground">Locations and geographical features</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Sidebar Overlay - positioned above content but below dock */}
      <GlobalSidebar 
        isVisible={showSidebar} 
        onClose={() => setShowSidebar(false)} 
      />

      {/* Dock Navigation - stays on top of everything */}
      <DockNavigation 
        showSidebar={showSidebar} 
        onToggleSidebar={toggleSidebar} 
      />
    </div>
  );
}
