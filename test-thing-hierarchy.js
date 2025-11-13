// Test script to verify Thing hierarchy loading
import { SchemaOrgClient } from './mcp-schema-org/dist/schema-org-client.js';

async function testThingHierarchy() {
  console.log('🔬 Testing Thing hierarchy...\n');
  
  const client = new SchemaOrgClient();
  await client.initialize();
  
  console.log('✅ Client initialized\n');
  
  // Get Thing type info
  const thingType = await client.getSchemaType('Thing');
  console.log('📊 Thing type:', {
    name: thingType.name,
    id: thingType.id,
    superTypes: thingType.superTypes
  });
  console.log('');
  
  // Get Thing hierarchy
  const hierarchy = await client.getTypeHierarchy('Thing');
  console.log('🌳 Thing hierarchy:', {
    name: hierarchy.name,
    id: hierarchy.id,
    parents: hierarchy.parents,
    childrenCount: hierarchy.children.length
  });
  console.log('');
  
  // List first 20 children
  console.log('👶 First 20 children of Thing:');
  hierarchy.children.slice(0, 20).forEach((child, i) => {
    console.log(`  ${i + 1}. ${child.name} (${child.id})`);
  });
  console.log('');
  
  console.log(`📈 Total direct children of Thing: ${hierarchy.children.length}`);
}

testThingHierarchy().catch(console.error);
