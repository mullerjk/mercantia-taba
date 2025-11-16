import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Chat - Relacionamentos - Mercantia',
  description: 'Converse com seus contatos e conexões profissionais.',
};

export default function ChatPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chat</h1>
        <p className="text-gray-600 mt-1">Converse com seus contatos e conexões</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600">Funcionalidade de chat em desenvolvimento.</p>
      </div>
    </div>
  );
}
