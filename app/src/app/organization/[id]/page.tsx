"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { DockNavigation } from "@/components/dock-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { ArrowLeft, Building2, Package, Tag, MapPin, Globe, Mail, Phone, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/contexts/TranslationContext";

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
    contactPoint?: {
      email?: string;
      telephone?: string;
    };
    foundingDate?: string;
  };
  created_at: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  schema_type: string;
  type: string;
}

export default function OrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected:", entityName);
  };

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // Fetch organization details
        const orgResponse = await fetch(`/api/entities?type=schema:Organization`);
        if (orgResponse.ok) {
          const orgs = await orgResponse.json();
          const org = orgs.find((o: OrganizationData) => o.id === params.id);
          setOrganization(org || null);
        }

        // Fetch all products to find related ones
        const productsResponse = await fetch('/api/marketplace');
        if (productsResponse.ok) {
          const allProducts = await productsResponse.json();
          // For now, show all products as related (in a real app, we'd have relationships)
          setProducts(allProducts.filter((p: ProductData) => p.type === 'product'));

          // Extract unique departments
          const uniqueDepartments = [...new Set(allProducts
            .filter((p: ProductData) => p.type === 'product')
            .map((p: ProductData) => p.category)
          )] as string[];
          setDepartments(uniqueDepartments);
        }

      } catch (error) {
        console.error('Error fetching organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('organization.loading')}</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold mb-2">{t('organization.notFound')}</h1>
          <p className="text-muted-foreground mb-4">{t('organization.notFoundDesc')}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('organization.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  return (
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
            {t('organization.backToMarketplace')}
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{organization.name}</h1>
              <Badge className="mt-2">{organization.properties.orgType || 'Organization'}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Details */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-background border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{t('organization.about')}</h2>
                <p className="text-muted-foreground mb-6">
                  {organization.properties.description || organization.description || t('organization.noDescription')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organization.properties.url && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={organization.properties.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {t('organization.visitWebsite')}
                      </a>
                    </div>
                  )}

                  {organization.properties.foundingDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{t('organization.founded')} {organization.properties.foundingDate}</span>
                    </div>
                  )}

                  {organization.properties.contactPoint?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{organization.properties.contactPoint.email}</span>
                    </div>
                  )}

                  {organization.properties.contactPoint?.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{organization.properties.contactPoint.telephone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Departments */}
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  {t('organization.departments')} ({departments.length})
                </h3>

                {departments.length === 0 ? (
                  <p className="text-muted-foreground">{t('organization.noDepartments')}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {departments.map((department) => (
                      <Link key={department} href={`/department/${encodeURIComponent(department)}`}>
                        <div className="p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{department}</span>
                            <Badge variant="secondary">
                              {products.filter(p => p.category === department).length} {t('organization.products').toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Products */}
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  {t('organization.products')} ({products.length})
                </h3>

                {products.length === 0 ? (
                  <p className="text-muted-foreground">{t('organization.noProducts')}</p>
                ) : (
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`}>
                        <div className="p-3 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            {product.price && (
                              <span className="font-semibold text-lg ml-2">
                                ${product.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {products.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        {t('organization.moreProducts', `And ${products.length - 5} more products...`)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Address */}
              {organization.properties.address && (
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    {t('organization.location')}
                  </h3>
                  <p className="text-muted-foreground">
                    {organization.properties.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Sidebar Overlay */}
      <GlobalSidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
        onEntitySelect={handleEntitySelect}
      />

      {/* Dock Navigation */}
      <DockNavigation
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
