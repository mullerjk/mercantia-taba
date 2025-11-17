"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Tag, Building2, ShoppingCart, Star, Image as ImageIcon } from "lucide-react"
import Link from "next/link";
import { useCartAPI } from "@/hooks/useCartAPI";
import { useTranslation } from "@/contexts/TranslationContext";
import { JsonLd, createProductJsonLd } from "@/components/seo/json-ld";

interface StoreData {
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeDescription?: string;
  storeLogoUrl?: string;
  storeRating: number;
  storeReviewCount: number;
  storeEmail?: string;
  storePhone?: string;
  storeWebsite?: string;
  storeIsVerified: boolean;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  schema_type: string;
  type: string;
  image?: string;
  slug?: string;
  images?: Array<{ url: string; alt?: string }>;
  storeId?: string;
  storeName?: string;
  storeSlug?: string;
  storeLogoUrl?: string;
  storeRating?: number;
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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartAPI();

  const handleAddToCart = async () => {
    if (product && product.price) {
      await addItem(product.id, 1);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // Fetch product details - search by slug
        const productsResponse = await fetch(`/api/products?search=${encodeURIComponent(params.id as string)}&limit=100`);
        if (productsResponse.ok) {
          const result = await productsResponse.json();
          const allProducts = result.data || result;
          // Match by slug since params.id is the slug from the URL
          const foundProduct = allProducts.find((p: any) => p.slug === params.id || p.slug === decodeURIComponent(params.id as string));
          if (foundProduct) {
            setProduct({
              ...foundProduct,
              price: foundProduct.price ? foundProduct.price / 100 : undefined, // Convert cents to dollars
              image: foundProduct.images?.[0]?.url
            });
          }
        }

        // Fetch organization (for now, get the first one as related)
        const orgResponse = await fetch('/api/entities?type=schema:Organization');
        if (orgResponse.ok) {
          const orgs = await orgResponse.json();
          setOrganization(orgs[0] || null);
        }

      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

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

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold mb-2">{t('product.notFound')}</h1>
          <p className="text-muted-foreground mb-4">{t('product.notFoundDesc')}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('product.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  // Create JSON-LD structured data
  const productJsonLd = createProductJsonLd({
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    category: product.category,
    brand: organization?.name,
    sku: product.id
  });

  return (
    <>
      <JsonLd data={productJsonLd} />
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('product.backToMarketplace')}
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <Badge className="mt-2">{product.category}</Badge>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <h2 className="text-2xl font-bold">{t('product.productImage')}</h2>
              </div>

              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">{t('product.noImage')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{t('product.description')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Specs */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{t('product.specifications')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground">{t('product.category')}</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground">{t('product.type')}</span>
                  <Badge variant="outline">{product.schema_type}</Badge>
                </div>

                {product.price && (
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-sm text-muted-foreground">{t('product.price')}</span>
                    <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground">{t('product.id')}</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {product.id.slice(0, 8)}...
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Section */}
            {product.price && (
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button
                    size="lg"
                    className="w-full mb-4"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('product.addToCart')}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {t('product.freeShipping')}
                  </p>
                </div>
              </div>
            )}

            {/* Department */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-muted-foreground" />
                {t('product.department')}
              </h3>

              <Link href={`/department/${encodeURIComponent(product.category)}`}>
                <div className="p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Tag className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{product.category}</p>
                      <p className="text-sm text-muted-foreground">{t('product.productCategory')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('product.browseMore')}
                  </p>
                </div>
              </Link>
            </div>

            {/* Organization */}
            {product.storeName && (
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  Vendedor
                </h3>

                <Link href={`/organization/${product.storeId}`}>
                  <div className="p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      {product.storeLogoUrl ? (
                        <img
                          src={product.storeLogoUrl}
                          alt={product.storeName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.storeName}</p>
                        {product.storeRating && product.storeRating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{product.storeRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Clique para ver todos os produtos desta loja
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Product Rating */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{t('product.customerReviews')}</h3>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-2">4.0 {t('product.outOfStars')}</p>
                <p className="text-xs text-muted-foreground">{t('product.basedOnReviews')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
