import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Documentos - Inventário - Mercantia',
  description: 'Organize e gerencie seus documentos importantes.',
};

export default function DocumentsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documentos</h1>
        <p className="text-gray-600 mt-1">Organize e gerencie seus documentos (contratos, certificados, etc)</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de documentos em desenvolvimento.</p>
      </div>
    </div>
  );
}
