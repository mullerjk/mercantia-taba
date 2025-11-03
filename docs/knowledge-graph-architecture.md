# Knowledge Graph Architecture - Schema.org Based

## Visão Geral

Um Knowledge Graph global baseado em Schema.org para registrar **fatos verificáveis** sobre o mundo real.

## Conceitos Fundamentais

### 1. Entidades (Nodes)
Cada entidade é uma instância de um tipo Schema.org:

```typescript
interface Entity {
  id: string              // UUID global único
  type: string            // Schema.org type (ex: "Person", "Product", "Organization")
  properties: {
    [key: string]: any    // Propriedades do Schema.org
  }
  
  // Metadados de proveniência
  createdAt: timestamp
  createdBy: string       // User/Organization que criou
  verifications: Verification[]  // Provas de verificação
  sources: Source[]       // Fontes de dados
}
```

**Exemplo - Pessoa:**
```json
{
  "id": "person:550e8400-e29b-41d4-a716-446655440000",
  "type": "Person",
  "properties": {
    "name": "Maria Silva",
    "email": "maria@example.com",
    "birthDate": "1990-05-15",
    "nationality": "Brazilian"
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "verifications": [
    {
      "method": "government_id",
      "verifiedBy": "gov:br:cpf",
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 2. Relações (Edges)
Relações são representadas como **Actions** do Schema.org:

```typescript
interface Relation {
  id: string              // UUID da relação
  type: string            // Schema.org Action type (ex: "ConsumeAction", "BuyAction")
  
  // Subject-Predicate-Object (Triple)
  agent: string           // ID da entidade que executa (Person/Organization)
  object: string          // ID da entidade afetada (Product/Service)
  
  // Contexto
  startTime?: timestamp
  endTime?: timestamp
  location?: string       // ID de Place
  
  // Metadados
  createdAt: timestamp
  proofs: Proof[]        // Provas verificáveis (recibos, fotos, blockchain)
  witnesses: string[]    // IDs de testemunhas
}
```

**Exemplo - Ato de Consumo:**
```json
{
  "id": "action:consume:123e4567-e89b-12d3-a456-426614174000",
  "type": "ConsumeAction",
  
  "agent": "person:550e8400-e29b-41d4-a716-446655440000",
  "object": "product:cafe-organico-500g",
  
  "startTime": "2024-11-20T08:00:00Z",
  "location": "place:residencia-maria",
  
  "proofs": [
    {
      "type": "receipt",
      "url": "ipfs://Qm...",
      "hash": "sha256:abc123...",
      "verifiedBy": "oracle:receipt-validator"
    },
    {
      "type": "photo",
      "url": "ipfs://Qm...",
      "timestamp": "2024-11-20T08:05:00Z"
    }
  ]
}
```

## Modelo de Dados - Banco de Dados

### Opção 1: Graph Database (Neo4j, ArangoDB)

**Vantagens:**
- Queries nativas de grafos (traversal)
- Performance em relacionamentos complexos
- Visualização natural

**Estrutura:**
```cypher
// Criar entidades
CREATE (maria:Person {
  id: "person:550e...",
  name: "Maria Silva",
  email: "maria@example.com"
})

CREATE (cafe:Product {
  id: "product:cafe-organico-500g",
  name: "Café Orgânico 500g",
  brand: "Fazenda Boa Vista"
})

CREATE (fazenda:Organization {
  id: "org:fazenda-boa-vista",
  name: "Fazenda Boa Vista",
  legalName: "Fazenda Boa Vista Ltda"
})

// Criar relações
CREATE (maria)-[:CONSUMED {
  actionId: "action:consume:123e...",
  startTime: "2024-11-20T08:00:00Z",
  proofs: ["ipfs://Qm..."]
}]->(cafe)

CREATE (cafe)-[:PRODUCED_BY {
  startTime: "2024-10-01T00:00:00Z"
}]->(fazenda)

