"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
  Bell,
  Search,
  CreditCard,
  Briefcase,
  Zap,
  ChevronRight,
  PanelLeft,
  Heart,
  Apple,
  Dumbbell,
  Pill,
  Activity,
  Microscope,
  Wallet,
  TrendingDown,
  TrendingUp,
  Target,
  ImageIcon,
  FileText,
  ShoppingCart as ShoppingCartIcon,
  UtensilsCrossed,
  Home as HomeIcon,
  Car,
  MessageCircle,
  Star,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { DockNavigation } from "@/components/dock-navigation";
import { BusinessDropdown } from "@/components/business-dropdown";
import { CartSyncManager } from "@/components/CartSyncManager";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user, loading } = useAuth();
  const { state: cartState } = useCart();
  const [notifications] = useState(3);
  const [apiCartCount, setApiCartCount] = useState(0);

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

  // Account section expanded state with persistence
  const [accountExpanded, setAccountExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accountExpanded');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  const toggleAccountExpanded = () => {
    const newState = !accountExpanded;
    setAccountExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accountExpanded', JSON.stringify(newState));
    }
  };

  // Business section expanded state with persistence
  const [businessExpanded, setBusinessExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('businessExpanded');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  const toggleBusinessExpanded = () => {
    const newState = !businessExpanded;
    setBusinessExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('businessExpanded', JSON.stringify(newState));
    }
  };

  // Marketplace section expanded state with persistence
  const [marketplaceExpanded, setMarketplaceExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('marketplaceExpanded');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  const toggleMarketplaceExpanded = () => {
    const newState = !marketplaceExpanded;
    setMarketplaceExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketplaceExpanded', JSON.stringify(newState));
    }
  };

  // Health section expanded state with persistence
  const [healthExpanded, setHealthExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthExpanded');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleHealthExpanded = () => {
    const newState = !healthExpanded;
    setHealthExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthExpanded', JSON.stringify(newState));
    }
  };

  // Finance section expanded state with persistence
  const [financeExpanded, setFinanceExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financeExpanded');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleFinanceExpanded = () => {
    const newState = !financeExpanded;
    setFinanceExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('financeExpanded', JSON.stringify(newState));
    }
  };

  // Inventory section expanded state with persistence
  const [inventoryExpanded, setInventoryExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inventoryExpanded');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleInventoryExpanded = () => {
    const newState = !inventoryExpanded;
    setInventoryExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventoryExpanded', JSON.stringify(newState));
    }
  };

  // Relationships section expanded state with persistence
  const [relationshipsExpanded, setRelationshipsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('relationshipsExpanded');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleRelationshipsExpanded = () => {
    const newState = !relationshipsExpanded;
    setRelationshipsExpanded(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('relationshipsExpanded', JSON.stringify(newState));
    }
  };

  // Fetch cart count from API for logged users
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const response = await fetch('/api/cart', {
            headers: { 'x-user-id': user.id },
          });
          if (response.ok) {
            const data = await response.json();
            // Calculate total quantity (sum of all item quantities)
            const totalQuantity = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
            setApiCartCount(totalQuantity);
          }
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      } else {
        setApiCartCount(0);
      }
    };

    fetchCartCount();

    // Listen for cart updates
    const handleCartSynced = () => {
      fetchCartCount();
    };

    window.addEventListener('cartSynced', handleCartSynced);
    return () => window.removeEventListener('cartSynced', handleCartSynced);
  }, [user]);

  // Redirect to marketplace if user is not logged in, except for public marketplace pages
  useEffect(() => {
    if (!loading && !user && pathname !== '/marketplace' && !pathname.startsWith('/product/') && !pathname.startsWith('/department/') && !pathname.startsWith('/organization/')) {
      router.push('/marketplace');
    }
  }, [user, loading, pathname, router]);

  const getPageTitle = (path: string) => {
    // Handle dynamic routes
    if (path.startsWith('/product/')) return 'Produto';
    if (path.startsWith('/department/')) return 'Departamento';
    if (path.startsWith('/organization/')) return 'Organização';

    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/marketplace': 'Marketplace',
      '/account': 'Minha Conta',
      '/relationships': 'Relacionamentos',
      '/relationships/chat': 'Chat',
      '/relationships/connections': 'Relações',
      '/relationships/contacts': 'Contatos',
      '/relationships/favorites': 'Favoritos',
      '/inventory': 'Inventário',
      '/inventory/media': 'Arquivos de Mídia',
      '/inventory/documents': 'Documentos',
      '/inventory/purchases': 'Produtos Comprados',
      '/inventory/food': 'Alimentos',
      '/inventory/real-estate': 'Imóveis',
      '/inventory/vehicles': 'Automóveis',
      '/finances': 'Finanças',
      '/finances/accounts': 'Contas Bancárias',
      '/finances/cards': 'Cartões',
      '/finances/expenses': 'Despesas',
      '/finances/revenue': 'Receitas',
      '/finances/goals': 'Metas Financeiras',
      '/finances/reports': 'Relatórios Financeiros',
      '/health': 'Saúde',
      '/health/diet': 'Dieta',
      '/health/workouts': 'Treinos',
      '/health/medications': 'Medicações',
      '/health/procedures': 'Procedimentos',
      '/health/exams': 'Exames',
      '/business': 'Negócios',
      '/checkout': 'Finalizar Compra',
      '/settings': 'Configurações',
      '/subscription': 'Plano Corporativo'
    };
    return titles[path] || 'Dashboard';
  };

  const getPageDescription = (path: string) => {
    // Handle dynamic routes
    if (path.startsWith('/product/')) return 'Veja os detalhes do produto';
    if (path.startsWith('/department/')) return 'Explore produtos neste departamento';
    if (path.startsWith('/organization/')) return 'Veja todos os produtos desta organização';

    const descriptions: Record<string, string> = {
      '/': 'Visão geral do seu negócio e atividades',
      '/marketplace': 'Explore produtos e serviços disponíveis',
      '/account': 'Gerencie suas informações pessoais',
      '/relationships': 'Gerencie conexões e rede de contatos',
      '/relationships/chat': 'Converse com seus contatos e conexões',
      '/relationships/connections': 'Gerencie suas relações pessoais, profissionais e familiares',
      '/relationships/contacts': 'Visualize e gerencie todos os seus contatos',
      '/relationships/favorites': 'Visualize seus contatos favoritos marcados com estrela',
      '/inventory': 'Controle e gerencie tudo que é de sua posse',
      '/inventory/media': 'Organize seus arquivos de mídia (fotos, vídeos, áudios)',
      '/inventory/documents': 'Organize seus documentos importantes',
      '/inventory/purchases': 'Gerencie produtos que você comprou',
      '/inventory/food': 'Controle seu estoque de alimentos',
      '/inventory/real-estate': 'Gerencie seus imóveis e propriedades',
      '/inventory/vehicles': 'Gerencie seus automóveis e documentação',
      '/finances': 'Gerencie sua saúde financeira',
      '/finances/accounts': 'Cadastre e gerencie suas contas bancárias',
      '/finances/cards': 'Gerencie seus cartões de crédito e débito',
      '/finances/expenses': 'Registre e acompanhe suas despesas',
      '/finances/revenue': 'Registre suas fontes de renda e receitas',
      '/finances/goals': 'Estabeleça e acompanhe suas metas financeiras',
      '/finances/reports': 'Visualize relatórios e análises financeiras',
      '/health': 'Gerencie sua saúde e bem-estar',
      '/health/diet': 'Gerencie seus planos alimentares e refeições',
      '/health/workouts': 'Acompanhe seus treinos e exercícios físicos',
      '/health/medications': 'Controle seus medicamentos e prescrições',
      '/health/procedures': 'Registro de procedimentos médicos realizados',
      '/health/exams': 'Histórico e resultados de exames médicos',
      '/business': 'Gerencie seus negócios e oportunidades',
      '/checkout': 'Revise seu carrinho e finalize sua compra com segurança',
      '/settings': 'Personalize sua experiência na Mercantia',
      '/subscription': 'Potencialize seu negócio com ferramentas de IA avançadas'
    };
    return descriptions[path] || 'Visão geral do seu negócio e atividades';
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Check if in Account section (account, relationships, inventory, finances, health)
  const isInAccountSection = () => {
    return pathname === '/account' || pathname === '/relationships' || pathname.startsWith('/relationships/') || pathname === '/inventory' || pathname.startsWith('/inventory/') || pathname === '/finances' || pathname.startsWith('/finances/') || pathname === '/health' || pathname.startsWith('/health/');
  };

  // Check if in Relationships section
  const isInRelationshipsSection = () => {
    return pathname === '/relationships' || pathname.startsWith('/relationships/');
  };

  // Check if in Health section
  const isInHealthSection = () => {
    return pathname === '/health' || pathname.startsWith('/health/');
  };

  // Check if in Finance section
  const isInFinanceSection = () => {
    return pathname === '/finances' || pathname.startsWith('/finances/');
  };

  // Check if in Inventory section
  const isInInventorySection = () => {
    return pathname === '/inventory' || pathname.startsWith('/inventory/');
  };

  // Check if in Business section (business or business/[id])
  const isInBusinessSection = () => {
    return pathname === '/business' || pathname.startsWith('/business/');
  };

  // Check if in Marketplace section (marketplace, product, department, organization, or checkout)
  const isInMarketplaceSection = () => {
    return pathname === '/marketplace' || pathname.startsWith('/product/') || pathname.startsWith('/department/') || pathname.startsWith('/organization/') || pathname === '/checkout';
  };

  return (
    <SidebarProvider>
      <CartSyncManager />
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

          <SidebarContent className="px-2 flex-1 overflow-y-auto space-y-0">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Show Dashboard only for authenticated users */}
                  {user && (
                    <SidebarMenuItem>
                      <Link
                        href="/"
                        className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors ${
                          sidebarCompact ? 'justify-center px-1' : 'gap-3 px-3'
                        } ${
                          isActive('/')
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Home className="w-5 h-5" />
                        {!sidebarCompact && <span className="font-medium">Dashboard</span>}
                      </Link>
                    </SidebarMenuItem>
                  )}

                  {/* Marketplace - Collapsible Section */}
                  {!sidebarCompact && (
                    <Collapsible
                      open={marketplaceExpanded}
                      onOpenChange={toggleMarketplaceExpanded}
                      className="w-full"
                    >
                      <div className="flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors gap-3 px-3" style={{
                        backgroundColor: isInMarketplaceSection() ? 'var(--accent)' : 'transparent',
                        color: isInMarketplaceSection() ? 'var(--accent-foreground)' : 'inherit'
                      }}>
                        <Link
                          href="/marketplace"
                          className="flex items-center gap-3 flex-1"
                        >
                          <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium">Marketplace</span>
                        </Link>
                        <CollapsibleTrigger asChild>
                          <button
                            className="p-1 hover:bg-accent/50 rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {marketplaceExpanded ? (
                              <ChevronDown className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            )}
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                        <div className="ml-4 space-y-1 mt-2">
                          {/* Organizações */}
                          <Link
                            href="/marketplace/organizations"
                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors ${
                              pathname === '/marketplace/organizations'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                          >
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Organizações</span>
                          </Link>

                          {/* Departamentos */}
                          <Link
                            href="/marketplace/departments"
                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors ${
                              pathname === '/marketplace/departments'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                          >
                            <BarChart3 className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Departamentos</span>
                          </Link>

                          {/* Produtos */}
                          <Link
                            href="/marketplace/products"
                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors ${
                              pathname === '/marketplace/products'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                          >
                            <Package className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Produtos</span>
                          </Link>

                          {/* Carrinho - Only show if there are items */}
                          {((user && apiCartCount > 0) || (!user && cartState.itemCount > 0)) && (
                            <Link
                              href="/checkout"
                              className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors relative ${
                                pathname === '/checkout'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">Carrinho</span>
                              <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                                {user ? apiCartCount : cartState.itemCount}
                              </Badge>
                            </Link>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  {sidebarCompact && (
                    <SidebarMenuItem>
                      <Link
                        href="/marketplace"
                        className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors justify-center px-1 ${
                          isInMarketplaceSection()
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </Link>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account & Business Management - Only for authenticated users */}
            {user && (
              <>
                <SidebarGroup className="py-0">
                  <SidebarGroupContent className="py-0">
                    <SidebarMenu>
                      {/* Minha Conta - Collapsible Section */}
                      {!sidebarCompact && (
                        <Collapsible
                          open={accountExpanded}
                          onOpenChange={toggleAccountExpanded}
                          className="w-full"
                        >
                          <div className="flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors gap-3 px-3" style={{
                            backgroundColor: isInAccountSection() ? 'var(--accent)' : 'transparent',
                            color: isInAccountSection() ? 'var(--accent-foreground)' : 'inherit'
                          }}>
                            <Link
                              href="/account"
                              className="flex items-center gap-3 flex-1"
                            >
                              <User className="w-5 h-5 flex-shrink-0" />
                              <span className="font-medium">Minha Conta</span>
                            </Link>
                            <CollapsibleTrigger asChild>
                              <button
                                className="p-1 hover:bg-accent/50 rounded transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {accountExpanded ? (
                                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                )}
                              </button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                            <div className="ml-4 space-y-1 mt-2">
                              {/* Relacionamentos - Collapsible Subitem */}
                              <Collapsible
                                open={relationshipsExpanded}
                                onOpenChange={toggleRelationshipsExpanded}
                                className="w-full"
                              >
                                <div className="flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors" style={{
                                  backgroundColor: isInRelationshipsSection() ? 'var(--accent)' : 'transparent',
                                  color: isInRelationshipsSection() ? 'var(--accent-foreground)' : 'inherit'
                                }}>
                                  <Link
                                    href="/relationships"
                                    className="flex items-center gap-2 flex-1"
                                  >
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">Relacionamentos</span>
                                  </Link>
                                  <CollapsibleTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-accent/50 rounded transition-colors ml-auto"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {relationshipsExpanded ? (
                                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                      )}
                                    </button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                                  <div className="ml-4 space-y-1 mt-2">
                                    {/* Chat */}
                                    <Link
                                      href="/relationships/chat"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/relationships/chat'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <MessageCircle className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Chat</span>
                                    </Link>

                                    {/* Relações */}
                                    <Link
                                      href="/relationships/connections"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/relationships/connections'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Users className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Relações</span>
                                    </Link>

                                    {/* Contatos */}
                                    <Link
                                      href="/relationships/contacts"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/relationships/contacts'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Users className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Contatos</span>
                                    </Link>

                                    {/* Favoritos */}
                                    <Link
                                      href="/relationships/favorites"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/relationships/favorites'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Star className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Favoritos</span>
                                    </Link>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Inventário - Collapsible Subitem */}
                              <Collapsible
                                open={inventoryExpanded}
                                onOpenChange={toggleInventoryExpanded}
                                className="w-full"
                              >
                                <div className="flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors" style={{
                                  backgroundColor: isInInventorySection() ? 'var(--accent)' : 'transparent',
                                  color: isInInventorySection() ? 'var(--accent-foreground)' : 'inherit'
                                }}>
                                  <Link
                                    href="/inventory"
                                    className="flex items-center gap-2 flex-1"
                                  >
                                    <Package className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">Inventário</span>
                                  </Link>
                                  <CollapsibleTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-accent/50 rounded transition-colors ml-auto"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {inventoryExpanded ? (
                                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                      )}
                                    </button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                                  <div className="ml-4 space-y-1 mt-2">
                                    {/* Arquivos de Mídia */}
                                    <Link
                                      href="/inventory/media"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/inventory/media'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <ImageIcon className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Mídia</span>
                                    </Link>

                                    {/* Documentos */}
                                    <Link
                                      href="/inventory/documents"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/inventory/documents'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <FileText className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Documentos</span>
                                    </Link>

                                    {/* Produtos Comprados */}
                                    <Link
                                      href="/inventory/purchases"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/inventory/purchases'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <ShoppingCartIcon className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Compras</span>
                                    </Link>

                                    {/* Alimentos */}
                                    <Link
                                      href="/inventory/food"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/inventory/food'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <UtensilsCrossed className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Alimentos</span>
                                    </Link>

                                    {/* Imóveis */}
                                    <Link
                                      href="/inventory/real-estate"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/inventory/real-estate'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <HomeIcon className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Imóveis</span>
                                    </Link>

                                    {/* Automóveis */}
                                    <Link
                                      href="/inventory/vehicles"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/inventory/vehicles'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Car className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Automóveis</span>
                                    </Link>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Finanças - Collapsible Subitem */}
                              <Collapsible
                                open={financeExpanded}
                                onOpenChange={toggleFinanceExpanded}
                                className="w-full"
                              >
                                <div className="flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors" style={{
                                  backgroundColor: isInFinanceSection() ? 'var(--accent)' : 'transparent',
                                  color: isInFinanceSection() ? 'var(--accent-foreground)' : 'inherit'
                                }}>
                                  <Link
                                    href="/finances"
                                    className="flex items-center gap-2 flex-1"
                                  >
                                    <Wallet className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">Finanças</span>
                                  </Link>
                                  <CollapsibleTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-accent/50 rounded transition-colors ml-auto"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {financeExpanded ? (
                                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                      )}
                                    </button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                                  <div className="ml-4 space-y-1 mt-2">
                                    {/* Contas Bancárias */}
                                    <Link
                                      href="/finances/accounts"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/finances/accounts'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Wallet className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Contas</span>
                                    </Link>

                                    {/* Cartões */}
                                    <Link
                                      href="/finances/cards"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/finances/cards'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <CreditCard className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Cartões</span>
                                    </Link>

                                    {/* Despesas */}
                                    <Link
                                      href="/finances/expenses"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/finances/expenses'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <TrendingDown className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Despesas</span>
                                    </Link>

                                    {/* Receitas */}
                                    <Link
                                      href="/finances/revenue"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/finances/revenue'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <TrendingUp className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Receitas</span>
                                    </Link>

                                    {/* Metas */}
                                    <Link
                                      href="/finances/goals"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/finances/goals'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Target className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Metas</span>
                                    </Link>

                                    {/* Relatórios */}
                                    <Link
                                      href="/finances/reports"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/finances/reports'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <BarChart3 className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Relatórios</span>
                                    </Link>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Saúde - Collapsible Subitem */}
                              <Collapsible
                                open={healthExpanded}
                                onOpenChange={toggleHealthExpanded}
                                className="w-full"
                              >
                                <div className="flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors" style={{
                                  backgroundColor: isInHealthSection() ? 'var(--accent)' : 'transparent',
                                  color: isInHealthSection() ? 'var(--accent-foreground)' : 'inherit'
                                }}>
                                  <Link
                                    href="/health"
                                    className="flex items-center gap-2 flex-1"
                                  >
                                    <Heart className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">Saúde</span>
                                  </Link>
                                  <CollapsibleTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-accent/50 rounded transition-colors ml-auto"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {healthExpanded ? (
                                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                      )}
                                    </button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                                  <div className="ml-4 space-y-1 mt-2">
                                    {/* Dieta */}
                                    <Link
                                      href="/health/diet"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/health/diet'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Apple className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Dieta</span>
                                    </Link>

                                    {/* Treinos */}
                                    <Link
                                      href="/health/workouts"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/health/workouts'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Dumbbell className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Treinos</span>
                                    </Link>

                                    {/* Medicações */}
                                    <Link
                                      href="/health/medications"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/health/medications'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Pill className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Medicações</span>
                                    </Link>

                                    {/* Procedimentos */}
                                    <Link
                                      href="/health/procedures"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/health/procedures'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Activity className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Procedimentos</span>
                                    </Link>

                                    {/* Exames */}
                                    <Link
                                      href="/health/exams"
                                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-xs transition-colors ${
                                        pathname === '/health/exams'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                      }`}
                                    >
                                      <Microscope className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Exames</span>
                                    </Link>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                      {sidebarCompact && (
                        <SidebarMenuItem>
                          <Link
                            href="/account"
                            className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors justify-center px-1 ${
                              isInAccountSection()
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <User className="w-5 h-5" />
                          </Link>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Negócios */}
                <SidebarGroup className="py-0">
                  <SidebarGroupContent className="py-0">
                    <SidebarMenu>
                      {!sidebarCompact && (
                        <Collapsible
                          open={businessExpanded}
                          onOpenChange={toggleBusinessExpanded}
                          className="w-full"
                        >
                          <div className="flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors gap-3 px-3" style={{
                            backgroundColor: isInBusinessSection() ? 'var(--accent)' : 'transparent',
                            color: isInBusinessSection() ? 'var(--accent-foreground)' : 'inherit'
                          }}>
                            <Link
                              href="/business"
                              className="flex items-center gap-3 flex-1"
                            >
                              <Briefcase className="w-5 h-5 flex-shrink-0" />
                              <span className="font-medium">Negócios</span>
                            </Link>
                            <CollapsibleTrigger asChild>
                              <button
                                className="p-1 hover:bg-accent/50 rounded transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {businessExpanded ? (
                                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                )}
                              </button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                            <div className="ml-4 space-y-1 mt-2">
                              <BusinessDropdown sidebarCompact={sidebarCompact} />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                      {sidebarCompact && (
                        <SidebarMenuItem>
                          <Link
                            href="/business"
                            className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors justify-center px-1 ${
                              isInBusinessSection()
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <Briefcase className="w-5 h-5" />
                          </Link>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
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

                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Configurações
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link href="/subscription">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Assinatura
                        </Link>
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
                  <Link
                    href="/auth/login"
                    className={`flex w-full items-center py-3 hover:bg-accent rounded-md transition-colors ${
                      sidebarCompact ? 'justify-center px-1' : 'gap-3 px-3'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    {!sidebarCompact && <span className="font-medium">Fazer Login</span>}
                  </Link>
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
            {/* Sidebar Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebarCompact}
              className="hidden md:flex"
              title={sidebarCompact ? "Expandir sidebar" : "Compactar sidebar"}
            >
              <PanelLeft className="w-4 h-4" />
            </Button>

            {/* Separator */}
            <div className="hidden md:block w-px h-8 bg-border"></div>

            {/* Page Title & Description */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">{getPageTitle(pathname)}</h1>
              <p className="text-sm text-muted-foreground">{getPageDescription(pathname)}</p>
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
            {children}
          </main>
        </div>
      </div>

      {/* Enhanced Dock Navigation - Mobile only */}
      <div className="md:hidden">
        <DockNavigation
          showSidebar={false}
          onToggleSidebar={() => {}}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </div>
    </SidebarProvider>
  );
}
