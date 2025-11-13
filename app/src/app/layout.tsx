import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

export const metadata = {
  title: 'World Explorer - Mercantia TABA',
  description: 'Explore schema.org entities with interactive UI and MCP integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background">
        <ThemeProvider>
          <TranslationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
