-- Seed data for Schema.org entities
-- This file contains sample data for development and testing

-- Insert basic Schema.org entities
INSERT INTO schema_entities (id, name, description, schema_type, parent_types, is_abstract) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Thing', 'The most generic type of item.', 'schema:Thing', '{}', true),
  ('550e8400-e29b-41d4-a716-446655440001', 'Action', 'An action performed by a direct agent and indirect participants upon a direct object.', 'schema:Action', '{schema:Thing}', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'CreativeWork', 'The most generic kind of creative work, including books, movies, photographs, software programs, etc.', 'schema:CreativeWork', '{schema:Thing}', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'Person', 'A person (alive, dead, undead, or fictional).', 'schema:Person', '{schema:Thing}', false),
  ('550e8400-e29b-41d4-a716-446655440004', 'Organization', 'An organization such as a school, NGO, corporation, club, etc.', 'schema:Organization', '{schema:Thing}', false),
  ('550e8400-e29b-41d4-a716-446655440005', 'Place', 'Entities that have a somewhat fixed, physical extension.', 'schema:Place', '{schema:Thing}', false),
  ('550e8400-e29b-41d4-a716-446655440006', 'Product', 'Any offered product or service.', 'schema:Product', '{schema:Thing}', false),
  ('550e8400-e29b-41d4-a716-446655440007', 'Event', 'An event happening at a certain time and location.', 'schema:Event', '{schema:Thing}', false);

-- Insert schema relationships
INSERT INTO schema_relationships (parent_entity_id, child_entity_id, relationship_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'subclass'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'subclass'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'subclass'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 'subclass'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'subclass'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'subclass'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440007', 'subclass');

-- Insert marketplace items
INSERT INTO marketplace_items (name, description, type, price, rating, location, category, schema_type) VALUES
  ('Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation and 30-hour battery life.', 'product', 199.99, 4.5, null, 'Electronics', 'schema:Product'),
  ('Organic Coffee Beans', 'Premium organic coffee beans sourced from sustainable farms in Colombia.', 'product', 24.99, 4.8, null, 'Food & Beverage', 'schema:Product'),
  ('TechCorp Solutions', 'Leading technology company specializing in AI and machine learning solutions.', 'organization', null, 4.2, 'San Francisco, CA', 'Technology', 'schema:Organization'),
  ('Central Park', 'Beautiful urban park offering recreational activities and green spaces.', 'place', null, null, 'New York, NY', 'Recreation', 'schema:Place'),
  ('Smartphone Pro Max', 'Latest smartphone with advanced camera system and all-day battery life.', 'product', 999.99, 4.7, null, 'Electronics', 'schema:Product'),
  ('GreenLeaf Restaurant', 'Farm-to-table restaurant serving organic and locally sourced ingredients.', 'organization', null, 4.6, 'Portland, OR', 'Food Service', 'schema:Organization'),
  ('Mountain View Resort', 'Luxury mountain resort with spa, hiking trails, and fine dining.', 'place', null, null, 'Aspen, CO', 'Hospitality', 'schema:Place'),
  ('Designer Leather Jacket', 'Premium leather jacket crafted from genuine Italian leather.', 'product', 349.99, 4.3, null, 'Fashion', 'schema:Product'),
  ('Global Finance Corp', 'International financial services company providing banking and investment solutions.', 'organization', null, 4.1, 'London, UK', 'Finance', 'schema:Organization');

-- Insert timeline events
INSERT INTO timeline_events (title, description, emoji, category, schema_type, version, event_type) VALUES
  ('New Product Entity', 'Added comprehensive product schema with enhanced properties for e-commerce.', '📦', 'Product', 'schema:Product', 'v1.0.0', 'new_entity'),
  ('Organization Updates', 'Enhanced organization schema with better address and contact information.', '🏢', 'Organization', 'schema:Organization', 'v1.1.0', 'update'),
  ('Place Schema Improvements', 'Added geographic coordinates and accessibility features to place entities.', '📍', 'Place', 'schema:Place', 'v1.2.0', 'update'),
  ('Creative Work Expansion', 'Extended creative work types with better metadata support.', '🎨', 'CreativeWork', 'schema:CreativeWork', 'v1.3.0', 'update'),
  ('Event Schema Enhancement', 'Improved event schema with better temporal and location properties.', '📅', 'Event', 'schema:Event', 'v1.4.0', 'update'),
  ('Person Data Privacy', 'Added privacy controls and data protection features to person schema.', '👤', 'Person', 'schema:Person', 'v1.5.0', 'update'),
  ('Action Schema Refinement', 'Refined action schema with better semantic relationships.', '⚡', 'Action', 'schema:Action', 'v1.6.0', 'update'),
  ('Medical Entity Addition', 'New medical entity schemas for healthcare applications.', '🏥', 'MedicalEntity', 'schema:MedicalEntity', 'v1.7.0', 'new_entity');
