import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Metas - Finanças - Mercantia',
  description: 'Estabeleça e acompanhe suas metas financeiras.',
};

export default function GoalsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Metas Financeiras</h1>
        <p className="text-gray-600 mt-1">Estabeleça e acompanhe suas metas financeiras</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de metas financeiras em desenvolvimento.</p>
      </div>
    </div>
  );
}
