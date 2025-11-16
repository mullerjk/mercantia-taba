import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mídia - Inventário - Mercantia',
  description: 'Organize e gerencie seus arquivos de mídia.',
};

export default function MediaPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Arquivos de Mídia</h1>
        <p className="text-gray-600 mt-1">Organize e gerencie seus arquivos de mídia (fotos, vídeos, áudios)</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de mídia em desenvolvimento.</p>
      </div>
    </div>
  );
}
