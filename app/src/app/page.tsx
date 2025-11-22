"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Download,
  Users,
  CalendarIcon,
  FileTextIcon,
  BellIcon,
  Share2Icon,
  Home,
  Settings,
  User,
  BarChart3,
  ShoppingCart,
  Package,
  TrendingUp,
  MoreHorizontal,
  Search,
  Plus,
  ChevronDown,
  Menu,
  X,
  Heart,
  Store
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

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

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const [changelogItems, setChangelogItems] = useState<ChangelogItem[]>([]);

  // Fetch real entities from database
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        console.log('Fetching entities from API...');
        const response = await fetch('/api/entities');
        if (response.ok) {
          const entities = await response.json();
          console.log('Fetched entities:', entities);

          const items: ChangelogItem[] = entities.map((entity: any) => {
            const category = entity.schema_type.split(':')[1] || 'Thing';
            let description = `New ${category} entity registered in the system`;

            // Create specific descriptions based on entity type and properties
            switch (category) {
              case 'Person':
                const personProps = entity.properties || {};
                const personDetails = [];
                if (personProps.jobTitle) personDetails.push(personProps.jobTitle);
                if (personProps.worksFor) personDetails.push(`at ${personProps.worksFor}`);
                if (personProps.email) personDetails.push(`contact: ${personProps.email}`);
                description = personDetails.length > 0
                  ? `${personProps.givenName || ''} ${personProps.familyName || entity.name} - ${personDetails.join(', ')}`
                  : `${entity.name} joined the network`;
                break;

              case 'Organization':
                const orgProps = entity.properties || {};
                const orgDetails = [];
                if (orgProps.orgType) orgDetails.push(orgProps.orgType);
                if (orgProps.foundingDate) orgDetails.push(`Founded ${orgProps.foundingDate}`);
                if (orgProps.url) orgDetails.push(`Website: ${orgProps.url}`);
                description = orgDetails.length > 0
                  ? `${entity.name} - ${orgDetails.join(', ')}`
                  : `${entity.name} is now part of our business network`;
                break;

              case 'Product':
                const productProps = entity.properties || {};
                const productDetails = [];
                if (productProps.price) productDetails.push(`$${productProps.price}`);
                if (productProps.category) productDetails.push(productProps.category);
                if (productProps.brand) productDetails.push(`by ${productProps.brand}`);
                description = productDetails.length > 0
                  ? `${entity.name} - ${productDetails.join(', ')}`
                  : `${entity.name} now available in our marketplace`;
                break;

              default:
                description = entity.properties?.description || `New ${category} entity: ${entity.name}`;
            }

            return {
              id: entity.id,
              title: entity.name,
              description: description,
              emoji: getEmojiForCategory(category),
              category: category,
              schemaType: entity.schema_type,
              timestamp: new Date(entity.created_at).toLocaleString(),
              version: `v1.0.0`,
            };
          });

          console.log('Converted to timeline items:', items);
          setChangelogItems(items);
        } else {
          console.error('Failed to fetch entities:', response.status);
          setChangelogItems([]);
        }
      } catch (error) {
        console.error('Error fetching entities:', error);
        setChangelogItems([]);
      }
    };

    fetchEntities();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchEntities, 30000);

    return () => clearInterval(interval);
  }, []);

  const getEmojiForCategory = (category: string): string => {
    const emojiMap: Record<string, string> = {
      "Thing": "🌐",
      "CreativeWork": "🎨",
      "Organization": "🏢",
      "Person": "👤",
      "Place": "📍",
      "Event": "📅",
      "Product": "📦",
      "Action": "⚡",
      "MedicalEntity": "🏥",
      "BioChemEntity": "🧬",
      "ChemicalSubstance": "⚗️",
      "New": "✨",
    };
    return emojiMap[category] || "📄";
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Quick Access to Dashboard Modules */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => window.location.href = '/(dashboard)/marketplace'}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Marketplace
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Browse Products</div>
            <p className="text-xs text-muted-foreground">
              Explore marketplace inventory
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => window.location.href = '/(dashboard)/organization'}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Organizations
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Business</div>
            <p className="text-xs text-muted-foreground">
              Business network & relations
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => window.location.href = '/(dashboard)/relationships'}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Relationships
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connect</div>
            <p className="text-xs text-muted-foreground">
              Network & social connections
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => window.location.href = '/(dashboard)/inventory'}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Items</div>
            <p className="text-xs text-muted-foreground">
              Product & asset management
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart placeholder - Revenue over time
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Jackson Lee</p>
                  <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$299.00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">William Kim</p>
                  <p className="text-sm text-muted-foreground">will@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$99.00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Sofia Davis</p>
                  <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates from your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changelogItems.slice(0, 5).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{item.emoji}</span>
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
