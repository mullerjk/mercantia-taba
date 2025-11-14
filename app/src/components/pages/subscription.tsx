"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Zap,
  MessageSquare,
  Database,
  Cloud,
  Bot,
  Phone,
  Mail,
  CheckCircle,
  Star,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Globe
} from "lucide-react";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const corporateFeatures = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Assistente AI Comercial",
      description: "IA avançada para análise de mercado, prospecção e estratégias de vendas"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Atendente de Chamadas AI",
      description: "Responda automaticamente ligações, agende reuniões e qualifique leads 24/7"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Disparo de Mensagens",
      description: "Campanhas automatizadas por WhatsApp, SMS e e-mail com IA personalizada"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Tratamento de Dados",
      description: "Processamento inteligente de dados empresariais com machine learning"
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Storage Cloud Ilimitado",
      description: "Armazenamento seguro na nuvem com backup automático e recuperação"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança Empresarial",
      description: "Criptografia de ponta a ponta, compliance e auditoria completa"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestão de Equipes",
      description: "Controle de acesso, permissões e colaboração em tempo real"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Avançado",
      description: "Dashboards executivos, relatórios automatizados e insights de negócio"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Integração Global",
      description: "APIs abertas, webhooks e integração com sistemas empresariais"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Performance Máxima",
      description: "Infraestrutura dedicada com SLA de 99.9% de disponibilidade"
    }
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Para pequenos negócios iniciando",
      features: [
        "Até 100 contatos",
        "5 campanhas/mês",
        "Suporte básico",
        "Relatórios simples"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: "R$ 297",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Até 1.000 contatos",
        "25 campanhas/mês",
        "Assistente AI básico",
        "Relatórios avançados",
        "Suporte prioritário"
      ],
      popular: false
    },
    {
      id: "corporate",
      name: "Corporate",
      price: "R$ 997",
      period: "/mês",
      description: "Para empresas estabelecidas",
      features: [
        "Contatos ilimitados",
        "Campanhas ilimitadas",
        "Assistente AI completo",
        "Atendente de chamadas AI",
        "Storage cloud ilimitado",
        "Suporte 24/7",
        "Consultoria dedicada"
      ],
      popular: true
    }
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold tracking-tight">Plano Corporativo</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Potencialize seu negócio com ferramentas de IA avançadas e infraestrutura empresarial.
          Feito para pessoas ativas no mundo dos negócios que buscam excelência e eficiência.
        </p>
        <Badge variant="secondary" className="text-sm">
          <Star className="h-4 w-4 mr-1" />
          Exclusivo para profissionais e empresas
        </Badge>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {corporateFeatures.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
            <div className="absolute top-4 right-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </Card>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Escolha seu Plano</h2>
          <p className="text-muted-foreground mt-2">
            Comece pequeno e escale conforme seu negócio cresce
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-primary shadow-lg scale-105'
                  : 'hover:shadow-md'
              } ${plan.popular ? 'border-primary' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Separator />

                <Button
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {selectedPlan === plan.id ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Selecionado
                    </>
                  ) : (
                    <>
                      Escolher Plano
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Pronto para revolucionar seu negócio?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Junte-se a centenas de empresas que já transformaram seus resultados com nossas soluções de IA.
              Comece seu teste gratuito hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Zap className="mr-2 h-5 w-5" />
                Começar Teste Gratuito
              </Button>
              <Button variant="outline" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Falar com Especialista
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Sem compromisso • Cancele a qualquer momento • Suporte 24/7
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Benefits */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Garantia de Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Oferecemos garantia de satisfação. Se você não ver resultados significativos
              nos primeiros 30 dias, devolvemos 100% do seu investimento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Suporte Especializado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cada cliente corporativo recebe um gerente de conta dedicado e acesso
              direto à nossa equipe de especialistas em IA e automação.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
