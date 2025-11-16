import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Favoritos - Relacionamentos - Mercantia',
  description: 'Visualize seus contatos favoritos.',
};

export default function FavoritesPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <p className="text-gray-600 mt-1">Visualize seus contatos favoritos marcados com estrela</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de favoritos em desenvolvimento.</p>
      </div>
    </div>
  );
}
