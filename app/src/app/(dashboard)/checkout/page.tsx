import { Metadata } from "next";
import CheckoutPage from "@/components/pages/checkout";

export const metadata: Metadata = {
  title: 'Checkout - Mercantia',
  description: 'Finalize suas compras.',
};

export default function Checkout() {
  return <CheckoutPage />;
}
