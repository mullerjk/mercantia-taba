-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema entities table
CREATE TABLE schema_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  schema_type TEXT NOT NULL,
  parent_types TEXT[] DEFAULT '{}',
  properties JSONB DEFAULT '{}',
  is_abstract BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema relationships table
CREATE TABLE schema_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_entity_id UUID REFERENCES schema_entities(id) ON DELETE CASCADE,
  child_entity_id UUID REFERENCES schema_entities(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('subclass', 'property', 'reference')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace items table
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('product', 'organization', 'place')),
  price DECIMAL(10,2),
  rating DECIMAL(3,2),
  location TEXT,
  category TEXT NOT NULL,
  schema_type TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline events table
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  category TEXT NOT NULL,
  schema_type TEXT NOT NULL,
  version TEXT,
  event_type TEXT CHECK (event_type IN ('new_entity', 'update', 'deprecation')) DEFAULT 'new_entity',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_schema_entities_schema_type ON schema_entities(schema_type);
CREATE INDEX idx_schema_entities_name ON schema_entities(name);
CREATE INDEX idx_schema_relationships_parent ON schema_relationships(parent_entity_id);
CREATE INDEX idx_schema_relationships_child ON schema_relationships(child_entity_id);
CREATE INDEX idx_marketplace_items_type ON marketplace_items(type);
CREATE INDEX idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX idx_marketplace_items_schema_type ON marketplace_items(schema_type);
CREATE INDEX idx_timeline_events_schema_type ON timeline_events(schema_type);
CREATE INDEX idx_timeline_events_created_at ON timeline_events(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_schema_entities_updated_at BEFORE UPDATE ON schema_entities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE schema_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Allow read access for all authenticated users
CREATE POLICY "Allow read access for authenticated users" ON schema_entities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON schema_relationships FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON marketplace_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON timeline_events FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all operations for service role (for data seeding)
CREATE POLICY "Allow all operations for service role" ON schema_entities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all operations for service role" ON schema_relationships FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all operations for service role" ON marketplace_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all operations for service role" ON timeline_events FOR ALL USING (auth.role() = 'service_role');
