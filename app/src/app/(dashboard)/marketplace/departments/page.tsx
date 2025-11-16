import { Metadata } from "next";
import MarketplacePage from "@/components/pages/marketplace";

export const metadata: Metadata = {
  title: 'Departamentos - Marketplace - Mercantia',
  description: 'Explore departamentos e categorias de produtos no marketplace Mercantia.',
};

export default function DepartmentsPage() {
  return <MarketplacePage defaultSection="departments" />;
}
