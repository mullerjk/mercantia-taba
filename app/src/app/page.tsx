"use client";

import { useState } from "react";
import EntityNavigator from "@/components/magicui/entity-navigator";
import { DockNavigation } from "@/components/dock-navigation";
import { mockSchemaData } from "@/data/mock-schemas";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
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
