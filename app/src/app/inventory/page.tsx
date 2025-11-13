"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function InventoryPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected:", entityName);
  };

  const inventoryItems = [
    {
      id: 1,
      name: "Schema.org Toolkit Pro",
      category: "Software",
      stock: 45,
      price: 299.99,
      status: "Em Estoque",
      lastUpdated: "2 horas atrás",
      image: "📦"
    },
    {
      id: 2,
      name: "API Integration Suite",
      category: "Software",
      stock: 12,
      price: 149.99,
      status: "Baixo Estoque",
      lastUpdated: "1 dia atrás",
      image: "🔧"
    },
    {
      id: 3,
      name: "Data Analytics Platform",
      category: "Software",
      stock: 0,
      price: 499.99,
      status: "Fora de Estoque",
      lastUpdated: "3 dias atrás",
      image: "📊"
    },
    {
      id: 4,
      name: "Cloud Storage Solution",
      category: "Infrastructure",
      stock: 78,
      price: 89.99,
      status: "Em Estoque",
      lastUpdated: "5 horas atrás",
      image: "☁️"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return "bg-green-500";
      case "Baixo Estoque":
        return "bg-yellow-500";
      case "Fora de Estoque":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return <CheckCircle className="w-4 h-4" />;
      case "Baixo Estoque":
        return <AlertTriangle className="w-4 h-4" />;
      case "Fora de Estoque":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-8">
      {/* Header */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Inventário</h1>
                <p className="text-muted-foreground">Gerencie seus produtos e controle de estoque</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Statistics */}
            <div className="lg:col-span-1 space-y-6">
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Visão Geral</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Total Produtos</span>
                    </div>
                    <span className="font-bold">135</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Em Estoque</span>
                    </div>
                    <span className="font-bold">98</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Baixo Estoque</span>
                    </div>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Fora de Estoque</span>
                    </div>
                    <span className="font-bold">25</span>
                  </div>
                </div>
              </MagicCard>

              {/* Quick Actions */}
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Ações</h2>

                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Relatórios
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Alertas de Estoque
                  </Button>
                </div>
              </MagicCard>
            </div>

            {/* Inventory List */}
            <div className="lg:col-span-3">
              <MagicCard className="p-6">
                <h2 className="text-2xl font-bold mb-6">Seus Produtos</h2>

                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          {item.image}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <Badge
                              className={`text-xs text-white ${getStatusColor(item.status)}`}
                            >
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Estoque</p>
                          <p className="text-lg font-bold">{item.stock}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Preço</p>
                          <p className="text-lg font-bold">${item.price}</p>
                        </div>

                        <div className="text-right hidden md:block">
                          <p className="text-sm text-muted-foreground">Última atualização</p>
                          <p className="text-sm font-medium">{item.lastUpdated}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Carregar Mais Produtos
                  </Button>
                </div>
              </MagicCard>
            </div>
          </div>
        </div>
      </div>

      {/* Global Sidebar Overlay */}
      <GlobalSidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
        onEntitySelect={handleEntitySelect}
      />

      {/* Dock Navigation */}
      <DockNavigation
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
