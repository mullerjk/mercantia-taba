"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, PiggyBank } from "lucide-react";

export default function FinancesPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Controle financeiro completo da sua conta Mercantia
          </p>
        </div>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Ver Relatórios
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.5% este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,450.00</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,104.33</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poupança</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,241.34</div>
            <p className="text-xs text-muted-foreground">Meta: $10,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            Histórico das suas últimas movimentações financeiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "Receita", description: "Venda - Produto Premium", amount: "+$299.00", date: "Hoje", category: "Vendas" },
              { type: "Despesa", description: "Assinatura - Premium Plan", amount: "-$49.99", date: "Ontem", category: "Assinaturas" },
              { type: "Receita", description: "Comissão - Marketplace", amount: "+$125.50", date: "2 dias atrás", category: "Comissões" },
              { type: "Despesa", description: "Taxa de Transação", amount: "-$12.45", date: "3 dias atrás", category: "Taxas" },
              { type: "Receita", description: "Serviço - Consultoria", amount: "+$450.00", date: "5 dias atrás", category: "Serviços" },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === "Receita"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {transaction.type === "Receita" ? (
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{transaction.category}</Badge>
                  <span className={`font-bold ${
                    transaction.type === "Receita" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Metas Financeiras</CardTitle>
          <CardDescription>
            Acompanhe o progresso das suas metas de economia e investimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fundo de Emergência</span>
                <span>$5,241 / $10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '52.41%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">52% concluído - $4,759 restantes</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Investimento Anual</span>
                <span>$8,450 / $15,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '56.33%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">56% concluído - $6,550 restantes</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Viagem dos Sonhos</span>
                <span>$2,100 / $5,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">42% concluído - $2,900 restantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <CreditCard className="h-6 w-6" />
          Adicionar Receita
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Wallet className="h-6 w-6" />
          Registrar Despesa
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <PiggyBank className="h-6 w-6" />
          Transferir para Poupança
        </Button>
      </div>
    </div>
  );
}
