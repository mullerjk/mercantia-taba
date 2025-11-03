"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState("thing");

  const renderContent = () => {
    switch (currentRoute) {
      case "thing":
        return (
          <div className="bg-card border border-border rounded-2xl p-8 relative">
            <div className="text-center relative z-10">
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
              <div className="flex gap-4 justify-center">
                <RainbowButton size="lg">
                  Explore Schema.org
                </RainbowButton>
                <ShimmerButton 
                  background="rgba(158, 122, 255, 0.8)"
                  shimmerColor="#ffffff"
                >
                  Learn More
                </ShimmerButton>
              </div>
            </div>
          </div>
        );
      case "bio-entity":
        return (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">🧬</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">BioChemEntity</h1>
                  <Badge className="bg-green-500 text-white">
                    Schema.org Type
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Biological or chemical entities including proteins, DNA, RNA, and chemical compounds
              </p>
              <RainbowButton variant="outline" size="sm">
                View Details
              </RainbowButton>
            </div>
          </div>
        );
      case "chemical-substance":
        return (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">⚗️</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">ChemicalSubstance</h1>
                  <Badge className="bg-orange-500 text-white">
                    Schema.org Type
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Chemical compounds and substances
              </p>
              <ShimmerButton 
                background="rgba(245, 158, 11, 0.8)"
                shimmerColor="#ffffff"
                shimmerSize="0.1em"
              >
                Explore Chemistry
              </ShimmerButton>
            </div>
          </div>
        );
      case "action":
        return (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">⚡</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">Action</h1>
                  <Badge className="bg-blue-500 text-white">
                    Schema.org Type
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Actions performed by agents
              </p>
              <RainbowButton size="sm">
                See Actions
              </RainbowButton>
            </div>
          </div>
        );
      case "creative-work":
        return (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">🎨</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">CreativeWork</h1>
                  <Badge className="bg-purple-500 text-white">
                    Schema.org Category
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Creative works including books, movies, music, and art
              </p>
              <div className="flex gap-3 justify-center">
                <RainbowButton size="sm" variant="outline">
                  Browse
                </RainbowButton>
                <ShimmerButton 
                  background="rgba(236, 72, 153, 0.8)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.08em"
                >
                  Create
                </ShimmerButton>
              </div>
            </div>
          </div>
        );
      case "organization":
        return (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">🏢</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">Organization</h1>
                  <Badge className="bg-teal-500 text-white">
                    Schema.org Category
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Organizations, companies, and institutions
              </p>
              <RainbowButton>
                View Organizations
              </RainbowButton>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">❓</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2 capitalize text-foreground">
                    {(currentRoute || 'Unknown').replace('-', ' ')}
                  </h1>
                  <Badge className="bg-gray-500 text-white">
                    Schema.org Entity
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore this Schema.org entity type
              </p>
              <ShimmerButton 
                background="rgba(107, 114, 128, 0.8)"
                shimmerColor="#ffffff"
              >
                Start Exploring
              </ShimmerButton>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="relative w-full">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