// Query: O que Maria consumiu hoje?
MATCH (p:Person {id: "person:550e..."})-[c:CONSUMED]->(product)
WHERE c.startTime >= datetime("2024-11-20T00:00:00Z")
RETURN product
```

### Opção 2: RDF Triple Store (Apache Jena, Stardog)

**Vantagens:**
- Padrão W3C (RDF/OWL)
- Compatibilidade total com Schema.org
- Reasoning automático (inferência)

**Estrutura (Turtle format):**
```turtle
@prefix schema: <https://schema.org/> .
@prefix ex: <https://example.org/entity/> .

# Entidade: Pessoa
ex:maria a schema:Person ;
  schema:identifier "person:550e8400..." ;
  schema:name "Maria Silva" ;
  schema:email "maria@example.com" ;
  schema:birthDate "1990-05-15"^^xsd:date .

# Entidade: Produto
ex:cafe a schema:Product ;
  schema:identifier "product:cafe-organico-500g" ;
  schema:name "Café Orgânico 500g" ;
  schema:brand ex:fazenda .

# Entidade: Organização
ex:fazenda a schema:Organization ;
  schema:identifier "org:fazenda-boa-vista" ;
  schema:legalName "Fazenda Boa Vista Ltda" .

# Relação: Ato de Consumo
ex:action-consume-123 a schema:ConsumeAction ;
  schema:agent ex:maria ;
  schema:object ex:cafe ;
  schema:startTime "2024-11-20T08:00:00Z"^^xsd:dateTime ;
  schema:location ex:residencia-maria .

# Query SPARQL: Produtos consumidos por Maria
SELECT ?product ?productName WHERE {
  ?action a schema:ConsumeAction ;
    schema:agent ex:maria ;
    schema:object ?product .
  ?product schema:name ?productName .
}
```

### Opção 3: Híbrido (PostgreSQL + JSONB + PostGIS)

**Vantagens:**
- SQL familiar
- JSONB para flexibilidade
- PostGIS para dados geográficos
- Escalável com sharding

**Schema:**
```sql
-- Tabela de Entidades
CREATE TABLE entities (
  id UUID PRIMARY KEY,
  type VARCHAR(100) NOT NULL,  -- Schema.org type
  properties JSONB NOT NULL,
  
  -- Metadados
  created_at TIMESTAMP NOT NULL,
  created_by UUID,
  updated_at TIMESTAMP,
  
  -- Índices
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES entities(id)
);

-- Índices para busca eficiente
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_properties ON entities USING GIN(properties);

-- Tabela de Relações (Actions)
CREATE TABLE relations (
  id UUID PRIMARY KEY,
  type VARCHAR(100) NOT NULL,  -- Schema.org Action type
  
  agent_id UUID NOT NULL,
  object_id UUID NOT NULL,
  
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  location_id UUID,
  
  context JSONB,  -- Dados adicionais
  proofs JSONB[],  -- Array de provas
  
  created_at TIMESTAMP NOT NULL,
  
  CONSTRAINT fk_agent FOREIGN KEY (agent_id) REFERENCES entities(id),
  CONSTRAINT fk_object FOREIGN KEY (object_id) REFERENCES entities(id),
  CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES entities(id)
);

-- Índices para queries rápidas
CREATE INDEX idx_relations_agent ON relations(agent_id);
CREATE INDEX idx_relations_object ON relations(object_id);
CREATE INDEX idx_relations_type ON relations(type);
CREATE INDEX idx_relations_time ON relations(start_time);

-- Query: Atos de consumo de Maria nos últimos 7 dias
SELECT 
  r.id as action_id,
  e_product.properties->>'name' as product_name,
  r.start_time,
  r.proofs
FROM relations r
JOIN entities e_agent ON r.agent_id = e_agent.id
JOIN entities e_product ON r.object_id = e_product.id
WHERE 
  r.type = 'ConsumeAction'
  AND e_agent.properties->>'email' = 'maria@example.com'
  AND r.start_time >= NOW() - INTERVAL '7 days'
