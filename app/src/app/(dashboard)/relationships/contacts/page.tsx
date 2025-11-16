import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contatos - Relacionamentos - Mercantia',
  description: 'Visualize e gerencie todos os seus contatos.',
};

export default function ContactsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contatos</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie todos os seus contatos</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de contatos em desenvolvimento.</p>
      </div>
    </div>
  );
}
