"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, MessageCircle, Building } from "lucide-react";

export default function RelationshipsPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>

          <p className="text-muted-foreground">
            Gerencie suas conexões e rede de contatos na Mercantia
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Contato
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12 este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Parceiros ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pessoas</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">Contatos pessoais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Não lidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos Recentes</CardTitle>
          <CardDescription>
            Pessoas e empresas que você interagiu recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "João Silva", company: "Tech Solutions Ltda", type: "Empresa", avatar: "JS" },
              { name: "Maria Santos", company: "Designer Freelancer", type: "Pessoa", avatar: "MS" },
              { name: "Carlos Oliveira", company: "Marketing Pro", type: "Pessoa", avatar: "CO" },
              { name: "Ana Costa", company: "Consultoria XYZ", type: "Empresa", avatar: "AC" },
            ].map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{contact.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={contact.type === "Empresa" ? "secondary" : "outline"}>
                    {contact.type}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Conexão</CardTitle>
          <CardDescription>
            Pessoas e empresas que podem ser interessantes para sua rede
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Pedro Lima</h4>
                  <p className="text-sm text-muted-foreground">Desenvolvedor Full Stack</p>
                </div>
              </div>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Conectar
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>IA</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Inovação Ltda</h4>
                  <p className="text-sm text-muted-foreground">Empresa de Tecnologia</p>
                </div>
              </div>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Conectar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
