import { Metadata } from "next";
import MarketplacePage from "@/components/pages/marketplace";

export const metadata: Metadata = {
  title: 'Marketplace - Mercantia',
  description: 'Explore produtos e serviços disponíveis no marketplace Mercantia.',
};

export default function Marketplace() {
  return <MarketplacePage />;
}
