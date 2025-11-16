import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Compras - Inventário - Mercantia',
  description: 'Gerencie seus produtos comprados no marketplace.',
};

export default function PurchasesPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Produtos Comprados</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os produtos que você comprou no marketplace</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de compras em desenvolvimento.</p>
      </div>
    </div>
  );
}
