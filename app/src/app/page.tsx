import EntityNavigator from "@/components/magicui/entity-navigator";
import { mockSchemaData } from "@/data/mock-schemas";

export default function HomePage() {
  return (
    <EntityNavigator entities={mockSchemaData} />
  );
}
