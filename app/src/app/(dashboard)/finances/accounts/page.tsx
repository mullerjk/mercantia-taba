import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contas Bancárias - Finanças - Mercantia',
  description: 'Cadastre e gerencie suas contas bancárias.',
};

export default function AccountsPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contas Bancárias</h1>
        <p className="text-gray-600 mt-1">Cadastre e gerencie suas contas bancárias</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de contas bancárias em desenvolvimento.</p>
      </div>
    </div>
  );
}
