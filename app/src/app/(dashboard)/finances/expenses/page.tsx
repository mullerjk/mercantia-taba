import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Despesas - Finanças - Mercantia',
  description: 'Registre e acompanhe suas despesas.',
};

export default function ExpensesPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Despesas</h1>
        <p className="text-gray-600 mt-1">Registre e acompanhe suas despesas</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de despesas em desenvolvimento.</p>
      </div>
    </div>
  );
}
