import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: 'MagicUI Dock Demo',
  description: 'Interactive dock component with magnification effects',
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
