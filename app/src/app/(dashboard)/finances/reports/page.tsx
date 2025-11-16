import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Relatórios - Finanças - Mercantia',
  description: 'Visualize relatórios e análises financeiras.',
};

export default function ReportsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios Financeiros</h1>
        <p className="text-gray-600 mt-1">Visualize relatórios e análises financeiras</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de relatórios em desenvolvimento.</p>
      </div>
    </div>
  );
}
