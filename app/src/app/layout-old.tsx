import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MCPProvider } from "@/components/mcp-provider";

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
          <MCPProvider>
            {children}
          </MCPProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
