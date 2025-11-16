import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Procedimentos - Saúde - Mercantia',
  description: 'Registro de procedimentos médicos realizados.',
};

export default function ProceduresPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Procedimentos</h1>
        <p className="text-gray-600 mt-1">Registro de procedimentos médicos realizados</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de procedimentos em desenvolvimento.</p>
      </div>
    </div>
  );
}
