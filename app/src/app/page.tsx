"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("thing");

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    setCurrentRoute(route);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case "thing":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">🌐</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 text-foreground">Thing (Root)</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Root Class
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The most generic type of item. All other Schema.org types are descendants of this type.
            </p>
          </div>
        );
      case "bio-entity":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">🧬</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 text-foreground">BioChemEntity</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Type
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Biological or chemical entities including proteins, DNA, RNA, and chemical compounds
            </p>
          </div>
        );
      case "chemical-substance":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">⚗️</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 text-foreground">ChemicalSubstance</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Type
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Chemical compounds and substances
            </p>
          </div>
        );
      case "action":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">⚡</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 text-foreground">Action</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Type
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Actions performed by agents
            </p>
          </div>
        );
      case "creative-work":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">🎨</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 text-foreground">CreativeWork</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Category
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Creative works including books, movies, music, and art
            </p>
          </div>
        );
      case "organization":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">🏢</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 text-foreground">Organization</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Category
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Organizations, companies, and institutions
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">❓</span>
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2 capitalize text-foreground">{currentRoute.replace('-', ' ')}</h1>
                <Badge className="bg-primary text-primary-foreground">
                  Schema.org Entity
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore this Schema.org entity type
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content - full width, not pushed by sidebar */}
      <div className="relative w-full">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Global Sidebar Overlay - positioned above content but below dock */}
      <GlobalSidebar 
        isVisible={showSidebar} 
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
      />

      {/* Dock Navigation - stays on top of everything */}
      <DockNavigation 
        showSidebar={showSidebar} 
        onToggleSidebar={toggleSidebar} 
      />
    </div>
  );
}
