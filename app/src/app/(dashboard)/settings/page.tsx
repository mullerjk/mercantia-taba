import { Metadata } from "next";
import SettingsPage from "@/components/pages/settings";

export const metadata: Metadata = {
  title: 'Configurações - Mercantia',
  description: 'Personalize sua experiência na Mercantia.',
};

export default function Settings() {
  return <SettingsPage />;
}
