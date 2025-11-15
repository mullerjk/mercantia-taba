import { Metadata } from "next";
import FinancesPage from "@/components/pages/finances";

export const metadata: Metadata = {
  title: 'Finanças - Mercantia',
  description: 'Gestão financeira completa.',
};

export default function Finances() {
  return <FinancesPage />;
}
