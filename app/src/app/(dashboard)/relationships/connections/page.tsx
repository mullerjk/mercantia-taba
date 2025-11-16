import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Relações - Relacionamentos - Mercantia',
  description: 'Gerencie suas relações pessoais, profissionais e familiares.',
};

export default function ConnectionsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relações</h1>
        <p className="text-gray-600 mt-1">Gerencie seus relacionamentos pessoais, profissionais e familiares</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de relações em desenvolvimento.</p>
      </div>
    </div>
  );
}
