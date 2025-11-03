// Inspect actual schema.org JSON-LD format
import { SchemaOrgClient } from './mcp-schema-org/dist/schema-org-client.js';

async function inspectFormat() {
  console.log('🔍 Inspecting Schema.org JSON-LD format...\n');
  
  const client = new SchemaOrgClient();
  await client.initialize();
  
  const schemaData = client['schemaData'];
  
  // Get first 10 entries to see structure
  let count = 0;
  for (const [key, value] of schemaData.entries()) {
    if (count >= 10) break;
    
    console.log(`\nEntry ${count + 1}:`);
    console.log(`  Key: ${key}`);
    console.log(`  @id: ${value['@id']}`);
    console.log(`  @type:`, value['@type']);
    console.log(`  rdfs:label:`, value['rdfs:label']);
    
    if (value['rdfs:subClassOf']) {
      console.log(`  rdfs:subClassOf:`, JSON.stringify(value['rdfs:subClassOf'], null, 2));
    }
    
    count++;
  }
  
  // Count different @type values
  console.log('\n\n📊 Counting @type values:');
  const typeCounts = new Map();
  
  for (const [key, value] of schemaData.entries()) {
    const types = value['@type'];
    if (Array.isArray(types)) {
      types.forEach(t => {
        typeCounts.set(t, (typeCounts.get(t) || 0) + 1);
      });
    } else if (types) {
      typeCounts.set(types, (typeCounts.get(types) || 0) + 1);
    }
  }
  
  console.log('\nType counts:');
  for (const [type, count] of typeCounts.entries()) {
    console.log(`  ${type}: ${count}`);
  }
  
  // Find Action specifically
  console.log('\n\n🎯 Looking at Action specifically:');
  const action = schemaData.get('schema:Action');
  if (action) {
    console.log(JSON.stringify(action, null, 2));
  }
}

inspectFormat().catch(console.error);
