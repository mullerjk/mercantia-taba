"use client";

import { useState } from "react";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  PiggyBank,
  BarChart3,
  Calendar,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function FinancesPage() {
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

  const transactions = [
    {
      id: 1,
      description: "Venda - Schema.org Toolkit Pro",
      amount: 299.99,
      type: "income",
      date: "Hoje",
      category: "Vendas"
    },
    {
      id: 2,
      description: "Assinatura Premium",
      amount: -49.99,
      type: "expense",
      date: "Ontem",
      category: "Assinaturas"
    },
    {
      id: 3,
      description: "Venda - API Integration Suite",
      amount: 149.99,
      type: "income",
      date: "2 dias atrás",
      category: "Vendas"
    },
    {
      id: 4,
      description: "Marketing Digital",
      amount: -299.99,
      type: "expense",
      date: "3 dias atrás",
      category: "Marketing"
    },
    {
      id: 5,
      description: "Hospedagem Cloud",
      amount: -89.99,
      type: "expense",
      date: "5 dias atrás",
      category: "Infraestrutura"
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
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Minhas Finanças</h1>
                <p className="text-muted-foreground">Acompanhe suas receitas, despesas e relatórios financeiros</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Período
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Financial Overview */}
            <div className="lg:col-span-1 space-y-6">
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Resumo Financeiro</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Receitas</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">$12,450</span>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium">Despesas</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">$3,240</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PiggyBank className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Lucro</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">$9,210</span>
                    </div>
                  </div>
                </div>
              </MagicCard>

              {/* Quick Actions */}
              <MagicCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Ações</h2>

                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Receipt className="w-4 h-4 mr-2" />
                    Ver Faturas
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gerenciar Cartões
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Relatórios Detalhados
                  </Button>
                </div>
              </MagicCard>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-3">
              <MagicCard className="p-6">
                <h2 className="text-2xl font-bold mb-6">Transações Recentes</h2>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income'
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{transaction.description}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {transaction.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Ver Todas as Transações
                  </Button>
                </div>
              </MagicCard>

              {/* Monthly Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <MagicCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Este Mês</h3>
                      <p className="text-sm text-muted-foreground">Receitas</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">$8,450</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% vs mês passado
                  </p>
                </MagicCard>

                <MagicCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Este Mês</h3>
                      <p className="text-sm text-muted-foreground">Despesas</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-red-600">$2,890</p>
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8% vs mês passado
                  </p>
                </MagicCard>

                <MagicCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <PiggyBank className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Este Mês</h3>
                      <p className="text-sm text-muted-foreground">Saldo</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">$5,560</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15% vs mês passado
                  </p>
                </MagicCard>
              </div>
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