ORDER BY r.start_time DESC;
```

## Arquitetura para Escala Global

### 1. Camada de Identidade Global
```
┌─────────────────────────────────────┐
│   DID (Decentralized Identifier)   │
│   did:taba:person:550e8400...       │
│                                     │
│   - Portável entre sistemas         │
│   - Auto-soberano (usuário controla)│
│   - Verificável criptograficamente  │
└─────────────────────────────────────┘
```

### 2. Camada de Consenso e Verificação
```
┌─────────────────────────────────────┐
│   Blockchain/DLT (Opcional)         │
│   - Apenas hashes de fatos          │
│   - Timestamps verificáveis         │
│   - Imutabilidade                   │
└─────────────────────────────────────┘
         ↑
         │ Anchoring
         ↓
┌─────────────────────────────────────┐
│   Oráculos de Verificação           │
│   - Gov: CPF, RG, Passaporte        │
│   - Banks: Transações                │
│   - IoT: Sensores, Câmeras          │
│   - Social: Testemunhas, Reviews    │
└─────────────────────────────────────┘
```

### 3. Camada de Armazenamento Distribuído
```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Region: BR     │    │   Region: US     │    │   Region: EU     │
│                  │    │                  │    │                  │
│  Primary Shard   │◄──►│  Replica         │◄──►│  Replica         │
│  Users: BR/LATAM │    │  Users: Americas │    │  Users: Europe   │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         ↓                       ↓                       ↓
┌────────────────────────────────────────────────────────────────────┐
│               Distributed Cache (Redis/Memcached)                  │
└────────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────────┐
│               Content-Addressed Storage (IPFS/Arweave)             │
│               - Provas imutáveis (fotos, documentos)               │
└────────────────────────────────────────────────────────────────────┘
```

### 4. API GraphQL para Acesso Universal
```graphql
type Query {
  # Buscar entidade
  entity(id: ID!): Entity
  
  # Buscar relações
  actions(
    type: ActionType
    agent: ID
    object: ID
    startTime: DateTime
    endTime: DateTime
  ): [Action!]!
  
  # Graph traversal
  relatedEntities(
    from: ID!
    relationTypes: [ActionType!]
    depth: Int = 1
  ): [Entity!]!
}

type Entity {
  id: ID!
  type: String!
  properties: JSON!
  
  # Navegação de grafo
  actionsAsAgent: [Action!]!
  actionsAsObject: [Action!]!
  
  # Verificação
  verifications: [Verification!]!
  trustScore: Float
}

type Action {
  id: ID!
  type: String!
  agent: Entity!
  object: Entity!
  startTime: DateTime
  location: Entity
  proofs: [Proof!]!
}
```

## Interface do Usuário - Exemplo Prático

### Visualização de um Fato
```
┌─────────────────────────────────────────────────────────────┐
│  🍵 Maria consumiu Café Orgânico 500g                       │
│                                                             │
│  👤 Agente: Maria Silva                                     │
│     📧 maria@example.com                                    │
│     ✓ Verificado: CPF, Email                               │
│                                                             │
│  📦 Produto: Café Orgânico 500g                            │
│     🏢 Marca: Fazenda Boa Vista                            │
│     🌱 Certificações: Orgânico, Fair Trade                  │
│                                                             │
│  📅 Quando: 20 Nov 2024, 08:00                             │
│  📍 Onde: Residência (São Paulo, BR)                       │
│                                                             │
│  📸 Provas:                                                 │
│     • Foto do produto [Ver]                                │
│     • Nota fiscal [Verificada ✓]                           │
│     • Hash blockchain: 0xabc123...                         │
│                                                             │
│  👥 Testemunhas: 2 pessoas                                 │
│  🎯 Confiança: 98% (Alta)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Grafo de Relacionamentos
```
     [Fazenda Boa Vista]
            │ produces
            ↓
     [Café Orgânico 500g]
            │ consumed_by
            ↓
       [Maria Silva]
            │ works_for
            ↓
     [Tech Company Inc]
            │ located_in
            ↓
       [São Paulo, BR]
```

## Próximos Passos

1. **Criar componente de visualização de entidades**
2. **Implementar formulário de registro de fatos**
3. **Sistema de verificação e provas**
4. **API GraphQL para queries**
5. **Sistema de permissões (quem pode ver o quê)**

Quer que eu implemente algum desses componentes agora?
