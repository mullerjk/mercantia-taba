import { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: 'Dashboard - Mercantia',
  description: 'Visão geral do seu negócio e atividades no marketplace Mercantia.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
