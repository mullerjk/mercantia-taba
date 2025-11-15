import { Metadata } from "next";
import SubscriptionPage from "@/components/pages/subscription";

export const metadata: Metadata = {
  title: 'Assinatura - Mercantia',
  description: 'Potencialize seu negócio com ferramentas de IA avançadas.',
};

export default function Subscription() {
  return <SubscriptionPage />;
}
