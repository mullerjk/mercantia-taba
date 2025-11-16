"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  ArrowLeft,
  Plus,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  productCount?: number;
  createdAt: string;
}

type TabType = "overview" | "products" | "orders" | "reports" | "history" | "settings";

export default function BusinessDashboard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const storeId = params.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab');
    return (tab as TabType) || "overview";
  });

  useEffect(() => {
    if (!user) return;
    fetchStore();
  }, [user]);

  // Update tab when query parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  const fetchStore = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/stores/${storeId}`, {
        headers: {
          "x-user-id": user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStore(data);
      } else {
        router.push("/business");
      }
    } catch (error) {
      console.error("Error fetching store:", error);
      router.push("/business");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Por favor, faca login.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Negocio nao encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="px-6 pt-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/business">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                {store.isVerified && (
                  <Badge className="bg-green-600">Verificado</Badge>
                )}
                {store.isActive && (
                  <Badge className="bg-blue-600">Ativo</Badge>
                )}
              </div>
              <p className="text-muted-foreground">Gerenciar seu negocio</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {store.productCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">Produtos</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {store.rating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {store.reviewCount}
              </div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Pedidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 border-b border-border flex gap-1 overflow-x-auto">
        <button
          onClick={() => router.push(`/business/${storeId}?tab=overview`)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Visao Geral
        </button>
        <button
          onClick={() => router.push(`/business/${storeId}?tab=products`)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "products"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Produtos
        </button>
        <button
          onClick={() => router.push(`/business/${storeId}?tab=orders`)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "orders"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline mr-2" />
          Pedidos
        </button>
        <button
          onClick={() => router.push(`/business/${storeId}?tab=reports`)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "reports"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Relatorios
        </button>
        <button
          onClick={() => router.push(`/business/${storeId}?tab=history`)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Historico
        </button>
        <button
          onClick={() => router.push(`/business/${storeId}?tab=settings`)}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Configuracoes
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-8">
        {activeTab === "overview" && (
          <OverviewSection store={store} />
        )}
        {activeTab === "products" && (
          <ProductsSection storeId={storeId} storeName={store.name} />
        )}
        {activeTab === "orders" && (
          <OrdersSection storeId={storeId} />
        )}
        {activeTab === "reports" && (
          <ReportsSection storeId={storeId} />
        )}
        {activeTab === "history" && (
          <HistoricalDataSection storeId={storeId} store={store} />
        )}
        {activeTab === "settings" && (
          <SettingsSection store={store} onUpdate={setStore} />
        )}
      </div>
    </div>
  );
}

// Overview Section
function OverviewSection({ store }: { store: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visao Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Produtos</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">{store.productCount || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Ativos</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Pedidos</span>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">0</div>
          <p className="text-xs text-muted-foreground mt-1">Este mes</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Avaliacao</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">{store.rating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {store.reviewCount} reviews
          </p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Receita</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">R$ 0</div>
          <p className="text-xs text-muted-foreground mt-1">Este mes</p>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Acoes Rapidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href={`/organization/${store.id}`}>
            <Button variant="outline" className="w-full">
              Visualizar Loja
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            Adicionar Produto
          </Button>
          <Button variant="outline" className="w-full">
            Ver Pedidos
          </Button>
          <Button variant="outline" className="w-full">
            Gerar Relatorio
          </Button>
        </div>
      </div>
    </div>
  );
}

// Products Section
function ProductsSection({ storeId, storeName }: { storeId: string; storeName: string }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    cost: "",
    currency: "BRL",
    sku: "",
    inventory: "",
    category: "",
    imageUrl: "",
    imageAlt: "",
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/stores/${storeId}/products?limit=100`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validation
    if (!formData.name || !formData.slug || !formData.price || !formData.inventory) {
      setMessage({ type: "error", text: "Por favor, preencha todos os campos obrigatorios" });
      return;
    }

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    const costInCents = formData.cost ? Math.round(parseFloat(formData.cost) * 100) : undefined;

    const images = formData.imageUrl
      ? [{ url: formData.imageUrl, alt: formData.imageAlt || formData.name }]
      : [];

    try {
      setCreating(true);
      setMessage(null);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          storeId,
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          price: priceInCents,
          cost: costInCents,
          currency: formData.currency,
          sku: formData.sku || null,
          images,
          inventory: parseInt(formData.inventory),
          category: formData.category || null,
          tags: [],
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Produto criado com sucesso!" });
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: "",
          cost: "",
          currency: "BRL",
          sku: "",
          inventory: "",
          category: "",
          imageUrl: "",
          imageAlt: "",
        });
        setShowForm(false);
        setTimeout(() => fetchProducts(), 500);
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: `Erro: ${error.error}` });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage({ type: "error", text: "Erro ao criar produto" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-6">Adicionar Novo Produto</h3>
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fone de Ouvido Wireless"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Amigavel (slug) *
                </label>
                <input
                  type="text"
                  placeholder="fone-de-ouvido-wireless"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preco (R$) *
                </label>
                <input
                  type="number"
                  placeholder="99.90"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Custo (R$) (opcional)
                </label>
                <input
                  type="number"
                  placeholder="49.90"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Inventory */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantidade em Estoque *
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.inventory}
                  onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  SKU (opcional)
                </label>
                <input
                  type="text"
                  placeholder="SKU123456"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoria (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Eletronicos"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium mb-2">Moeda</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="BRL">BRL (Real)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descricao (opcional)
              </label>
              <textarea
                placeholder="Descreva o seu produto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL da Imagem (opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Texto Alternativo da Imagem
                </label>
                <input
                  type="text"
                  placeholder="Descricao da imagem"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={creating}>
                {creating ? "Criando..." : "Criar Produto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setMessage(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-background border border-border rounded-lg">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum produto</h3>
          <p className="text-muted-foreground mb-4">
            Comece adicionando seu primeiro produto
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-background border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {product.images?.[0]?.url && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="font-semibold truncate">{product.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">
                  R$ {(product.price / 100).toFixed(2)}
                </span>
                <Badge variant="secondary">{product.inventory} em estoque</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Orders Section
function OrdersSection({ storeId }: { storeId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const response = await fetch(`/api/stores/${storeId}/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      confirmed: "Confirmado",
      processing: "Processando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os Pedidos</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="processing">Processando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-background border border-border rounded-lg">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground">
            Quando clientes fizerem pedidos, eles aparecao aqui
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-background border border-border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Data</th>
                <th className="px-6 py-4 text-left font-semibold">Itens</th>
                <th className="px-6 py-4 text-left font-semibold">Total</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.items?.length || 0} item(s)
                  </td>
                  <td className="px-6 py-4 font-bold">
                    R$ {((order.total || 0) / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Reports Section
function ReportsSection({ storeId }: { storeId: string }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [] as any[],
    monthlySales: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [storeId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stores/${storeId}/orders?limit=1000`);
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];

        // Calculate statistics
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate monthly sales
        const monthlyMap: Record<string, number> = {};
        orders.forEach((order: any) => {
          const date = new Date(order.createdAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + (order.total || 0);
        });

        const monthlySales = Object.entries(monthlyMap)
          .map(([month, revenue]) => ({
            month,
            revenue,
            label: new Date(`${month}-01`).toLocaleDateString("pt-BR", {
              month: "short",
              year: "numeric",
            }),
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        // Calculate top products
        const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            if (!productMap[item.productId]) {
              productMap[item.productId] = {
                name: item.productName || "Produto desconhecido",
                quantity: 0,
                revenue: 0,
              };
            }
            productMap[item.productId].quantity += item.quantity || 0;
            productMap[item.productId].revenue += item.total || 0;
          });
        });

        const topProducts = Object.values(productMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setStats({
          totalRevenue,
          totalOrders,
          averageOrderValue,
          topProducts,
          monthlySales,
        });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Relatorios e Analises</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatorios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatorios e Analises</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Receita Total</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">
            R$ {(stats.totalRevenue / 100).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Todos os tempos</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Numero de Pedidos</span>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">Todos os tempos</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Ticket Medio</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">
            R$ {(stats.averageOrderValue / 100).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Por pedido</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Periodo</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">
            {stats.monthlySales.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Meses ativos</p>
        </div>
      </div>

      {/* Monthly Sales */}
      {stats.monthlySales.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Vendas por Mes</h3>
          <div className="space-y-3">
            {stats.monthlySales.map((sale) => (
              <div key={sale.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{sale.label}</span>
                  <span className="text-sm font-bold">R$ {(sale.revenue / 100).toFixed(2)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.min(
                        (sale.revenue / Math.max(...stats.monthlySales.map((s) => s.revenue))) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {stats.topProducts.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.quantity} unidades vendidas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {(product.revenue / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalOrders === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
          <p className="text-sm">
            Relatorios detalhados estarao disponiveis quando voce tiver
            vendas em seu negocio.
          </p>
        </div>
      )}
    </div>
  );
}

// Historical Data Section
function HistoricalDataSection({ storeId, store }: { storeId: string; store: any }) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, [storeId]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      // Fetch products and orders to build a timeline
      const ordersResponse = await fetch(`/api/stores/${storeId}/orders?limit=1000`);
      const orders = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };

      const productsResponse = await fetch(`/api/stores/${storeId}/products?limit=1000`);
      const products = productsResponse.ok ? await productsResponse.json() : { products: [] };

      // Build timeline events
      const events: any[] = [];

      // Add store creation event
      if (store?.createdAt) {
        events.push({
          type: "store_created",
          date: new Date(store.createdAt),
          title: "Negocio Criado",
          description: `Negocio "${store.name}" foi criado`,
        });
      }

      // Add product creation events
      (products.products || []).forEach((product: any) => {
        if (product.createdAt) {
          events.push({
            type: "product_created",
            date: new Date(product.createdAt),
            title: "Produto Adicionado",
            description: `Produto "${product.name}" foi adicionado`,
          });
        }
      });

      // Add order events
      (orders.orders || []).forEach((order: any) => {
        if (order.createdAt) {
          events.push({
            type: "order_placed",
            date: new Date(order.createdAt),
            title: `Pedido ${order.status === "delivered" ? "Entregue" : "Recebido"}`,
            description: `Pedido de R$ ${(order.total / 100).toFixed(2)} - ${order.items?.length || 0} item(s)`,
          });
        }
      });

      // Sort by date descending
      events.sort((a, b) => b.date.getTime() - a.date.getTime());

      setTimeline(events);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "store_created":
        return <Building2 className="w-4 h-4" />;
      case "product_created":
        return <Package className="w-4 h-4" />;
      case "order_placed":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "store_created":
        return "bg-blue-100 text-blue-700";
      case "product_created":
        return "bg-green-100 text-green-700";
      case "order_placed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Historico</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando historico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historico</h2>

      {timeline.length === 0 ? (
        <div className="text-center py-12 bg-background border border-border rounded-lg">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum evento</h3>
          <p className="text-muted-foreground">Seu historico aparecera aqui</p>
        </div>
      ) : (
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-1 h-12 bg-border my-2"></div>
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {event.date.toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Section
function SettingsSection({ store, onUpdate }: { store: any; onUpdate: (store: any) => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description || "",
    email: store.email || "",
    phone: store.phone || "",
    website: store.website || "",
    isActive: store.isActive,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/stores/${store.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
        alert("Configuracoes salvas com sucesso!");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Erro ao salvar configuracoes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configuracoes do Negocio</h2>

      <div className="bg-background border border-border rounded-lg p-6 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nome</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descricao</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telefone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="active"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label htmlFor="active" className="text-sm font-medium">
            Negocio Ativo
          </label>
        </div>

        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Salvando..." : "Salvar Configuracoes"}
        </Button>
      </div>
    </div>
  );
}