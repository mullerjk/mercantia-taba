import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Treinos - Saúde - Mercantia',
  description: 'Acompanhe seus treinos e exercícios físicos.',
};

export default function WorkoutsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Treinos</h1>
        <p className="text-gray-600 mt-1">Acompanhe seus treinos e exercícios físicos</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de treinos em desenvolvimento.</p>
      </div>
    </div>
  );
}
