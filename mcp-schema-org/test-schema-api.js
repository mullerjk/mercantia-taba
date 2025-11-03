#!/usr/bin/env node

// Simple test script to debug Schema.org API data loading
// Run with: node test-schema-api.js

const axios = require('axios');

async function testSchemaOrgAPI() {
  console.log('🧪 Testing Schema.org API data loading...\n');

  try {
    const SCHEMA_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld';
    console.log(`📡 Fetching from: ${SCHEMA_URL}`);
    
    const response = await axios.get(SCHEMA_URL);
    const data = response.data;

    console.log(`✅ API Response received`);
    console.log(`📊 Data structure:`, Object.keys(data));

    if (data['@graph']) {
      console.log(`📋 @graph contains ${data['@graph'].length} items\n`);

      // Analyze the data structure
      let totalItems = 0;
      let classItems = 0;
      let propertyItems = 0;
      let itemsWithSubClassOf = 0;
      
      // Look for specific types
      const actionTypes = [];
      const eventTypes = [];
      const thingTypes = [];

      for (const item of data['@graph']) {
        totalItems++;
        
        if (item['@type'] && item['@type'].includes('rdfs:Class')) {
          classItems++;
          
          if (item['rdfs:subClassOf']) {
            itemsWithSubClassOf++;
          }
          
          // Track specific types
          const label = item['rdfs:label'];
          if (label) {
            if (label.includes('Action')) {
              actionTypes.push({
                label,
                id: item['@id'],
                superClasses: Array.isArray(item['rdfs:subClassOf']) ? item['rdfs:subClassOf'] : [item['rdfs:subClassOf']].filter(Boolean)
              });
            }
            if (label.includes('Event')) {
              eventTypes.push({
                label,
                id: item['@id'],
                superClasses: Array.isArray(item['rdfs:subClassOf']) ? item['rdfs:subClassOf'] : [item['rdfs:subClassOf']].filter(Boolean)
              });
            }
            if (label === 'Thing' || label.includes('Thing')) {
              thingTypes.push({
                label,
                id: item['@id'],
                superClasses: Array.isArray(item['rdfs:subClassOf']) ? item['rdfs:subClassOf'] : [item['rdfs:subClassOf']].filter(Boolean)
              });
            }
          }
        } else if (item['@type'] && item['@type'].includes('rdf:Property')) {
          propertyItems++;
        }
      }

      console.log('📈 Data Analysis:');
      console.log(`   Total items: ${totalItems}`);
      console.log(`   Class items (rdfs:Class): ${classItems}`);
      console.log(`   Property items (rdf:Property): ${propertyItems}`);
      console.log(`   Items with subClassOf: ${itemsWithSubClassOf}`);
      console.log(`   Action-related types: ${actionTypes.length}`);
      console.log(`   Event-related types: ${eventTypes.length}`);
      console.log(`   Thing-related types: ${thingTypes.length}\n`);

      console.log('🔍 Sample Action Types (first 10):');
      actionTypes.slice(0, 10).forEach((type, i) => {
        console.log(`   ${i + 1}. ${type.label} (${type.id})`);
        console.log(`      SuperClasses:`, type.superClasses.map(sc => sc['@id']).join(', '));
      });

      console.log('\n🔍 Sample Event Types (first 10):');
      eventTypes.slice(0, 10).forEach((type, i) => {
        console.log(`   ${i + 1}. ${type.label} (${type.id})`);
        console.log(`      SuperClasses:`, type.superClasses.map(sc => sc['@id']).join(', '));
      });

      // Test the relationships for Action
      console.log('\n🎯 Testing Action Hierarchy Relationships:');
      const actionSchemaId = 'schema:Action';
      let actionSubTypes = 0;
      
      for (const item of data['@graph']) {
        if (item['@type'] && item['@type'].includes('rdfs:Class') && item['rdfs:subClassOf']) {
          const superClasses = Array.isArray(item['rdfs:subClassOf']) ? item['rdfs:subClassOf'] : [item['rdfs:subClassOf']];
          const hasActionParent = superClasses.some(sc => sc['@id'] === actionSchemaId);
          
          if (hasActionParent) {
            actionSubTypes++;
            console.log(`   ✅ ${item['rdfs:label']} extends Action`);
          }
        }
      }
      
      console.log(`\n📊 Total Action subtypes found: ${actionSubTypes}`);

    } else {
      console.log('❌ No @graph found in response');
    }

  } catch (error) {
    console.error('❌ Error testing Schema.org API:', error.message);
  }
}

// Run the test
testSchemaOrgAPI().catch(console.error);
