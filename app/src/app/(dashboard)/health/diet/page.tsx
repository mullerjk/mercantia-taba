import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dieta - Saúde - Mercantia',
  description: 'Gerencie seus planos alimentares e refeições.',
};

export default function DietPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dieta</h1>
        <p className="text-gray-600 mt-1">Gerencie seus planos alimentares e refeições</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de dieta em desenvolvimento.</p>
      </div>
    </div>
  );
}
