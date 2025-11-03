// Debug specific types to understand Schema.org structure
import { SchemaOrgClient } from './mcp-schema-org/dist/schema-org-client.js';

async function debugSpecificTypes() {
  console.log('🔍 Debugging specific Schema.org types...\n');
  
  const client = new SchemaOrgClient();
  await client.initialize();
  
  const schemaData = client['schemaData'];
  
  // Check Action, Person, Organization, Place
  const typesToCheck = ['Action', 'Person', 'Organization', 'Place', 'Event', 'CreativeWork', 'Intangible'];
  
  for (const typeName of typesToCheck) {
    const type = schemaData.get(`schema:${typeName}`);
    if (type) {
      console.log(`\n📦 ${typeName}:`);
      console.log(`   @id: ${type['@id']}`);
      console.log(`   @type: ${JSON.stringify(type['@type'])}`);
      console.log(`   rdfs:label: ${type['rdfs:label']}`);
      
      const subClassOf = type['rdfs:subClassOf'];
      if (subClassOf) {
        const subClasses = Array.isArray(subClassOf) ? subClassOf : [subClassOf];
        console.log(`   rdfs:subClassOf: ${JSON.stringify(subClasses.map(sc => sc['@id']))}`);
      } else {
        console.log(`   rdfs:subClassOf: (none - THIS IS THE ROOT!)`);
      }
    }
  }
  
  // Find all types without subClassOf (potential roots)
  console.log('\n\n🌳 Finding types without subClassOf (potential roots):');
  let rootCount = 0;
  const roots = [];
  
  for (const [key, value] of schemaData.entries()) {
    if (!value['@type'] || !Array.isArray(value['@type'])) continue;
    if (!value['@type'].includes('rdfs:Class')) continue;
    if (!value['rdfs:subClassOf']) {
      rootCount++;
      if (roots.length < 20) {
        roots.push(value['rdfs:label']);
      }
    }
  }
  
  console.log(`Found ${rootCount} types without parent`);
  console.log('First 20:', roots);
}

debugSpecificTypes().catch(console.error);
