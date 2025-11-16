import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Receitas - Finanças - Mercantia',
  description: 'Registre suas fontes de renda e receitas.',
};

export default function RevenuePage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Receitas</h1>
        <p className="text-gray-600 mt-1">Registre suas fontes de renda e receitas</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de receitas em desenvolvimento.</p>
      </div>
    </div>
  );
}
