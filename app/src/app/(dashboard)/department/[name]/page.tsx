"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, Package, Building2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartAPI } from "@/hooks/useCartAPI";
import { useTranslation } from "@/contexts/TranslationContext";

interface ProductData {
  id: string;
  name: string;
  slug?: string;
  description: string;
  category: string;
  price?: number;
  schema_type: string;
  type: string;
  image?: string;
}

interface OrganizationData {
  id: string;
  name: string;
  description: string;
  schema_type: string;
  properties: {
    url?: string;
    address?: string;
    orgType?: string;
    description?: string;
  };
}

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartAPI();

  const departmentName = decodeURIComponent(params.name as string);

  const handleAddToCart = async (product: ProductData) => {
    if (product.price) {
      await addItem(product.id, 1);
    }
  };

  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (!departmentName) return;

      try {
        setLoading(true);

        // Fetch products in this department by category
        const productsResponse = await fetch(`/api/products?category=${encodeURIComponent(departmentName)}&limit=100`);
        if (productsResponse.ok) {
          const result = await productsResponse.json();
          const departmentProducts = (result.data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            category: p.category || departmentName,
            price: p.price ? p.price / 100 : undefined, // Convert cents to dollars
            schema_type: 'Product',
            type: 'product',
            image: p.images?.[0]?.url
          }));
          setProducts(departmentProducts);
        }

        // Fetch organization (for now, get the first one as related)
        const orgResponse = await fetch('/api/entities?type=schema:Organization');
        if (orgResponse.ok) {
          const orgs = await orgResponse.json();
          setOrganization(orgs[0] || null);
        }

      } catch (error) {
        console.error('Error fetching department data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [departmentName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('department.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('department.backToMarketplace')}
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Tag className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{departmentName}</h1>
            <Badge className="mt-2">{t('department.badge')}</Badge>
          </div>
        </div>
      </div>

      {/* Department Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('department.products')} ({products.length})</h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-background border border-border rounded-lg">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">{t('department.noProducts')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('department.noProductsDesc')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-full bg-background border border-border rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Category badge */}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Price */}
                      {product.price && (
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-lg">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Action button */}
                      <div className="flex justify-end">
                        {product.price ? (
                          <Button size="sm" onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            {t('department.addToCart')}
                          </Button>
                        ) : (
                          <Link href={`/product/${product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Button size="sm" variant="outline">
                              {t('department.viewDetails')}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          {organization && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                {t('department.organization')}
              </h3>

              <Link href={`/organization/${organization.id}`}>
                <div className="p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{organization.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {organization.properties.orgType || t('entity.organization')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {organization.properties.description || organization.description || t('organization.noDescription')}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Department Stats */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">{t('department.departmentStats')}</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('department.products')}</span>
                <Badge variant="secondary">{products.length}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('department.priceRange')}</span>
                <span className="text-sm font-medium">
                  {products.length > 0
                    ? `$${Math.min(...products.map(p => p.price || 0)).toFixed(2)} - $${Math.max(...products.map(p => p.price || 0)).toFixed(2)}`
                    : 'N/A'
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('department.totalValue')}</span>
                <span className="text-sm font-medium">
                  ${products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
