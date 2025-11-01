"use client";

import { useState } from "react";
import EntityNavigator from "@/components/magicui/entity-navigator";
import { DockNavigation } from "@/components/dock-navigation";
import { mockSchemaData } from "@/data/mock-schemas";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    console.log('Toggling sidebar from', showSidebar, 'to', !showSidebar);
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Debug indicator */}
      <div className="fixed top-4 left-4 z-50 bg-blue-500 text-white px-4 py-2 rounded">
        Sidebar Visible: {showSidebar ? 'YES' : 'NO'}
      </div>
      
      <EntityNavigator 
        entities={mockSchemaData} 
        showSidebar={showSidebar} 
      />
      <DockNavigation 
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </>
  );
}
