import { Metadata } from "next";
import DashboardHome from "../dashboard-home";

export const metadata: Metadata = {
  title: 'Dashboard - Mercantia',
  description: 'Visão geral do seu negócio e atividades no marketplace Mercantia.',
};

export default function DashboardPage() {
  return <DashboardHome />;
}
