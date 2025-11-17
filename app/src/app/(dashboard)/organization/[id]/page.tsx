"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Mail, Phone, Globe, Package, Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartAPI } from "@/hooks/useCartAPI";
import { useTranslation } from "@/contexts/TranslationContext";

interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category?: string;
  images?: Array<{ url: string; alt?: string }>;
  rating: number;
  reviewCount: number;
  inventory: number;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export default function OrganizationPage() {
  const params = useParams();
  const { t } = useTranslation();
  const [store, setStore] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartAPI();

  const storeId = params.id as string;

  const handleAddToCart = async (product: StoreProduct) => {
    await addItem(product.id, 1);
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;

      try {
        setLoading(true);

        // Fetch store and its products
        const response = await fetch(`/api/stores/${storeId}/products?limit=100`);
        if (response.ok) {
          const data = await response.json();
          setStore(data.store);
          setProducts(data.products);
        }

      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('product.loading')}</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold mb-2">Organização não encontrada</h1>
          <p className="text-muted-foreground">A organização que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  const addressParts = store.address ? [
    store.address.street,
    store.address.city,
    store.address.state,
    store.address.zipCode,
  ].filter(Boolean) : [];

  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Banner */}
      {store.bannerUrl && (
        <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={store.bannerUrl}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Store Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo and Info */}
        <div className="md:col-span-2">
          <div className="flex items-start gap-6">
            {store.logoUrl && (
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!store.logoUrl && (
              <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-12 h-12 text-primary" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                {store.isVerified && (
                  <Badge className="bg-green-600">Verificado</Badge>
                )}
              </div>

              {store.description && (
                <p className="text-muted-foreground mb-4">{store.description}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                {store.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(store.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {store.rating.toFixed(1)} ({store.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-2">
          <div className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>

            {store.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${store.email}`} className="hover:text-primary">
                    {store.email}
                  </a>
                </div>
              </div>
            )}

            {store.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <a href={`tel:${store.phone}`} className="hover:text-primary">
                    {store.phone}
                  </a>
                </div>
              </div>
            )}

            {fullAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="hover:text-primary">{fullAddress}</p>
                </div>
              </div>
            )}

            {store.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary break-all"
                  >
                    {store.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="border-t pt-8">
        <div className="flex items-center gap-4 mb-6">
          <Package className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Produtos ({products.length})</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-background border border-border rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum produto disponível</h3>
            <p className="text-muted-foreground">
              Esta organização ainda não cadastrou produtos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <Link href={`/product/${product.slug}`}>
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {product.inventory > 0 ? (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Adicionar ao Carrinho
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      Fora de Estoque
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
