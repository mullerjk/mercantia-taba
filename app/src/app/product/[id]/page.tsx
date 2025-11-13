"use client";

import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { id: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    // Fetch product data for metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/marketplace`, {
      cache: 'force-cache' // Cache for build time
    });

    if (!response.ok) {
      return {
        title: 'Produto não encontrado | Mercantia',
        description: 'O produto que você está procurando não foi encontrado.'
      };
    }

    const products = await response.json();
    const product = products.find((p: any) => p.id === params.id);

    if (!product) {
      return {
        title: 'Produto não encontrado | Mercantia',
        description: 'O produto que você está procurando não foi encontrado.'
      };
    }

    const title = `${product.name} | Mercantia`;
    const description = product.description?.substring(0, 160) || `Compre ${product.name} no marketplace Mercantia com dados Schema.org verificados.`;

    return {
      title,
      description,
      keywords: [product.name, product.category, 'produto', 'mercado', 'schema.org', 'verificado'],
      openGraph: {
        title,
        description,
        url: `https://mercantia.app/product/${product.id}`,
        siteName: 'Mercantia',
        images: [
          {
            url: product.image || '/default-product.jpg',
            width: 1200,
            height: 630,
            alt: product.name,
          }
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [product.image || '/default-product.jpg'],
      },
    };
  } catch (error) {
    return {
      title: 'Produto | Mercantia',
      description: 'Explore produtos verificados no marketplace Mercantia.'
    };
  }
}

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DockNavigation } from "@/components/dock-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { ArrowLeft, Package, Tag, Building2, ShoppingCart, Star, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { JsonLd, createProductJsonLd } from "@/components/seo/json-ld";

interface ProductData {
  id: string;
  name: string;
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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected:", entityName);
  };

  const handleAddToCart = () => {
    if (product && product.price) {
      addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        schema_type: product.schema_type,
        category: product.category
      });
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // Fetch product details
        const productsResponse = await fetch('/api/marketplace');
        if (productsResponse.ok) {
          const allProducts = await productsResponse.json();
          const foundProduct = allProducts.find((p: ProductData) => p.id === params.id);
          setProduct(foundProduct || null);
        }

        // Fetch organization (for now, get the first one as related)
        const orgResponse = await fetch('/api/entities?type=schema:Organization');
        if (orgResponse.ok) {
          const orgs = await orgResponse.json();
          setOrganization(orgs[0] || null); // In a real app, this would be a relationship
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('product.loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
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
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="relative w-full p-8 pb-4">
          <div className="max-w-6xl mx-auto">
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
        </div>

      {/* Product Details */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
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
                      <span className="font-semibold text-lg">${product.price}</span>
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
                      ${product.price}
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
              {organization && (
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    {t('product.manufacturer')}
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
      </div>



        {/* Dock Navigation */}
        <DockNavigation
          showSidebar={showSidebar}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </>
  );
}
