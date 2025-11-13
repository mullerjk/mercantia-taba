"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  Users,
  UserPlus,
  MessageCircle,
  Heart,
  Building2,
  Handshake,
  Network,
  Search,
  Filter
} from "lucide-react";

export default function RelationshipsPage() {
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

  const relationships = [
    {
      id: 1,
      name: "Mercantia Solutions",
      type: "organization",
      role: "Parceiro Empresarial",
      status: "Ativo",
      lastInteraction: "2 dias atrás",
      avatar: "🏢"
    },
    {
      id: 2,
      name: "João Silva",
      type: "person",
      role: "Cliente",
      status: "Ativo",
      lastInteraction: "1 semana atrás",
      avatar: "👤"
    },
    {
      id: 3,
      name: "TechCorp Ltda",
      type: "organization",
      role: "Fornecedor",
      status: "Ativo",
      lastInteraction: "3 dias atrás",
      avatar: "🏢"
    },
    {
      id: 4,
      name: "Maria Santos",
      type: "person",
      role: "Colaborador",
      status: "Inativo",
      lastInteraction: "1 mês atrás",
      avatar: "👤"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-8">
      {/* Header */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Minhas Relações</h1>
                <p className="text-muted-foreground">Gerencie suas conexões e relacionamentos</p>
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
                <UserPlus className="w-4 h-4 mr-2" />
                Nova Relação
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
                <h2 className="text-xl font-bold mb-4">Estatísticas</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Organizações</span>
                    </div>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Pessoas</span>
                    </div>
                    <span className="font-bold">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Handshake className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Parceiros</span>
                    </div>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Ativos</span>
                    </div>
                    <span className="font-bold">35</span>
                  </div>
                </div>
              </MagicCard>

              {/* Quick Actions */}
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Ações</h2>

                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Convidar Contato
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Network className="w-4 h-4 mr-2" />
                    Expandir Rede
                  </Button>
                </div>
              </MagicCard>
            </div>

            {/* Relationships List */}
            <div className="lg:col-span-3">
              <MagicCard className="p-6">
                <h2 className="text-2xl font-bold mb-6">Suas Relações</h2>

                <div className="space-y-4">
                  {relationships.map((relationship) => (
                    <div
                      key={relationship.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          {relationship.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium">{relationship.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {relationship.role}
                            </Badge>
                            <Badge
                              variant={relationship.status === 'Ativo' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {relationship.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Última interação
                          </p>
                          <p className="text-sm font-medium">
                            {relationship.lastInteraction}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Carregar Mais Relações
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
