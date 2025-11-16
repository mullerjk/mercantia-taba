import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Automóveis - Inventário - Mercantia',
  description: 'Gerencie seus automóveis e documentação veicular.',
};

export default function VehiclesPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automóveis</h1>
        <p className="text-gray-600 mt-1">Gerencie seus automóveis, documentação e manutenção</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de automóveis em desenvolvimento.</p>
      </div>
    </div>
  );
}
