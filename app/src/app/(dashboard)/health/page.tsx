import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Saúde - Mercantia',
  description: 'Gerencie sua saúde, dieta, treinos, medicações e exames.',
};

export default function HealthPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saúde</h1>
        <p className="text-gray-600 mt-1">Gerencie sua saúde e bem-estar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dieta</h2>
          <p className="text-gray-600">Gerencie seus planos alimentares e refeições</p>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Treinos</h2>
          <p className="text-gray-600">Acompanhe seus treinos e exercícios físicos</p>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Medicações</h2>
          <p className="text-gray-600">Controle seus medicamentos e prescrições</p>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Procedimentos</h2>
          <p className="text-gray-600">Registro de procedimentos médicos realizados</p>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Exames</h2>
          <p className="text-gray-600">Histórico e resultados de exames médicos</p>
        </div>
      </div>
    </div>
  );
}
