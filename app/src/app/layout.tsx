import "./globals.css";

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
      </body>
    </html>
  );
}
