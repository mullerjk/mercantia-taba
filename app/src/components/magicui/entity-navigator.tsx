"use client"

import React, { useState } from "react"
import { Tree, Folder, File } from "./file-tree"
import BlurFade from "./blur-fade"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

interface EntityNavigatorProps {
  entities?: unknown[]
  className?: string
  showSidebar?: boolean
}

export default function EntityNavigator({ className, showSidebar = true }: EntityNavigatorProps) {
  const [currentRoute, setCurrentRoute] = useState<string>("thing")

  const handleRouteChange = (route: string) => {
    setCurrentRoute(route)
  }

  return (
    <div className={cn("flex h-screen", className)}>
      {/* Sidebar com FileTree */}
      {showSidebar && (
        <div className="w-80">
          <div className="h-full flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold">World Explorer</h2>
              <p className="text-sm text-muted-foreground">Browse entities by type</p>
              <div className="mt-2 text-xs text-muted-foreground">
                Current route: <code className="bg-muted px-1 rounded">{currentRoute}</code>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <Tree className="h-full">
                {/* Thing (Root) */}
                <Folder
                  element="Thing (Root)"
                  value="thing"
                  isSelectable={true}
                  handleSelect={handleRouteChange}
                >
                  <File 
                    value="bio-entity" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "bio-entity" ? "font-bold bg-muted" : ""}
                  >
                    BioChemEntity
                  </File>
                  
                  <File 
                    value="chemical-substance" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "chemical-substance" ? "font-bold bg-muted" : ""}
                  >
                    ChemicalSubstance
                  </File>
                  
                  <File 
                    value="action" 
                    isSelectable={true} 
                    handleSelect={handleRouteChange}
                    className={currentRoute === "action" ? "font-bold bg-muted" : ""}
                  >
                    Action
                  </File>
                  
                  {/* CreativeWork */}
                  <Folder
                    element="CreativeWork"
                    value="creative-work"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="blog-posting" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "blog-posting" ? "font-bold bg-muted" : ""}
                    >
                      BlogPosting
                    </File>
                    <File 
                      value="news-article" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "news-article" ? "font-bold bg-muted" : ""}
                    >
                      NewsArticle
                    </File>
                    <File 
                      value="scholarly-article" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "scholarly-article" ? "font-bold bg-muted" : ""}
                    >
                      ScholarlyArticle
                    </File>
                    <File 
                      value="book" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "book" ? "font-bold bg-muted" : ""}
                    >
                      Book
                    </File>
                    <File 
                      value="movie" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "movie" ? "font-bold bg-muted" : ""}
                    >
                      Movie
                    </File>
                  </Folder>
                  
                  {/* Organization */}
                  <Folder
                    element="Organization"
                    value="organization"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="corporation" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "corporation" ? "font-bold bg-muted" : ""}
                    >
                      Corporation
                    </File>
                    <File 
                      value="local-business" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "local-business" ? "font-bold bg-muted" : ""}
                    >
                      LocalBusiness
                    </File>
                    <File 
                      value="nonprofit" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "nonprofit" ? "font-bold bg-muted" : ""}
                    >
                      NonprofitOrganization
                    </File>
                  </Folder>
                  
                  {/* Person */}
                  <Folder
                    element="Person"
                    value="person"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="person-profile" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "person-profile" ? "font-bold bg-muted" : ""}
                    >
                      Person Profile
                    </File>
                  </Folder>
                  
                  {/* Event */}
                  <Folder
                    element="Event"
                    value="event"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="business-event" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "business-event" ? "font-bold bg-muted" : ""}
                    >
                      BusinessEvent
                    </File>
                    <File 
                      value="festival" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "festival" ? "font-bold bg-muted" : ""}
                    >
                      Festival
                    </File>
                  </Folder>
                  
                  {/* Product */}
                  <Folder
                    element="Product"
                    value="product"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="software-app" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "software-app" ? "font-bold bg-muted" : ""}
                    >
                      SoftwareApplication
                    </File>
                    <File 
                      value="vehicle" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "vehicle" ? "font-bold bg-muted" : ""}
                    >
                      Vehicle
                    </File>
                  </Folder>
                  
                  {/* Place */}
                  <Folder
                    element="Place"
                    value="place"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="administrative-area" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "administrative-area" ? "font-bold bg-muted" : ""}
                    >
                      AdministrativeArea
                    </File>
                    <File 
                      value="residence" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "residence" ? "font-bold bg-muted" : ""}
                    >
                      Residence
                    </File>
                  </Folder>
                  
                  {/* Intangible */}
                  <Folder
                    element="Intangible"
                    value="intangible"
                    isSelectable={true}
                    handleSelect={handleRouteChange}
                  >
                    <File 
                      value="brand" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "brand" ? "font-bold bg-muted" : ""}
                    >
                      Brand
                    </File>
                    <File 
                      value="service" 
                      isSelectable={true} 
                      handleSelect={handleRouteChange}
                      className={currentRoute === "service" ? "font-bold bg-muted" : ""}
                    >
                      Service
                    </File>
                  </Folder>
                </Folder>
              </Tree>
            </div>
          </div>
        </div>
      )}

      {/* Área principal com roteamento dinâmico */}
      <div className="flex-1 overflow-auto">
        <RouteRenderer currentRoute={currentRoute} />
      </div>
    </div>
  )
}

