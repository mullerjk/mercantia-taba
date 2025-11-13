"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Users } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>

          <p className="text-muted-foreground">
            Explore produtos e serviços disponíveis na rede Mercantia
          </p>
        </div>
        <Button>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Explorar Produtos
        </Button>
      </div>

      {/* Featured Products */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Produto Premium</CardTitle>
              <Badge variant="secondary">Premium</Badge>
            </div>
            <CardDescription>
              Descrição completa do produto premium com todas as funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">4.8 (120 avaliações)</span>
              </div>
              <span className="text-2xl font-bold">$299</span>
            </div>
            <Button className="w-full mt-4">Comprar Agora</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Serviço Profissional</CardTitle>
              <Badge variant="outline">Serviço</Badge>
            </div>
            <CardDescription>
              Serviço profissional com garantia e suporte técnico completo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">50+ clientes</span>
              </div>
              <span className="text-2xl font-bold">$150/h</span>
            </div>
            <Button variant="outline" className="w-full mt-4">Contratar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Produto Básico</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription>
              Produto básico com qualidade garantida e preço acessível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">4.5 (89 avaliações)</span>
              </div>
              <span className="text-2xl font-bold">$49</span>
            </div>
            <Button className="w-full mt-4">Adicionar ao Carrinho</Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>
            Explore diferentes categorias de produtos e serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">Produtos</h4>
                <p className="text-sm text-muted-foreground">Itens físicos e digitais</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">Serviços</h4>
                <p className="text-sm text-muted-foreground">Consultoria e suporte</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">Premium</h4>
                <p className="text-sm text-muted-foreground">Produtos exclusivos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <Badge className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">Ofertas</h4>
                <p className="text-sm text-muted-foreground">Descontos especiais</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
