import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { JsonLd, createWebSiteJsonLd } from "@/components/seo/json-ld";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata = {
  title: {
    default: 'Mercantia',
    template: '%s - Mercantia'
  },
  description: 'Marketplace inteligente com dados Schema.org estruturados.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let messages;
  try {
    messages = await getMessages();
  } catch {
    messages = {};
  }

  const websiteJsonLd = createWebSiteJsonLd();

  return (
    <html lang="pt">
      <head>
        <JsonLd data={websiteJsonLd} />
      </head>
      <body className="bg-background">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TranslationProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </TranslationProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
