import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Medicações - Saúde - Mercantia',
  description: 'Controle seus medicamentos e prescrições.',
};

export default function MedicationsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medicações</h1>
        <p className="text-gray-600 mt-1">Controle seus medicamentos e prescrições</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de medicações em desenvolvimento.</p>
      </div>
    </div>
  );
}
