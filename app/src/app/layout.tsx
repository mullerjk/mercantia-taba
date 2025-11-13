import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { JsonLd, createWebSiteJsonLd } from "@/components/seo/json-ld";

export const metadata = {
  title: {
    default: 'Mercantia - Marketplace Inteligente',
    template: '%s | Mercantia'
  },
  description: 'Marketplace inteligente com dados Schema.org estruturados. Explore produtos verificados, organizações e pessoas com dados estruturados completos.',
  keywords: ['marketplace', 'schema.org', 'dados estruturados', 'produtos', 'organizações', 'pessoas'],
  authors: [{ name: 'Mercantia Team' }],
  creator: 'Mercantia',
  publisher: 'Mercantia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mercantia.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mercantia - Marketplace Inteligente',
    description: 'Explore produtos e serviços com dados Schema.org estruturados completos.',
    url: 'https://mercantia.app',
    siteName: 'Mercantia',
    images: [
      {
        url: '/og-marketplace.jpg',
        width: 1200,
        height: 630,
        alt: 'Mercantia Marketplace',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mercantia - Marketplace Inteligente',
    description: 'Explore produtos e serviços com dados Schema.org estruturados',
    images: ['/og-marketplace.jpg'],
    creator: '@mercantia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = createWebSiteJsonLd();

  return (
    <html lang="pt-BR">
      <head>
        <JsonLd data={websiteJsonLd} />
      </head>
      <body className="bg-background">
        <ThemeProvider>
          <TranslationProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
