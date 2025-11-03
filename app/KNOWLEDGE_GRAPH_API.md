# 🌐 Knowledge Graph API - Documentação Completa

## ✅ Sprint 1 & 2 Implementados!

Sistema completo de Knowledge Graph com banco de dados persistente, API RESTful e gerador de mocks inteligente.

---

## 📊 Banco de Dados Atual

**Servidor:** Railway PostgreSQL (Mercantia Production)  
**Status:** ✅ 1000+ entidades populadas

### Estatísticas Atuais:
```
CreativeWork: 46
Event: 69
LocalBusiness: 115
Organization: 116
Person: 346
Place: 92
Product: 231
Restaurant: 57
Review: 23
Store: 57
```

---

## 🚀 API Endpoints

### Entities API

#### `GET /api/entities`
Lista entidades com filtros e paginação.

**Query Parameters:**
- `type` (optional): Filtrar por tipo Schema.org
- `limit` (optional, default: 50, max: 100): Limite de resultados
- `offset` (optional, default: 0): Offset para paginação

**Exemplos:**
```bash
# Listar todas as pessoas
curl 'http://localhost:3000/api/entities?type=Person&limit=10'

# Listar produtos
curl 'http://localhost:3000/api/entities?type=Product&limit=20'

# Paginação
curl 'http://localhost:3000/api/entities?limit=50&offset=100'
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "Person",
      "properties": {
        "name": "João Silva",
        "email": "joao@example.com",
        ...
      },
      "trustScore": 90,
      "createdAt": "2025-11-03T10:00:00Z"
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "count": 10
  }
}
```

#### `POST /api/entities`
Cria nova entidade.

**Body:**
```json
{
  "type": "Person",
  "properties": {
    "name": "Maria Santos",
    "email": "maria@mercantia.app",
    "birthDate": "1995-03-20"
  },
  "trustScore": 85
}
```

**Response:** `201 Created`
```json
{
  "id": "new-uuid",
  "type": "Person",
  "properties": { ... },
  "trustScore": 85,
  "createdAt": "2025-11-03T10:30:00Z"
}
```

#### `GET /api/entities/[id]`
Busca entidade específica com todas as relações.

**Response:**
```json
{
  "entity": { ... },
  "verifications": [ ... ],
  "relations": {
    "asAgent": [ ... ],  // Ações feitas por esta entidade
    "asObject": [ ... ]  // Ações feitas PARA esta entidade
  }
}
```

#### `PATCH /api/entities/[id]`
Atualiza entidade.

**Body:**
```json
{
  "trustScore": 95,
  "properties": {
    "name": "Maria Santos Jr."
  }
}
```

#### `DELETE /api/entities/[id]`
Deleta entidade (cascade para relations).

---

### Relations API

#### `GET /api/relations`
Lista relações (edges do grafo) com filtros.

**Query Parameters:**
- `type` (optional): Tipo da ação (ConsumeAction, BuyAction, etc)
- `agentId` (optional): UUID do agente (quem fez)
- `objectId` (optional): UUID do objeto (o que foi feito)
- `entityId` (optional): UUID de entidade (retorna como agent OU object)
- `limit` / `offset`: Paginação

**Exemplos:**
```bash
# Todas as ações de consumo
curl 'http://localhost:3000/api/relations?type=ConsumeAction'

# Ações de uma pessoa específica
curl 'http://localhost:3000/api/relations?agentId=<person-uuid>'

# Produtos consumidos
curl 'http://localhost:3000/api/relations?objectId=<product-uuid>'

# Todas as relações de uma entidade
curl 'http://localhost:3000/api/relations?entityId=<uuid>'
```

**Response:**
```json
{
  "data": [
    {
      "id": "relation-uuid",
      "type": "ConsumeAction",
      "agentId": "person-uuid",
      "objectId": "product-uuid",
      "startTime": "2025-11-03T10:00:00Z",
      "context": {
        "quantity": 2,
        "satisfaction": "excellent"
      },
      "trustScore": 95,
      "agent": { /* full Person entity */ },
      "object": { /* full Product entity */ },
      "location": null
    }
  ],
  "meta": { ... }
}
```

#### `POST /api/relations`
Cria nova relação (Action).

**Body:**
```json
{
  "type": "ConsumeAction",
  "agentId": "person-uuid",
  "objectId": "product-uuid",
  "locationId": "place-uuid",  // optional
  "startTime": "2025-11-03T10:00:00Z",  // optional
  "endTime": "2025-11-03T11:00:00Z",  // optional
  "context": {
    "quantity": 1,
    "paymentMethod": "credit_card"
  },
  "trustScore": 90
}
```

