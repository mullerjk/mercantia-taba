"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Home,
  Settings,
  User,
  BarChart3,
  ShoppingBag,
  ShoppingCart,
  Package,
  Users,
  Download,
  Plus,
  ChevronDown,
  Loader2,
  Bell,
  Search,
  Menu,
  X,
  CreditCard,
  Building,
  Heart,
  TrendingUp,
  DollarSign,
  Wallet,
  PiggyBank,
  Receipt,
  Target,
  Activity,
  Globe,
  Briefcase,
  Gift,
  Zap,
  ChevronRight,
  PanelLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { SchemaExplorerTree } from "@/components/schema-explorer-tree";

// Enhanced Schema Tree Component with better UX
function EnhancedSchemaTree({ onEntitySelect }: { onEntitySelect?: (entityName: string) => void }) {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch('/api/schema-hierarchy');
        if (response.ok) {
          const data = await response.json();
          setEntities(data);
        }
      } catch (error) {
        console.error('Failed to load schema entities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const toggleExpansion = (entityId: string) => {
    const updateEntityExpansion = (entities: any[]): any[] => {
      return entities.map(entity => {
        if (entity.id === entityId) {
          return { ...entity, isExpanded: !entity.isExpanded };
        }
        if (entity.children && entity.children.length > 0) {
          return { ...entity, children: updateEntityExpansion(entity.children) };
        }
        return entity;
      });
    };

    setEntities(updateEntityExpansion(entities));
  };

  const handleEntitySelect = (entityId: string) => {
    if (onEntitySelect) {
      onEntitySelect(entityId);
    }
  };

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderEntity = (entity: any, level = 0) => {
    const hasChildren = entity.children && entity.children.length > 0;

    return (
      <div key={entity.id}>
        <SidebarMenuItem>
          <div
            className={`flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md transition-colors w-full ${
              level > 0 ? 'ml-4' : ''
            }`}
            onClick={() => handleEntitySelect(entity.id)}
          >
            <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="truncate font-medium flex-1">{entity.name}</span>
            {hasChildren && (
              <button
                className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpansion(entity.id);
                }}
              >
                <ChevronRight className={`w-3 h-3 transition-transform ${entity.isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>
        </SidebarMenuItem>

        {hasChildren && entity.isExpanded && (
          <div className="ml-2">
            {entity.children.map((child: any) => renderEntity(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar entidades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>
      <div className="space-y-1 list-none">
        {filteredEntities.map((entity) => renderEntity(entity))}
      </div>
    </div>
  );
}

// Dynamic imports for pages - loaded on demand with better error boundaries
const DashboardHome = dynamic(() => import('./dashboard-home'), {
  loading: () => <PageLoader />,
  ssr: false
});

const MarketplacePage = dynamic(() => import('../components/pages/marketplace'), {
  loading: () => <PageLoader />,
  ssr: false
});

const AccountPage = dynamic(() => import('../components/pages/account'), {
  loading: () => <PageLoader />,
  ssr: false
});

const RelationshipsPage = dynamic(() => import('../components/pages/relationships'), {
  loading: () => <PageLoader />,
  ssr: false
});

const InventoryPage = dynamic(() => import('../components/pages/inventory'), {
  loading: () => <PageLoader />,
  ssr: false
});

const FinancesPage = dynamic(() => import('../components/pages/finances'), {
  loading: () => <PageLoader />,
  ssr: false
});

const CheckoutPage = dynamic(() => import('../components/pages/checkout'), {
  loading: () => <PageLoader />,
  ssr: false
});

// Enhanced loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-primary/20"></div>
        </div>
        <p className="text-sm text-muted-foreground">Carregando Mercantia...</p>
      </div>
    </div>
  );
}

// Enhanced page content renderer with better routing and auth protection
function PageContent({ currentPage }: { currentPage: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Pages that require authentication
  const protectedPages = ['dashboard', 'account', 'relationships', 'inventory', 'finances', 'checkout'];

  // If trying to access protected page without authentication
  if (protectedPages.includes(currentPage) && !loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold">Acesso Restrito</h2>
          <p className="text-muted-foreground max-w-md">
            Você precisa estar logado para acessar esta página. Faça login para continuar.
          </p>
          <Button onClick={() => router.push('/auth/login')}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  switch (currentPage) {
    case 'dashboard':
      return <DashboardHome />;
    case 'marketplace':
      return <MarketplacePage />;
    case 'account':
      return <AccountPage />;
    case 'relationships':
      return <RelationshipsPage />;
    case 'inventory':
      return <InventoryPage />;
    case 'finances':
      return <FinancesPage />;
    case 'checkout':
      return <CheckoutPage />;
    default:
      return <DashboardHome />;
  }
}

import { DockNavigation } from "@/components/dock-navigation";

interface ChangelogItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  timestamp: string;
  version?: string;
  schemaType?: string;
}

export function DashboardClient({ initialPage }: { initialPage?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut, user, loading } = useAuth();
  const [notifications] = useState(3); // Mock notifications count
  const [currentPage, setCurrentPage] = useState(initialPage || 'dashboard');

  // Sidebar compact mode with persistence
  const [sidebarCompact, setSidebarCompact] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCompact');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Persist sidebar state
  const toggleSidebarCompact = () => {
    const newState = !sidebarCompact;
    setSidebarCompact(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCompact', JSON.stringify(newState));
    }
  };

  // Update current page based on pathname and query params
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(pageParam);
    } else if (pathname === '/' || pathname === '') {
      setCurrentPage('dashboard');
    } else {
      const segments = pathname.split('/').filter(Boolean);
      const route = segments[0] || 'dashboard';
      setCurrentPage(route);
    }
  }, [pathname, searchParams]);

  // Redirect to marketplace if user is not logged in and trying to access dashboard
  useEffect(() => {
    if (!loading && !user && currentPage === 'dashboard') {
      router.push('/marketplace');
    }
  }, [user, loading, currentPage, router]);

  const getPageTitle = (page: string) => {
    const titles = {
      dashboard: 'Dashboard',
      marketplace: 'Marketplace',
      account: 'Minha Conta',
      relationships: 'Relacionamentos',
      inventory: 'Inventário',
      finances: 'Finanças',
      checkout: 'Finalizar Compra'
    };
    return titles[page as keyof typeof titles] || 'Dashboard';
  };

  const getPageDescription = (page: string) => {
    const descriptions = {
      dashboard: 'Visão geral do seu negócio e atividades',
      marketplace: 'Explore produtos e serviços disponíveis',
      account: 'Gerencie suas informações pessoais',
      relationships: 'Gerencie conexões e rede de contatos',
      inventory: 'Controle de produtos e estoque',
      finances: 'Gestão financeira completa',
      checkout: 'Finalize suas compras'
    };
    return descriptions[page as keyof typeof descriptions] || 'Visão geral do seu negócio e atividades';
  };

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    // Update URL without causing a page reload
    window.history.replaceState(null, '', page === 'dashboard' ? '/' : `/${page}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Enhanced Sidebar - Fixed position */}
        <Sidebar className={`hidden md:flex border-r bg-card transition-all duration-300 flex-col fixed left-0 top-0 h-screen z-10 ${
          sidebarCompact ? 'w-16' : 'w-64'
        }`}>
          <SidebarHeader className="border-b flex-shrink-0">
            <div className={`flex items-center py-4 ${
              sidebarCompact ? 'px-2 justify-center' : 'px-4'
            }`}>
              <div className={`${
                sidebarCompact ? 'w-8 h-8' : 'w-8 h-8'
              } bg-primary rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              {!sidebarCompact && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-bold text-lg">Mercantia</span>
                  <span className="truncate text-xs text-muted-foreground">Super Admin</span>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 flex-1 overflow-y-auto">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Show Dashboard only for authenticated users */}
                  {user && (
                    <SidebarMenuItem>
                      <button
                        onClick={() => navigateToPage('dashboard')}
                        className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors w-full text-left ${
                          currentPage === 'dashboard'
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Home className="w-5 h-5" />
                        {!sidebarCompact && <span className="font-medium">Dashboard</span>}
                      </button>
                    </SidebarMenuItem>
                  )}

                  <SidebarMenuItem>
                    <button
                      onClick={() => navigateToPage('marketplace')}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors w-full text-left ${
                        currentPage === 'marketplace'
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {!sidebarCompact && <span className="font-medium">Marketplace</span>}
                    </button>
                  </SidebarMenuItem>

                  {/* Show other menu items only for authenticated users */}
                  {user && (
                    <>
                      <SidebarMenuItem>
                        <button
                          onClick={() => navigateToPage('inventory')}
                          className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors w-full text-left ${
                            currentPage === 'inventory'
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <Package className="w-5 h-5" />
                          {!sidebarCompact && <span className="font-medium">Inventário</span>}
                        </button>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <button
                          onClick={() => navigateToPage('finances')}
                          className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors w-full text-left ${
                            currentPage === 'finances'
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <BarChart3 className="w-5 h-5" />
                          {!sidebarCompact && <span className="font-medium">Finanças</span>}
                        </button>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Business Management - Only for authenticated users */}
            {user && (
              <>
                {/* Separator */}
                {!sidebarCompact && <div className="mx-2 my-4 h-px bg-border" />}

                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <button
                          onClick={() => navigateToPage('relationships')}
                          className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors w-full text-left ${
                            currentPage === 'relationships'
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <Users className="w-5 h-5" />
                          {!sidebarCompact && <span className="font-medium">Relacionamentos</span>}
                        </button>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <button
                          onClick={() => navigateToPage('account')}
                          className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-colors w-full text-left ${
                            currentPage === 'account'
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <User className="w-5 h-5" />
                          {!sidebarCompact && <span className="font-medium">Minha Conta</span>}
                        </button>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Separator */}
                {!sidebarCompact && <div className="mx-2 my-4 h-px bg-border" />}

                {/* Schema Explorer - Hidden when compact */}
                {!sidebarCompact && (
                  <>
                    {/* Separator */}
                    <div className="mx-2 my-4 h-px bg-border" />

                    {/* Schema Explorer */}
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <div className="px-1">
                          <EnhancedSchemaTree
                            onEntitySelect={(entityName) => {
                              console.log("Entity selected in Mercantia:", entityName);
                            }}
                          />
                        </div>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </>
                )}
              </>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t flex-shrink-0 bg-card">
            <SidebarMenu>
              <SidebarMenuItem>
                {user ? (
                  // User is logged in - show user menu
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors ${
                        sidebarCompact ? 'justify-center px-1' : 'gap-3 px-3'
                      }`}>
                        <Avatar className={`${sidebarCompact ? 'h-6 w-6' : 'h-8 w-8'}`}>
                          <AvatarImage src={user.avatarUrl || "/avatars/01.png"} alt="User" />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                            {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {!sidebarCompact && (
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.fullName || 'User'}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        )}
                        {!sidebarCompact && <ChevronDown className="ml-auto w-4 h-4 text-muted-foreground" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="top"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl || "/avatars/01.png"} alt="User" />
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.fullName || 'User'}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Assinatura
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => signOut()}
                      >
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // User is not logged in - show login button
                  <button
                    onClick={() => router.push('/auth/login')}
                    className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors ${
                      sidebarCompact ? 'justify-center px-1' : 'gap-3 px-3'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    {!sidebarCompact && <span className="font-medium">Fazer Login</span>}
                  </button>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarCompact ? 'md:ml-16' : 'md:ml-64'
        }`}>
          {/* Enhanced Header */}
          <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-6">
            {/* Sidebar Toggle Button - Hidden on mobile, visible on tablet/desktop */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebarCompact}
              className="hidden md:flex"
              title={sidebarCompact ? "Expandir sidebar" : "Compactar sidebar"}
            >
              <PanelLeft className="w-4 h-4" />
            </Button>

            {/* Separator - Hidden on mobile, visible on tablet/desktop */}
            <div className="hidden md:block w-px h-8 bg-border"></div>

            {/* Page Title & Description */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">{getPageTitle(currentPage)}</h1>
              <p className="text-sm text-muted-foreground">{getPageDescription(currentPage)}</p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="w-64 pl-9 h-9 bg-background"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo
                </Button>
              </div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 overflow-auto bg-muted/20">
            <Suspense fallback={<PageLoader />}>
              <PageContent currentPage={currentPage} />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Enhanced Dock Navigation - Hidden on desktop, visible on tablet/mobile */}
      <div className="md:hidden">
        <DockNavigation
          showSidebar={false}
          onToggleSidebar={() => {}}
          onNavigate={navigateToPage}
        />
      </div>
    </SidebarProvider>
  );
}