// Componente que renderiza o conteúdo baseado na rota atual
function RouteRenderer({ currentRoute }: { currentRoute: string }) {
  const renderRoute = () => {
    switch (currentRoute) {
      case "thing":
        return <ThingRootRoute />
      
      case "bio-entity":
        return <EntityRoute route="bio-entity" title="BioChemEntity" description="Biological or chemical entities including proteins, DNA, RNA, and chemical compounds" icon="🧬" />
      
      case "chemical-substance":
        return <EntityRoute route="chemical-substance" title="ChemicalSubstance" description="Chemical compounds and substances" icon="⚗️" />
      
      case "action":
        return <EntityRoute route="action" title="Action" description="Actions performed by agents" icon="⚡" />
      
      case "creative-work":
        return <CategoryRoute title="CreativeWork" description="Creative works including books, movies, music, and art" icon="🎨" items={[
          { id: "blog-posting", name: "BlogPosting", icon: "📝" },
          { id: "news-article", name: "NewsArticle", icon: "📰" },
          { id: "scholarly-article", name: "ScholarlyArticle", icon: "🎓" },
          { id: "book", name: "Book", icon: "📚" },
          { id: "movie", name: "Movie", icon: "🎬" }
        ]} />
      
      case "blog-posting":
        return <EntityRoute route="blog-posting" title="BlogPosting" description="Blog articles and posts" icon="📝" />
      
      case "news-article":
        return <EntityRoute route="news-article" title="NewsArticle" description="News articles and journalism" icon="📰" />
      
      case "scholarly-article":
        return <EntityRoute route="scholarly-article" title="ScholarlyArticle" description="Academic papers and research articles" icon="🎓" />
      
      case "book":
        return <EntityRoute route="book" title="Book" description="Published books and literature" icon="📚" />
      
      case "movie":
        return <EntityRoute route="movie" title="Movie" description="Films and cinematic works" icon="🎬" />
      
      case "organization":
        return <CategoryRoute title="Organization" description="Organizations, companies, and institutions" icon="🏢" items={[
          { id: "corporation", name: "Corporation", icon: "🏢" },
          { id: "local-business", name: "LocalBusiness", icon: "🏪" },
          { id: "nonprofit", name: "NonprofitOrganization", icon: "🤝" }
        ]} />
      
      case "corporation":
        return <EntityRoute route="corporation" title="Corporation" description="Corporate entities and businesses" icon="🏢" />
      
      case "local-business":
        return <EntityRoute route="local-business" title="LocalBusiness" description="Local businesses and services" icon="🏪" />
      
      case "nonprofit":
        return <EntityRoute route="nonprofit" title="NonprofitOrganization" description="Non-profit organizations" icon="🤝" />
      
      case "person":
        return <CategoryRoute title="Person" description="Individual people and profiles" icon="👤" items={[
          { id: "person-profile", name: "Person Profile", icon: "👤" }
        ]} />
      
      case "person-profile":
        return <EntityRoute route="person-profile" title="Person Profile" description="Individual people and profiles" icon="👤" />
      
      case "event":
        return <CategoryRoute title="Event" description="Events, conferences, and gatherings" icon="🎯" items={[
          { id: "business-event", name: "BusinessEvent", icon: "💼" },
          { id: "festival", name: "Festival", icon: "🎉" }
        ]} />
      
      case "business-event":
        return <EntityRoute route="business-event" title="BusinessEvent" description="Business conferences and meetings" icon="💼" />
      
      case "festival":
        return <EntityRoute route="festival" title="Festival" description="Cultural festivals and celebrations" icon="🎉" />
      
      case "product":
        return <CategoryRoute title="Product" description="Products, goods, and services" icon="📦" items={[
          { id: "software-app", name: "SoftwareApplication", icon: "💻" },
          { id: "vehicle", name: "Vehicle", icon: "🚗" }
        ]} />
      
      case "software-app":
        return <EntityRoute route="software-app" title="SoftwareApplication" description="Software applications and programs" icon="💻" />
      
      case "vehicle":
        return <EntityRoute route="vehicle" title="Vehicle" description="Cars, planes, boats and transportation" icon="🚗" />
      
      case "place":
        return <CategoryRoute title="Place" description="Locations, buildings, and geographical features" icon="📍" items={[
          { id: "administrative-area", name: "AdministrativeArea", icon: "🗺️" },
          { id: "residence", name: "Residence", icon: "🏠" }
        ]} />
      
      case "administrative-area":
        return <EntityRoute route="administrative-area" title="AdministrativeArea" description="Geographic administrative regions" icon="🗺️" />
      
      case "residence":
        return <EntityRoute route="residence" title="Residence" description="Homes and residential properties" icon="🏠" />
      
      case "intangible":
        return <CategoryRoute title="Intangible" description="Non-physical concepts and services" icon="💡" items={[
          { id: "brand", name: "Brand", icon: "🏷️" },
          { id: "service", name: "Service", icon: "🛠️" }
        ]} />
      
      case "brand":
        return <EntityRoute route="brand" title="Brand" description="Brand names and trademarks" icon="🏷️" />
      
      case "service":
        return <EntityRoute route="service" title="Service" description="Service offerings and professional services" icon="🛠️" />
      
      default:
        return <NotFoundRoute />
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {renderRoute()}
      </div>
    </div>
  )
}

// Componente padrão para entidades individuais
function EntityRoute({ route, title, description, icon }: { route: string; title: string; description: string; icon: string }) {
  return (
    <BlurFade delay={0.2}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl mr-4">{icon}</span>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <Badge className="bg-primary text-primary-foreground">
              Schema.org Type
            </Badge>
          </div>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Schema Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Route:</strong> <code className="bg-muted px-2 py-1 rounded">{route}</code>
            </div>
            <div>
              <strong>Category:</strong> Schema.org Entity
            </div>
            <div>
              <strong>Usage:</strong> Structured Data
            </div>
            <div>
              <strong>Standard:</strong> Schema.org vocabulary
            </div>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}

// Componente para categorias (pastas)
function CategoryRoute({ title, description, icon, items }: { 
  title: string; 
  description: string; 
  icon: string;
  items: Array<{ id: string; name: string; icon: string }>
}) {
  return (
    <BlurFade delay={0.2}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl mr-4">{icon}</span>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <Badge className="bg-primary text-primary-foreground">
              Schema.org Category
            </Badge>
          </div>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground">Click to explore</p>
            </div>
          ))}
        </div>
      </div>
    </BlurFade>
  )
}

// Componentes especializados para pastas principais
function ThingRootRoute() {
  return (
    <BlurFade delay={0.2}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl mr-4">🌐</span>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-2">Thing (Root)</h1>
            <Badge className="bg-primary text-primary-foreground">
              Schema.org Root Class
            </Badge>
          </div>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The most generic type of item. All other Schema.org types are descendants of this type.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Properties</h3>
            <p className="text-sm text-muted-foreground">name, description, url, image</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Children</h3>
            <p className="text-sm text-muted-foreground">All other Schema.org types</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Usage</h3>
            <p className="text-sm text-muted-foreground">Base for structured data</p>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}

function NotFoundRoute() {
  return (
    <BlurFade delay={0.2}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl mr-4">❌</span>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-2">Route Not Found</h1>
            <Badge className="bg-destructive text-destructive-foreground">
              Error 404
            </Badge>
          </div>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The requested schema entity could not be found.
        </p>
      </div>
    </BlurFade>
  )
}
