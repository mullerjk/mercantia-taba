// Test findSubTypes directly
import { SchemaOrgClient } from './mcp-schema-org/dist/schema-org-client.js';

async function testFindSubTypes() {
  console.log('🔍 Testing findSubTypes...\n');
  
  const client = new SchemaOrgClient();
  await client.initialize();
  
  const schemaData = client['schemaData'];
  
  // Manually implement findSubTypes with debug
  const typeId = 'schema:Thing';
  const subTypes = [];
  
  let classCount = 0;
  let withSubClassOf = 0;
  let checked = 0;
  
  for (const [key, value] of schemaData.entries()) {
    checked++;
    
    if (!value['@type'] || !Array.isArray(value['@type'])) continue;
    if (!value['@type'].includes('rdfs:Class')) continue;
    
    classCount++;
    
    const subClassOf = value['rdfs:subClassOf'];
    if (!subClassOf) continue;
    
    withSubClassOf++;
    
    // Normalize to array
    const superClasses = Array.isArray(subClassOf) ? subClassOf : [subClassOf];
    
    // Debug first match
    if (subTypes.length === 0) {
      console.log(`\nFirst type with subClassOf:`);
      console.log(`  Name: ${value['rdfs:label']}`);
      console.log(`  SubClassOf raw:`, subClassOf);
      console.log(`  SuperClasses:`, superClasses);
      console.log(`  Type of first:`, typeof superClasses[0]);
    }
    
    // Check match
    const isMatch = superClasses.some((sc) => {
      const scId = typeof sc === 'string' ? sc : (sc['@id'] || null);
      const matches = scId === typeId;
      if (subTypes.length < 3 && matches) {
        console.log(`\n  ✅ Match found!`);
        console.log(`     Type: ${value['rdfs:label']}`);
        console.log(`     sc:`, sc);
        console.log(`     scId:`, scId);
      }
      return matches;
    });
    
    if (isMatch) {
      subTypes.push({
        name: value['rdfs:label'],
        id: value['@id'],
      });
    }
  }
  
  console.log(`\n\n📊 Stats:`);
  console.log(`  Checked: ${checked} entries`);
  console.log(`  Classes: ${classCount}`);
  console.log(`  With subClassOf: ${withSubClassOf}`);
  console.log(`  Matches: ${subTypes.length}`);
  
  console.log(`\n👶 First 10 children:`);
  subTypes.slice(0, 10).forEach(child => {
    console.log(`  - ${child.name}`);
  });
}

testFindSubTypes().catch(console.error);
