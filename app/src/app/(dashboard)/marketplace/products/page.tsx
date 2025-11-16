import { Metadata } from "next";
import MarketplacePage from "@/components/pages/marketplace";

export const metadata: Metadata = {
  title: 'Produtos - Marketplace - Mercantia',
  description: 'Explore todos os produtos disponíveis no marketplace Mercantia.',
};

export default function ProductsPage() {
  return <MarketplacePage defaultSection="products" />;
}
