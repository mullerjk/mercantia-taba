# Knowledge Graph Database Setup

## ✅ Sprint 1 Completo!

Você agora tem:
- ✅ Drizzle ORM configurado
- ✅ Schemas para Knowledge Graph (entities, relations, verifications, proofs)
- ✅ API CRUD completa (`/api/entities`)
- ✅ Scripts de migrations

---

## 🚀 Setup Rápido

### 1. Criar Banco de Dados (Neon - Recomendado)

**Opção A: Neon (Serverless PostgreSQL - Gratuito)**

1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

**Opção B: Supabase (PostgreSQL + Auth + Storage)**

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie projeto
3. Vá em Settings → Database → Connection string
4. Copie a connection string (modo "Direct")

**Opção C: Local (Docker)**

```bash
docker run --name taba-postgres \
  -e POSTGRES_PASSWORD=senha123 \
  -e POSTGRES_DB=taba \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Connection string: `postgresql://postgres:senha123@localhost:5432/taba`

### 2. Configurar Variáveis de Ambiente

```bash
cd app
cp .env.local.example .env.local
```

Edite `.env.local` e adicione:
```
DATABASE_URL="sua_connection_string_aqui"
```

### 3. Rodar Migrations

```bash
# Gerar SQL de migrations
npm run db:generate

# Aplicar migrations no banco
npm run db:push
```

### 4. Verificar Tabelas

Abrir Drizzle Studio (UI visual do banco):
```bash
npm run db:studio
```

Acesse: `https://local.drizzle.studio`

Você verá 5 tabelas:
- `entities` - Entidades (Person, Product, etc)
- `relations` - Ações/Relações (ConsumeAction, BuyAction)
- `verifications` - Verificações de identidade
- `proofs` - Provas (fotos, recibos, blockchain)
- `witnesses` - Testemunhas de fatos

---

## 🧪 Testar API

### Criar Entidade (POST)

```bash
curl -X POST http://localhost:3000/api/entities \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Person",
    "properties": {
      "name": "João Silva",
      "email": "joao@example.com",
      "birthDate": "1995-08-20"
    },
    "trustScore": 85
  }'
```

Resposta:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "Person",
  "properties": { "name": "João Silva", ... },
  "createdAt": "2024-11-20T10:00:00Z",
  "trustScore": 85
}
```

### Listar Entidades (GET)

```bash
# Todas as pessoas
curl "http://localhost:3000/api/entities?type=Person&limit=10"

# Com paginação
curl "http://localhost:3000/api/entities?limit=50&offset=0"
```

### Buscar Entidade Específica (GET)

```bash
curl "http://localhost:3000/api/entities/550e8400-e29b-41d4-a716-446655440000"
```

Retorna entidade + verificações + relações

### Atualizar Entidade (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/entities/550e8400-... \
  -H "Content-Type: application/json" \
  -d '{
    "trustScore": 95,
    "properties": {
      "name": "João Silva Jr.",
      "email": "joao@example.com"
    }
  }'
```

### Deletar Entidade (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/entities/550e8400-...
```

---

## 📊 Estrutura das Tabelas

### `entities` (Nós do Grafo)
```sql
id            UUID PRIMARY KEY
type          VARCHAR(100)      -- Schema.org type
properties    JSONB             -- Todas as propriedades
created_at    TIMESTAMP
created_by    UUID              -- Quem criou
updated_at    TIMESTAMP
trust_score   INTEGER (0-100)
```

### `relations` (Arestas do Grafo)
```sql
id            UUID PRIMARY KEY
type          VARCHAR(100)      -- Schema.org Action
agent_id      UUID → entities   -- Quem fez
object_id     UUID → entities   -- O que foi feito
start_time    TIMESTAMP
end_time      TIMESTAMP
location_id   UUID → entities
context       JSONB
trust_score   INTEGER (0-100)
```

### `verifications` (Provas de Identidade)
```sql
id            UUID PRIMARY KEY
entity_id     UUID → entities
method        VARCHAR(100)      -- "government_id", "email"
verified_by   VARCHAR(255)      -- Autoridade
timestamp     TIMESTAMP
expires_at    TIMESTAMP
proof         JSONB
```

### `proofs` (Evidências)
```sql
id            UUID PRIMARY KEY
relation_id   UUID → relations
type          VARCHAR(50)       -- "photo", "receipt", "blockchain"
url           TEXT              -- IPFS, Arweave
hash          VARCHAR(255)      -- SHA-256
verified_by   VARCHAR(255)
metadata      JSONB
```

---

## 🎯 Próximos Passos (Sprint 2)

1. **Mock Generator**: Criar gerador de dados de teste
2. **Seed Script**: Popular banco com 1000+ entidades
3. **Relations API**: CRUD para relações
4. **Integration**: Entity Viewer consumir API real

Para começar Sprint 2, execute:
```bash
npm run db:seed
```

---

## 🔧 Scripts Disponíveis

```bash
npm run db:generate   # Gerar SQL de migrations
npm run db:push       # Aplicar migrations
npm run db:migrate    # Rodar migrations (produção)
npm run db:studio     # Abrir Drizzle Studio (UI)
npm run db:seed       # Popular banco (quando implementado)
```

---

## 📚 Documentação

- [Drizzle ORM](https://orm.drizzle.team)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Neon Serverless Postgres](https://neon.tech/docs)
- [Schema.org Spec](https://schema.org)

---

## 🐛 Troubleshooting

**Erro: "DATABASE_URL not found"**
→ Verifique se criou `.env.local` com a connection string

**Erro: "relation entities does not exist"**
→ Execute `npm run db:push` para criar tabelas

**Erro: "connection timeout"**
→ Verifique se a connection string está correta e o banco está acessível

**Drizzle Studio não abre**
→ Tente `npx drizzle-kit studio` diretamente

---

✅ **Sprint 1 Completo!** Database pronto para uso.
