"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FileText
} from "lucide-react";

export default function AccountPage() {
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

  return (
    <div className="min-h-screen bg-background text-foreground pt-8">
      {/* Header */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Minha Conta</h1>
              <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <MagicCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Informações Pessoais</h2>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Antonio Müller</p>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">antonio@mercantia.app</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">+55 11 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">São Paulo, Brasil</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Membro desde 2020</span>
                    </div>
                  </div>
                </div>
              </MagicCard>

              {/* Account Statistics */}
              <MagicCard className="p-6">
                <h2 className="text-2xl font-bold mb-6">Estatísticas da Conta</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Produtos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">8</div>
                    <div className="text-sm text-muted-foreground">Organizações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Transações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.9</div>
                    <div className="text-sm text-muted-foreground">Avaliação</div>
                  </div>
                </div>
              </MagicCard>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações da Conta
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Segurança e Privacidade
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notificações
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Métodos de Pagamento
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Histórico de Atividades
                  </Button>
                </div>
              </MagicCard>

              {/* Account Status */}
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Status da Conta</h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verificação</span>
                    <Badge className="bg-green-500">Verificado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nível</span>
                    <Badge variant="secondary">Premium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-blue-500">Ativo</Badge>
                  </div>
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
