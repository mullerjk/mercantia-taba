import "./globals.css";
import { DockNavigation } from "@/components/dock-navigation";

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
        {children}
        <DockNavigation />
      </body>
    </html>
  );
}