**Validações:**
- Verifica se `agentId` existe
- Verifica se `objectId` existe
- Verifica se `locationId` existe (se fornecido)

**Response:** `201 Created` com agent e object expandidos

#### `GET /api/relations/[id]`
Busca relação específica com proofs e witnesses.

**Response:**
```json
{
  "relation": { ... },
  "agent": { ... },
  "object": { ... },
  "location": { ... },
  "proofs": [ ... ],
  "witnesses": [ ... ]
}
```

#### `PATCH /api/relations/[id]`
Atualiza relação.

#### `DELETE /api/relations/[id]`
Deleta relação.

---

## 🎲 Mock Generator

### Uso Programático

```typescript
import { mockGenerator } from '@/lib/mock-generator'

// Gerar uma pessoa
const person = mockGenerator.generateEntity('Person')

// Gerar 10 produtos
const products = mockGenerator.generateEntities('Product', 10)

// Gerar mix diversificado
const entities = mockGenerator.generateMixedBatch(100)
```

### Tipos Suportados

- **Person**: Nome, email, telefone, endereço, data nascimento, etc
- **Organization**: Nome legal, CNPJ, fundação, funcionários
- **Product**: Nome, SKU, GTIN, preço, peso, categoria
- **Place**: Endereço, coordenadas geográficas
- **Event**: Datas, localização, organizador
- **LocalBusiness**: Horários, pagamento, avaliação
- **Restaurant**: Culinária, menu, reservas
- **Store**: Moedas aceitas, métodos pagamento
- **Review**: Corpo, rating, autor
- **CreativeWork**: Autor, data publicação

### Contexto Brasileiro

```typescript
const context = mockGenerator.generateBrazilianContext()
// {
//   cpf: "12345678901",
//   cnpj: "12345678000190",
//   cep: "12345-678",
//   state: "SP",
//   city: "São Paulo",
//   phone: "(11) 91234-5678"
// }
```

---

## 🌱 Database Seeding

### Seed Padrão (1000 entidades)

```bash
npm run db:seed
```

### Seed Customizado

```bash
# 100 entidades
npm run db:seed 100

# 5000 entidades
npm run db:seed 5000
```

### Distribuição Padrão

```javascript
{
  Person: 300,          // 30%
  Product: 200,         // 20%
  Organization: 100,    // 10%
  LocalBusiness: 100,   // 10%
  Place: 80,            // 8%
  Event: 60,            // 6%
  Restaurant: 50,       // 5%
  Store: 50,            // 5%
  CreativeWork: 40,     // 4%
  Review: 20            // 2%
}
```

### Performance

- **Rate:** ~147 entidades/segundo
- **Batch size:** 100 entidades por insert
- **1000 entidades:** ~6.8 segundos
- **5000 entidades:** ~34 segundos (estimado)

---

## 📚 Schema do Banco

### Tabela `entities`
```sql
id            UUID PRIMARY KEY
type          VARCHAR(100)      -- Schema.org type
properties    JSONB             -- Todas as propriedades
created_at    TIMESTAMP
created_by    UUID
updated_at    TIMESTAMP
trust_score   INTEGER (0-100)
```

**Índices:**
- `idx_entities_type` em `type`
- `idx_entities_created_at` em `created_at`

### Tabela `relations`
```sql
id            UUID PRIMARY KEY
type          VARCHAR(100)      -- Schema.org Action
agent_id      UUID → entities   -- Quem fez
object_id     UUID → entities   -- O que foi feito
location_id   UUID → entities   -- Onde (opcional)
start_time    TIMESTAMP
end_time      TIMESTAMP
context       JSONB
created_at    TIMESTAMP
trust_score   INTEGER (0-100)
```

**Índices:**
- `idx_relations_agent` em `agent_id`
- `idx_relations_object` em `object_id`
- `idx_relations_type` em `type`
- `idx_relations_start_time` em `start_time`

### Tabela `verifications`
```sql
id            UUID PRIMARY KEY
entity_id     UUID → entities
method        VARCHAR(100)      -- "government_id", "email", etc
verified_by   VARCHAR(255)
timestamp     TIMESTAMP
expires_at    TIMESTAMP
proof         JSONB
```

### Tabela `proofs`
```sql
id            UUID PRIMARY KEY
relation_id   UUID → relations
type          VARCHAR(50)       -- "photo", "receipt", "blockchain"
url           TEXT              -- IPFS, Arweave, S3
hash          VARCHAR(255)      -- SHA-256
verified_by   VARCHAR(255)
metadata      JSONB
```

