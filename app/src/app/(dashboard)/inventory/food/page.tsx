import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Alimentos - Inventário - Mercantia',
  description: 'Controle seu estoque de alimentos e vencimentos.',
};

export default function FoodPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alimentos</h1>
        <p className="text-gray-600 mt-1">Controle seu estoque de alimentos e datas de vencimento</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de alimentos em desenvolvimento.</p>
      </div>
    </div>
  );
}
