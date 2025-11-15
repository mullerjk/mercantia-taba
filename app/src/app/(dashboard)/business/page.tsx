import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Negócios - Mercantia',
  description: 'Gerencie seus negócios e oportunidades.',
};

export default function Business() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="text-6xl">💼</div>
        <h2 className="text-2xl font-bold">Negócios</h2>
        <p className="text-muted-foreground max-w-md">
          Gerencie seus negócios e oportunidades. Esta funcionalidade estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
