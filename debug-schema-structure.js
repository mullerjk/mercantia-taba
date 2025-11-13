// Debug script to inspect schema.org structure
import { SchemaOrgClient } from './mcp-schema-org/dist/schema-org-client.js';

async function debugSchemaStructure() {
  console.log('🔍 Debugging Schema.org structure...\n');
  
  const client = new SchemaOrgClient();
  await client.initialize();
  
  // Access private schemaData via reflection (for debugging only)
  const schemaData = client['schemaData'];
  
  console.log(`📊 Total entries in schemaData: ${schemaData.size}\n`);
  
  // Find Thing
  const thing = schemaData.get('schema:Thing');
  console.log('Thing entry:', {
    id: thing?.['@id'],
    type: thing?.['@type'],
    label: thing?.['rdfs:label'],
    comment: thing?.['rdfs:comment']?.substring(0, 100),
    subClassOf: thing?.['rdfs:subClassOf']
  });
  console.log('');
  
  // Find types that claim Thing as parent
  let thingChildren = 0;
  let sampleChildren = [];
  
  for (const [key, value] of schemaData.entries()) {
    if (!value['@type'] || !Array.isArray(value['@type'])) continue;
    if (!value['@type'].includes('rdfs:Class')) continue;
    
    const subClassOf = value['rdfs:subClassOf'];
    if (!subClassOf) continue;
    
    const subClasses = Array.isArray(subClassOf) ? subClassOf : [subClassOf];
    
    const hasThing = subClasses.some(sc => 
      sc['@id'] === 'schema:Thing' || sc['@id'] === 'Thing'
    );
    
    if (hasThing) {
      thingChildren++;
      if (sampleChildren.length < 10) {
        sampleChildren.push({
          name: value['rdfs:label'],
          id: value['@id'],
          subClassOf: subClasses.map(sc => sc['@id'])
        });
      }
    }
  }
  
  console.log(`👶 Found ${thingChildren} types that inherit from Thing\n`);
  console.log('Sample children:');
  sampleChildren.forEach((child, i) => {
    console.log(`  ${i + 1}. ${child.name} (${child.id})`);
    console.log(`     subClassOf: ${child.subClassOf.join(', ')}`);
  });
}

debugSchemaStructure().catch(console.error);
