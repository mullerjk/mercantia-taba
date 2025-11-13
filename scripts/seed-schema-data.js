#!/usr/bin/env node

/**
 * Script to seed Supabase database with Schema.org data
 * Run with: node scripts/seed-schema-data.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Schema.org core entities data
const schemaEntities = [
  {
    id: 'thing-001',
    name: 'Thing',
    description: 'The most generic type of item.',
    schema_type: 'schema:Thing',
    parent_types: [],
    is_abstract: true,
    properties: {
      name: 'Text',
      description: 'Text',
      url: 'URL',
      image: 'URL',
      sameAs: 'URL'
    }
  },
  {
    id: 'action-001',
    name: 'Action',
    description: 'An action performed by a direct agent and indirect participants upon a direct object.',
    schema_type: 'schema:Action',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      agent: 'Person|Organization',
      object: 'Thing',
      result: 'Thing',
      startTime: 'DateTime',
      endTime: 'DateTime'
    }
  },
  {
    id: 'creative-work-001',
    name: 'CreativeWork',
    description: 'The most generic kind of creative work, including books, movies, photographs, software programs, etc.',
    schema_type: 'schema:CreativeWork',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      author: 'Person|Organization',
      creator: 'Person|Organization',
      dateCreated: 'Date',
      datePublished: 'Date',
      headline: 'Text',
      keywords: 'Text',
      license: 'URL|CreativeWork',
      publisher: 'Person|Organization'
    }
  },
  {
    id: 'person-001',
    name: 'Person',
    description: 'A person (alive, dead, undead, or fictional).',
    schema_type: 'schema:Person',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      givenName: 'Text',
      familyName: 'Text',
      email: 'Text',
      telephone: 'Text',
      address: 'PostalAddress',
      birthDate: 'Date',
      gender: 'Text',
      jobTitle: 'Text',
      worksFor: 'Organization'
    }
  },
  {
    id: 'organization-001',
    name: 'Organization',
    description: 'An organization such as a school, NGO, corporation, club, etc.',
    schema_type: 'schema:Organization',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      name: 'Text',
      description: 'Text',
      url: 'URL',
      logo: 'URL|ImageObject',
      foundingDate: 'Date',
      address: 'PostalAddress',
      contactPoint: 'ContactPoint',
      employee: 'Person',
      founder: 'Person'
    }
  },
  {
    id: 'place-001',
    name: 'Place',
    description: 'Entities that have a somewhat fixed, physical extension.',
    schema_type: 'schema:Place',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      name: 'Text',
      description: 'Text',
      address: 'PostalAddress|Text',
      geo: 'GeoCoordinates|GeoShape',
      telephone: 'Text',
      faxNumber: 'Text',
      openingHours: 'Text'
    }
  },
  {
    id: 'product-001',
    name: 'Product',
    description: 'Any offered product or service.',
    schema_type: 'schema:Product',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      name: 'Text',
      description: 'Text',
      brand: 'Brand|Organization',
      category: 'Text|Thing',
      color: 'Text',
      manufacturer: 'Organization',
      model: 'Text',
      offers: 'Offer',
      productID: 'Text'
    }
  },
  {
    id: 'event-001',
    name: 'Event',
    description: 'An event happening at a certain time and location.',
    schema_type: 'schema:Event',
    parent_types: ['schema:Thing'],
    is_abstract: false,
    properties: {
      name: 'Text',
      description: 'Text',
      startDate: 'Date|DateTime',
      endDate: 'Date|DateTime',
      location: 'Place|PostalAddress|Text',
      organizer: 'Person|Organization',
      performer: 'Person|Organization',
      eventStatus: 'EventStatusType',
      eventAttendanceMode: 'EventAttendanceModeEnumeration'
    }
  }
];

// Marketplace sample data
const marketplaceItems = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    type: 'product',
    price: 199.99,
    rating: 4.5,
    category: 'Electronics',
    schema_type: 'schema:Product'
  },
  {
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans sourced from sustainable farms in Colombia.',
    type: 'product',
    price: 24.99,
    rating: 4.8,
    category: 'Food & Beverage',
    schema_type: 'schema:Product'
  },
  {
    name: 'TechCorp Solutions',
    description: 'Leading technology company specializing in AI and machine learning solutions.',
    type: 'organization',
    rating: 4.2,
    location: 'San Francisco, CA',
    category: 'Technology',
    schema_type: 'schema:Organization'
  },
  {
    name: 'Central Park',
    description: 'Beautiful urban park offering recreational activities and green spaces.',
    type: 'place',
    location: 'New York, NY',
    category: 'Recreation',
    schema_type: 'schema:Place'
  },
  {
    name: 'Smartphone Pro Max',
    description: 'Latest smartphone with advanced camera system and all-day battery life.',
    type: 'product',
    price: 999.99,
    rating: 4.7,
    category: 'Electronics',
    schema_type: 'schema:Product'
  },
  {
    name: 'GreenLeaf Restaurant',
    description: 'Farm-to-table restaurant serving organic and locally sourced ingredients.',
    type: 'organization',
    rating: 4.6,
    location: 'Portland, OR',
    category: 'Food Service',
    schema_type: 'schema:Organization'
  },
  {
    name: 'Mountain View Resort',
    description: 'Luxury mountain resort with spa, hiking trails, and fine dining.',
    type: 'place',
    location: 'Aspen, CO',
    category: 'Hospitality',
    schema_type: 'schema:Place'
  },
  {
    name: 'Designer Leather Jacket',
    description: 'Premium leather jacket crafted from genuine Italian leather.',
    type: 'product',
    price: 349.99,
    rating: 4.3,
    category: 'Fashion',
    schema_type: 'schema:Product'
  },
  {
    name: 'Global Finance Corp',
    description: 'International financial services company providing banking and investment solutions.',
    type: 'organization',
    rating: 4.1,
    location: 'London, UK',
    category: 'Finance',
    schema_type: 'schema:Organization'
  }
];

// Timeline events
const timelineEvents = [
  {
    title: 'New Product Entity',
    description: 'Added comprehensive product schema with enhanced properties for e-commerce.',
    emoji: '📦',
    category: 'Product',
    schema_type: 'schema:Product',
    version: 'v1.0.0',
    event_type: 'new_entity'
  },
  {
    title: 'Organization Updates',
    description: 'Enhanced organization schema with better address and contact information.',
    emoji: '🏢',
    category: 'Organization',
    schema_type: 'schema:Organization',
    version: 'v1.1.0',
    event_type: 'update'
  },
  {
    title: 'Place Schema Improvements',
    description: 'Added geographic coordinates and accessibility features to place entities.',
    emoji: '📍',
    category: 'Place',
    schema_type: 'schema:Place',
    version: 'v1.2.0',
    event_type: 'update'
  },
  {
    title: 'Creative Work Expansion',
    description: 'Extended creative work types with better metadata support.',
    emoji: '🎨',
    category: 'CreativeWork',
    schema_type: 'schema:CreativeWork',
    version: 'v1.3.0',
    event_type: 'update'
  },
  {
    title: 'Event Schema Enhancement',
    description: 'Improved event schema with better temporal and location properties.',
    emoji: '📅',
    category: 'Event',
    schema_type: 'schema:Event',
    version: 'v1.4.0',
    event_type: 'update'
  },
  {
    title: 'Person Data Privacy',
    description: 'Added privacy controls and data protection features to person schema.',
    emoji: '👤',
    category: 'Person',
    schema_type: 'schema:Person',
    version: 'v1.5.0',
    event_type: 'update'
  },
  {
    title: 'Action Schema Refinement',
    description: 'Refined action schema with better semantic relationships.',
    emoji: '⚡',
    category: 'Action',
    schema_type: 'schema:Action',
    version: 'v1.6.0',
    event_type: 'update'
  },
  {
    title: 'Medical Entity Addition',
    description: 'New medical entity schemas for healthcare applications.',
    emoji: '🏥',
    category: 'MedicalEntity',
    schema_type: 'schema:MedicalEntity',
    version: 'v1.7.0',
    event_type: 'new_entity'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert schema entities
    console.log('📝 Inserting schema entities...');
    const { data: entitiesData, error: entitiesError } = await supabase
      .from('schema_entities')
      .upsert(schemaEntities, { onConflict: 'id' });

    if (entitiesError) {
      console.error('Error inserting schema entities:', entitiesError);
    } else {
      console.log(`✅ Inserted ${entitiesData?.length || 0} schema entities`);
    }

    // Insert schema relationships
    console.log('🔗 Inserting schema relationships...');
    const relationships = [];
    const thingEntity = schemaEntities.find(e => e.schema_type === 'schema:Thing');

    if (thingEntity) {
      for (const entity of schemaEntities.filter(e => e.schema_type !== 'schema:Thing')) {
        relationships.push({
          parent_entity_id: thingEntity.id,
          child_entity_id: entity.id,
          relationship_type: 'subclass'
        });
      }
    }

    if (relationships.length > 0) {
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('schema_relationships')
        .upsert(relationships, { onConflict: 'id' });

      if (relationshipsError) {
        console.error('Error inserting schema relationships:', relationshipsError);
      } else {
        console.log(`✅ Inserted ${relationshipsData?.length || 0} schema relationships`);
      }
    }

    // Insert marketplace items
    console.log('🛒 Inserting marketplace items...');
    const { data: marketplaceData, error: marketplaceError } = await supabase
      .from('marketplace_items')
      .upsert(marketplaceItems, { onConflict: 'id' });

    if (marketplaceError) {
      console.error('Error inserting marketplace items:', marketplaceError);
    } else {
      console.log(`✅ Inserted ${marketplaceData?.length || 0} marketplace items`);
    }

    // Insert timeline events
    console.log('📅 Inserting timeline events...');
    const { data: timelineData, error: timelineError } = await supabase
      .from('timeline_events')
      .upsert(timelineEvents, { onConflict: 'id' });

    if (timelineError) {
      console.error('Error inserting timeline events:', timelineError);
    } else {
      console.log(`✅ Inserted ${timelineData?.length || 0} timeline events`);
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding script
seedDatabase();
