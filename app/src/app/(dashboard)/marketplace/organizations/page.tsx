import { Metadata } from "next";
import MarketplacePage from "@/components/pages/marketplace";

export const metadata: Metadata = {
  title: 'Organizações - Marketplace - Mercantia',
  description: 'Explore organizações e seus produtos no marketplace Mercantia.',
};

export default function OrganizationsPage() {
  return <MarketplacePage defaultSection="organizations" />;
}
