"use client";

import { useState } from "react";
import EntityNavigator from "@/components/magicui/entity-navigator";
import { DockNavigation } from "@/components/dock-navigation";
import { mockSchemaData } from "@/data/mock-schemas";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    alert('Toggle clicked! Current state: ' + showSidebar);
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
