import { Metadata } from "next";
import RelationshipsPage from "@/components/pages/relationships";

export const metadata: Metadata = {
  title: 'Relacionamentos - Mercantia',
  description: 'Gerencie suas conexões e rede de contatos.',
};

export default function Relationships() {
  return <RelationshipsPage />;
}
