'use client'

import Link from 'next/link'
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  Star,
  ArrowRight,
  Zap,
  CheckCircle,
  Globe,
  Shield,
  Sparkles
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground">Mercantia</h1>
              <p className="text-muted-foreground">Super Admin Dashboard</p>
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Marketplace Inteligente com
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> IA Avançada</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experimente o futuro do e-commerce com dados estruturados Schema.org, 
            gestão inteligente de produtos e pagamentos PIX integrados.
          </p>

          {/* Status Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="secondary" className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Sistema Operacional
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Segurança Avançada
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              IA Integrada
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="px-8">
              <Link href="/marketplace">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorar Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/(dashboard)">
                  <Users className="w-5 h-5 mr-2" />
                  Meus Painéis
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/auth/login">
                  Fazer Login
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Marketplace Inteligente</CardTitle>
              <CardDescription>
                Descoberta de produtos baseada em dados estruturados e IA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Gestão de Produtos</CardTitle>
              <CardDescription>
                Organização e categorização automática com Schema.org
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Rede de Relacionamentos</CardTitle>
              <CardDescription>
                Conecte-se com vendedores, compradores e parceiros
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Analytics Avançados</CardTitle>
              <CardDescription>
                Insights detalhados sobre vendas, produtos e performance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Acesso Rápido ao Marketplace</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link href="/marketplace/organizations">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Organizações</div>
                  <div className="text-sm text-muted-foreground">Ver vendedores e marcas</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link href="/marketplace/products">
                <Package className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Produtos</div>
                  <div className="text-sm text-muted-foreground">Explorar catálogo completo</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link href="/marketplace/departments">
                <Globe className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Departamentos</div>
                  <div className="text-sm text-muted-foreground">Navegar por categorias</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold">Mercantia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Plataforma desenvolvida com tecnologias de ponta para o futuro do e-commerce
          </p>
        </div>
      </footer>
    </div>
  )
}
