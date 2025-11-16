import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cartões - Finanças - Mercantia',
  description: 'Gerencie seus cartões de crédito e débito.',
};

export default function CardsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cartões</h1>
        <p className="text-gray-600 mt-1">Gerencie seus cartões de crédito e débito</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de cartões em desenvolvimento.</p>
      </div>
    </div>
  );
}
