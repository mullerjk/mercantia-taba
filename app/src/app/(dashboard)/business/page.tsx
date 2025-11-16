"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Settings, Package, Users, TrendingUp, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  email?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  productCount: number;
}

export default function BusinessPage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewStoreForm, setShowNewStoreForm] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreSlug, setNewStoreSlug] = useState("");
  const [newStoreDesc, setNewStoreDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [user]);

  const fetchStores = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch("/api/stores", {
        headers: {
          "x-user-id": user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newStoreName || !newStoreSlug) return;

    try {
      setCreating(true);
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          name: newStoreName,
          slug: newStoreSlug,
          description: newStoreDesc,
        }),
      });

      if (response.ok) {
        setNewStoreName("");
        setNewStoreSlug("");
        setNewStoreDesc("");
        setShowNewStoreForm(false);
        fetchStores();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating store:", error);
      alert("Erro ao criar negócio");
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Por favor, faça login para ver seus negócios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando negócios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Negócios</h1>
          <p className="text-muted-foreground">Gerencie suas lojas e produtos</p>
        </div>
        <Button onClick={() => setShowNewStoreForm(!showNewStoreForm)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Novo Negócio
        </Button>
      </div>

      {/* New Store Form */}
      {showNewStoreForm && (
        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Criar Novo Negócio</h2>
          <form onSubmit={handleCreateStore} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Negócio</label>
              <input
                type="text"
                placeholder="Ex: Minha Loja"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL)</label>
              <input
                type="text"
                placeholder="ex: minha-loja"
                value={newStoreSlug}
                onChange={(e) => setNewStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
              <textarea
                placeholder="Descreva seu negócio..."
                value={newStoreDesc}
                onChange={(e) => setNewStoreDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={creating}>
                {creating ? "Criando..." : "Criar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewStoreForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <div className="text-center py-16 bg-background border border-border rounded-lg">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum negócio cadastrado</h3>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro negócio para começar a vender
          </p>
          <Button onClick={() => setShowNewStoreForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Negócio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Store Logo/Banner */}
              {store.logoUrl ? (
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-primary" />
                </div>
              )}

              {/* Store Info */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold">{store.name}</h3>
                    {store.isVerified && <Badge className="bg-green-600">Verificado</Badge>}
                  </div>
                  {store.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {store.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{store.productCount}</div>
                    <div className="text-xs text-muted-foreground">Produtos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{store.rating.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{store.reviewCount}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      store.isActive ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {store.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Link href={`/business/${store.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-1" />
                      Gerenciar
                    </Button>
                  </Link>
                  <Link href={`/organization/${store.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
