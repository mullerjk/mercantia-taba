import { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: 'Dashboard - Mercantia',
  description: 'Visão geral do seu negócio e atividades no marketplace Mercantia. Acesse produtos, organizações e dados Schema.org estruturados.',
  keywords: ['dashboard', 'marketplace', 'schema.org', 'negócios', 'produtos'],
  openGraph: {
    title: 'Dashboard - Mercantia Marketplace',
    description: 'Gerencie seu negócio e explore produtos verificados com dados Schema.org estruturados.',
    url: 'https://mercantia.app',
    siteName: 'Mercantia',
    images: [
      {
        url: '/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'Mercantia Dashboard',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard - Mercantia Marketplace',
    description: 'Gerencie seu negócio e explore produtos verificados',
    images: ['/og-dashboard.jpg'],
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
