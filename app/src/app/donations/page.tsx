"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  Heart,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  MapPin,
  Globe
} from "lucide-react";

export default function DonationsPage() {
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

  const donations = [
    {
      id: 1,
      title: "Ajuda Humanitária - Ucrânia",
      description: "Apoio emergencial para famílias afetadas pelo conflito",
      category: "Humanitária",
      amount: 2500.00,
      goal: 5000.00,
      donors: 45,
      status: "Ativa",
      location: "Ucrânia",
      endDate: "2025-12-31",
      image: "🇺🇦"
    },
    {
      id: 2,
      title: "Educação para Todos",
      description: "Construção de escola em comunidade carente",
      category: "Educação",
      amount: 8500.00,
      goal: 15000.00,
      donors: 120,
      status: "Ativa",
      location: "Brasil",
      endDate: "2025-08-15",
      image: "📚"
    },
    {
      id: 3,
      title: "Proteção Ambiental",
      description: "Reflorestamento da Amazônia",
      category: "Meio Ambiente",
      amount: 12000.00,
      goal: 25000.00,
      donors: 89,
      status: "Ativa",
      location: "Amazônia",
      endDate: "2025-11-30",
      image: "🌳"
    },
    {
      id: 4,
      title: "Saúde Mental",
      description: "Programa de apoio psicológico para jovens",
      category: "Saúde",
      amount: 3200.00,
      goal: 8000.00,
      donors: 67,
      status: "Ativa",
      location: "São Paulo",
      endDate: "2025-10-20",
      image: "🧠"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-green-500";
      case "Pausada":
        return "bg-yellow-500";
      case "Concluída":
        return "bg-blue-500";
      case "Cancelada":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressPercentage = (amount: number, goal: number) => {
    return Math.min((amount / goal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-8">
      {/* Header */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{t('donations.title')}</h1>
                <p className="text-muted-foreground">{t('donations.subtitle')}</p>
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
                Nova Campanha
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
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Campanhas Ativas</span>
                    </div>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Total Arrecadado</span>
                    </div>
                    <span className="font-bold">$45,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Doadores</span>
                    </div>
                    <span className="font-bold">321</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Meta Atingida</span>
                    </div>
                    <span className="font-bold">68%</span>
                  </div>
                </div>
              </MagicCard>

              {/* Quick Actions */}
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Ações</h2>

                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Campanha
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Relatórios
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Doadores
                  </Button>
                </div>
              </MagicCard>
            </div>

            {/* Donations List */}
            <div className="lg:col-span-3">
              <MagicCard className="p-6">
                <h2 className="text-2xl font-bold mb-6">Campanhas de Doação</h2>

                <div className="space-y-6">
                  {donations.map((donation) => {
                    const progress = getProgressPercentage(donation.amount, donation.goal);
                    return (
                      <div
                        key={donation.id}
                        className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                            {donation.image}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold">{donation.title}</h3>
                                <p className="text-muted-foreground mt-1">{donation.description}</p>
                              </div>
                              <Badge
                                className={`text-white ${getStatusColor(donation.status)}`}
                              >
                                {donation.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                              <Badge variant="outline" className="text-xs">
                                {donation.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {donation.location}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                Até {new Date(donation.endDate).toLocaleDateString('pt-BR')}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  ${donation.amount.toLocaleString()} / ${donation.goal.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {progress.toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Users className="w-4 h-4" />
                                  {donation.donors} doadores
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More */}
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Carregar Mais Campanhas
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