### Tabela `witnesses`
```sql
id            UUID PRIMARY KEY
relation_id   UUID → relations
entity_id     UUID → entities   -- Quem testemunhou
timestamp     TIMESTAMP
```

---

## 🔧 Utilitários

### Drizzle Studio (UI Visual)

```bash
npm run db:studio
```

Abre interface web para explorar/editar dados: `https://local.drizzle.studio`

### Migrations

```bash
# Gerar SQL de migrations
npm run db:generate

# Aplicar migrations
npm run db:push

# Rodar migrations (production)
npm run db:migrate
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Criar Person e Product, depois ConsumeAction

```bash
# 1. Criar pessoa
PERSON_ID=$(curl -s -X POST http://localhost:3000/api/entities \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "Person",
    "properties": {
      "name": "Ana Silva",
      "email": "ana@example.com"
    },
    "trustScore": 90
  }' | jq -r '.id')

# 2. Criar produto
PRODUCT_ID=$(curl -s -X POST http://localhost:3000/api/entities \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "Product",
    "properties": {
      "name": "Café Orgânico",
      "price": 29.90
    },
    "trustScore": 95
  }' | jq -r '.id')

# 3. Criar ação de consumo
curl -X POST http://localhost:3000/api/relations \
  -H 'Content-Type: application/json' \
  -d "{
    \"type\": \"ConsumeAction\",
    \"agentId\": \"$PERSON_ID\",
    \"objectId\": \"$PRODUCT_ID\",
    \"startTime\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"context\": {
      \"rating\": 5,
      \"comment\": \"Excelente café!\"
    },
    \"trustScore\": 92
  }"
```

### Exemplo 2: Query Graph Traversal

```bash
# Buscar pessoa
PERSON_ID="uuid-da-pessoa"

# Ver todas as ações da pessoa
curl "http://localhost:3000/api/relations?agentId=$PERSON_ID"

# Ver dados completos com relações
curl "http://localhost:3000/api/entities/$PERSON_ID"
```

---

## 🎯 Próximos Passos

### Sprint 3 (Recomendado):
1. **GraphQL API** (Apollo Server)
   - Queries otimizadas para grafos
   - Subscriptions em tempo real
   
2. **Sistema de Permissões**
   - Row-Level Security (RLS)
   - API Keys por usuário
   
3. **Seed de Relations**
   - Gerar automaticamente ConsumeAction
   - BuyAction, ReviewAction, etc
   
4. **Full-text Search**
   - PostgreSQL tsvector
   - Ou ElasticSearch integration

### Sprint 4 (Avançado):
1. **Blockchain Proofs**
   - IPFS para evidências
   - Smart contracts para verificações
   
2. **Analytics Dashboard**
   - Métricas de trustScore
   - Visualização de grafos
   
3. **Real-time Updates**
   - WebSockets
   - Server-Sent Events

---

## 🐛 Troubleshooting

**Erro: "DATABASE_URL not found"**
→ Verifique `.env.local`

**Erro: "Failed to connect"**
→ Verifique se a connection string está correta

**Seed lento**
→ Ajuste batch size ou use connection pooling

**Port 3000 em uso**
→ Next.js automaticamente usa 3001

---

## 📊 Performance

### API Benchmarks (estimados):
- `GET /api/entities`: ~50ms
- `POST /api/entities`: ~80ms
- `GET /api/relations` (com joins): ~120ms
- Seed 1000 entities: ~7s

### Otimizações Implementadas:
- ✅ Batch inserts (100 entidades por vez)
- ✅ Índices em colunas frequentemente consultadas
- ✅ Connection pooling (max 10)
- ✅ JSONB para propriedades flexíveis

---

## 🔐 Segurança

**Implementado:**
- ✅ Validação de tipos com Zod
- ✅ Foreign key constraints
- ✅ Cascade deletes
- ✅ Error handling sanitizado

**A implementar:**
- ⏳ Rate limiting
- ⏳ API authentication
- ⏳ Row-level security
- ⏳ Input sanitization avançada

---

## 📦 Stack Completa

- **Framework**: Next.js 15 (App Router)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL 16 (Railway)
- **Validation**: Zod 3.x
- **Mocking**: Faker.js 10.x
- **TypeScript**: 5.x
- **Runtime**: Node.js 22.x

---

✅ **Sistema completo e funcional!**  
🌐 **1152+ entidades no banco Mercantia**  
🚀 **API REST completa**  
🎲 **Mock generator inteligente**  
🌱 **Seed automatizado**
