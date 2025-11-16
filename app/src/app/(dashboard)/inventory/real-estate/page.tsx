import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Imóveis - Inventário - Mercantia',
  description: 'Gerencie seus imóveis e propriedades.',
};

export default function RealEstatePage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Imóveis</h1>
        <p className="text-gray-600 mt-1">Gerencie seus imóveis, propriedades e documentação imobiliária</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de imóveis em desenvolvimento.</p>
      </div>
    </div>
  );
}
