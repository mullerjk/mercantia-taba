import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Exames - Saúde - Mercantia',
  description: 'Histórico e resultados de exames médicos.',
};

export default function ExamsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exames</h1>
        <p className="text-gray-600 mt-1">Histórico e resultados de exames médicos</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de exames em desenvolvimento.</p>
      </div>
    </div>
  );
}
