# Supabase Integration for Mercantia

Este documento explica como configurar e usar o Supabase para gerenciar dados Schema.org no projeto Mercantia.

## 📋 Visão Geral

O Supabase foi integrado para fornecer:
- **Banco de dados PostgreSQL** para armazenar entidades Schema.org
- **APIs REST** para acessar dados
- **Row Level Security (RLS)** para controle de acesso
- **Real-time subscriptions** para updates automáticos

## 🏗️ Estrutura do Banco

### Tabelas Principais

#### `schema_entities`
Armazena todas as entidades Schema.org com suas propriedades.

```sql
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
```

#### `schema_relationships`
Gerencia relacionamentos entre entidades (subclasses, propriedades, referências).

```sql
CREATE TABLE schema_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_entity_id UUID REFERENCES schema_entities(id) ON DELETE CASCADE,
  child_entity_id UUID REFERENCES schema_entities(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('subclass', 'property', 'reference')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `marketplace_items`
Itens do marketplace categorizados por tipos Schema.org.

```sql
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
```

#### `timeline_events`
Eventos da timeline Schema.org (novas entidades, updates, depreciações).

```sql
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
```

## 🚀 Configuração

### 1. Instalar Supabase CLI

```bash
npm install -g supabase
```

### 2. Inicializar Supabase (se não existir)

```bash
supabase init
```

### 3. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQw54bKJhHZXw6WYtS5A8
```

### 4. Iniciar Supabase Local

```bash
supabase start
```

### 5. Aplicar Migrações

```bash
supabase db reset
```

### 6. Popular Dados Iniciais

```bash
node scripts/seed-schema-data.js
```

## 📡 APIs Disponíveis

### Marketplace API

**GET /api/marketplace**
- Busca itens do marketplace
- Parâmetros: `search`, `category`, `type`

```javascript
// Buscar todos os produtos
fetch('/api/marketplace?type=product')

// Buscar por categoria Schema.org
fetch('/api/marketplace?category=schema:Product')

// Buscar com texto
fetch('/api/marketplace?search=headphones')
```

**POST /api/marketplace**
- Criar novo item no marketplace

```javascript
fetch('/api/marketplace', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "New Product",
    description: "Description",
    type: "product",
    category: "Electronics",
    schema_type: "schema:Product"
  })
})
```

### Schema Hierarchy API

**GET /api/schema-hierarchy**
- Retorna hierarquia completa de entidades Schema.org

## 🔧 Desenvolvimento

### Cliente Supabase

```typescript
import { supabase } from '@/lib/supabase'

// Buscar entidades
const { data, error } = await supabase
  .from('schema_entities')
  .select('*')
  .eq('schema_type', 'schema:Product')

// Inserir item no marketplace
const { data, error } = await supabase
  .from('marketplace_items')
  .insert([{
    name: 'New Item',
    description: 'Description',
    type: 'product',
    schema_type: 'schema:Product'
  }])
```

### Tipos TypeScript

```typescript
import { Database } from '@/lib/supabase'

type SchemaEntity = Database['public']['Tables']['schema_entities']['Row']
type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row']
```

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:
- **Autenticados**: Podem ler dados
- **Service Role**: Pode fazer todas as operações (usado para seeding)

### Políticas de Acesso

```sql
-- Leitura para usuários autenticados
CREATE POLICY "Allow read access for authenticated users" ON schema_entities
FOR SELECT USING (auth.role() = 'authenticated');

-- Todas as operações para service role
CREATE POLICY "Allow all operations for service role" ON schema_entities
FOR ALL USING (auth.role() = 'service_role');
```

## 📊 Monitoramento

### Logs de Desenvolvimento

```bash
# Ver logs do Supabase
supabase logs

# Ver status dos serviços
supabase status
```

### Dashboard Supabase

Acesse `http://localhost:54323` para o dashboard local do Supabase.

## 🚀 Deploy

### Para Produção

1. Criar projeto no Supabase (supabase.com)
2. Atualizar variáveis de ambiente
3. Executar migrações no banco remoto
4. Popular dados iniciais

### Comandos Úteis

```bash
# Parar serviços locais
supabase stop

# Resetar banco local
supabase db reset

# Push para produção
supabase db push

# Pull da produção
supabase db pull
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão**: Verificar se Supabase está rodando (`supabase status`)
2. **Tabelas não existem**: Executar `supabase db reset`
3. **Dados não aparecem**: Verificar se seeding foi executado
4. **Permissões**: Verificar políticas RLS

### Debug

```bash
# Verificar conexão
curl http://localhost:54321/rest/v1/

# Verificar tabelas
supabase db inspect
```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Schema.org Vocabulary](https://schema.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Nota**: Este setup está configurado para desenvolvimento local. Para produção, ajuste as variáveis de ambiente e políticas de segurança conforme necessário.
