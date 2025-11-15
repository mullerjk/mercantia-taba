import { Metadata } from "next";
import InventoryPage from "@/components/pages/inventory";

export const metadata: Metadata = {
  title: 'Inventário - Mercantia',
  description: 'Controle de produtos e estoque.',
};

export default function Inventory() {
  return <InventoryPage />;
}
