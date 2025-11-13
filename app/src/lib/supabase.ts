// Supabase client configuration for browser (client-side only)
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQw54bKJhHZXw6WYtS5A8'

// Create Supabase client for browser (client-side)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Legacy client for backward compatibility (will be removed)
export const supabase = createClient()

// Database types
export interface Database {
  public: {
    Tables: {
      schema_entities: {
        Row: {
          id: string
          name: string
          description: string | null
          schema_type: string
          parent_types: string[] | null
          properties: Record<string, any> | null
          is_abstract: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          schema_type: string
          parent_types?: string[] | null
          properties?: Record<string, any> | null
          is_abstract?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          schema_type?: string
          parent_types?: string[] | null
          properties?: Record<string, any> | null
          is_abstract?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      schema_relationships: {
        Row: {
          id: string
          parent_entity_id: string
          child_entity_id: string
          relationship_type: 'subclass' | 'property' | 'reference'
          created_at: string
        }
        Insert: {
          id?: string
          parent_entity_id: string
          child_entity_id: string
          relationship_type: 'subclass' | 'property' | 'reference'
          created_at?: string
        }
        Update: {
          id?: string
          parent_entity_id?: string
          child_entity_id?: string
          relationship_type?: 'subclass' | 'property' | 'reference'
          created_at?: string
        }
      }
      marketplace_items: {
        Row: {
          id: string
          name: string
          description: string
          type: 'product' | 'organization' | 'place'
          price: number | null
          rating: number | null
          location: string | null
          category: string
          schema_type: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: 'product' | 'organization' | 'place'
          price?: number | null
          rating?: number | null
          location?: string | null
          category: string
          schema_type: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: 'product' | 'organization' | 'place'
          price?: number | null
          rating?: number | null
          location?: string | null
          category?: string
          schema_type?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      timeline_events: {
        Row: {
          id: string
          title: string
          description: string
          emoji: string
          category: string
          schema_type: string
          version: string | null
          event_type: 'new_entity' | 'update' | 'deprecation'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          emoji: string
          category: string
          schema_type: string
          version?: string | null
          event_type?: 'new_entity' | 'update' | 'deprecation'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          emoji?: string
          category?: string
          schema_type?: string
          version?: string | null
          event_type?: 'new_entity' | 'update' | 'deprecation'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
