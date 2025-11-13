"use client";

import { useState, useEffect } from "react";
import { GlobalSidebar } from "@/components/global-sidebar";
import { DockNavigation } from "@/components/dock-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/ui/magic-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingCart, Star, MapPin, Building2, Package, Plus, Minus, Users, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/TranslationContext";
import Link from "next/link";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  type: 'product' | 'organization' | 'place';
  price?: number;
  rating?: number;
  location?: string;
  category: string;
  image?: string;
  schemaType: string;
}

export default function Marketplace() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { t } = useTranslation();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected in marketplace:", entityName);
    setSelectedCategory(entityName);
  };

  // Fetch marketplace items from Supabase
  useEffect(() => {
    const fetchMarketplaceItems = async () => {
      try {
        const response = await fetch('/api/marketplace')
        if (response.ok) {
          const items = await response.json()
          setMarketplaceItems(items)
        } else {
          console.error('Failed to fetch marketplace items')
          setMarketplaceItems([])
        }
      } catch (error) {
        console.error('Error fetching marketplace items:', error)
      }
    }

    fetchMarketplaceItems()
  }, [])

  // Separate items by type
  const organizations = marketplaceItems.filter(item => item.type === 'organization');
  const products = marketplaceItems.filter(item => item.type === 'product');

  // Get unique departments from products
  const departments = [...new Set(products.map(item => item.category))];

  // Filter items by search
  const filterItems = (items: MarketplaceItem[]) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const filteredOrganizations = filterItems(organizations);
  const filteredProducts = filterItems(products);

  const { state } = useCart();

  const MarketplaceCard = ({ item }: { item: MarketplaceItem }) => {
    const { addItem, updateQuantity } = useCart();

    const getIcon = () => {
      switch (item.type) {
        case 'product': return <Package className="w-5 h-5" />;
        case 'organization': return <Building2 className="w-5 h-5" />;
        case 'place': return <MapPin className="w-5 h-5" />;
        default: return <Package className="w-5 h-5" />;
      }
    };

    const handleAddToCart = () => {
      if (item.price) {
        addItem({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          schema_type: item.schemaType,
          category: item.category
        });
      }
    };

    const cartItem = state.items.find(cartItem => cartItem.id === item.id);

    return (
      <div className="bg-background border border-border rounded-lg w-full">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Top row with category and rating */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
              {item.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{item.rating}</span>
                </div>
              )}
            </div>

            {/* Middle row with price and location */}
            {(item.price || item.location) && (
              <div className="flex items-center gap-4">
                {item.price && (
                  <span className="font-semibold text-lg">
                    ${item.price}
                  </span>
                )}
                {item.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                )}
              </div>
            )}

            {/* Bottom row with action button */}
            <div className="flex justify-end">
              {item.price ? (
                cartItem ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium">{cartItem.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {t('cart.addToCart')}
                  </Button>
                )
              ) : (
                <Link href={`/organization/${item.id}`}>
                  <Button size="sm" variant="outline">
                    <Building2 className="w-4 h-4 mr-1" />
                    {t('action.viewDetails')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-8">


      {/* Search and Filters */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={t('marketplace.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="h-12 px-4"
              >
                Clear Filter: {selectedCategory.split(':')[1]}
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{marketplaceItems.length} {t('marketplace.totalItems')}</span>
            {searchQuery && (
              <span>{t('marketplace.searchFor')} "{searchQuery}"</span>
            )}
          </div>
        </div>
      </div>

      {/* Marketplace Tabs */}
      <div className="w-full px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="organizations" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="organizations" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {t('marketplace.organizations')} ({filteredOrganizations.length})
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {t('marketplace.departments')} ({departments.length})
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t('marketplace.products')} ({filteredProducts.length})
              </TabsTrigger>
            </TabsList>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold">{t('marketplace.organizationsTitle')}</h2>
                  <p className="text-muted-foreground">{t('marketplace.organizationsDesc')}</p>
                </div>
              </div>

              {filteredOrganizations.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold mb-2">{t('marketplace.noOrganizations')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('marketplace.noOrganizationsDesc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrganizations.map((item) => (
                    <MarketplaceCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Departments Tab */}
            <TabsContent value="departments" className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Tag className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold">{t('marketplace.departmentsTitle')}</h2>
                  <p className="text-muted-foreground">{t('marketplace.departmentsDesc')}</p>
                </div>
              </div>

              {departments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏷️</div>
                  <h3 className="text-xl font-semibold mb-2">{t('marketplace.noDepartments')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('marketplace.noDepartmentsDesc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {departments.map((department) => {
                    const departmentProducts = filteredProducts.filter(p => p.category === department);
                    return (
                      <Link key={department} href={`/department/${encodeURIComponent(department)}`}>
                        <div className="bg-background border border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted transition-colors hover:scale-105 transform duration-200">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-foreground">{department}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {departmentProducts.length} {departmentProducts.length !== 1 ? t('marketplace.products') : t('marketplace.product')}
                          </p>
                          <Badge variant="secondary">
                            {departmentProducts.length} {t('marketplace.items')}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Package className="w-8 h-8 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold">{t('marketplace.productsTitle')}</h2>
                  <p className="text-muted-foreground">{t('marketplace.productsDesc')}</p>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold mb-2">{t('marketplace.noProducts')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('marketplace.noProductsDesc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((item) => (
                    <MarketplaceCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Floating Cart Button */}
      {state.itemCount > 0 && (
        <div className="fixed bottom-24 right-6 z-40">
          <Link href="/checkout">
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-full px-6 py-3"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('marketplace.viewCart')} ({state.itemCount})
              <Badge variant="secondary" className="ml-2">
                ${state.total.toFixed(2)}
              </Badge>
            </Button>
          </Link>
        </div>
      )}

      {/* Global Sidebar Overlay - positioned above content but below dock */}
      <GlobalSidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
        onEntitySelect={handleEntitySelect}
      />

      {/* Dock Navigation - stays on top of everything */}
      <DockNavigation
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
