# Schema.org MCP Server

MCP (Model Context Protocol) server integrado ao Mercantia TABA World Explorer, proporcionando acesso completo ao vocabulário schema.org para dados estruturados.

## 🚀 Funcionalidades

- **Busca de Tipos**: Encontre tipos schema.org por palavra-chave
- **Informações Detalhadas**: Obtenha informações completas sobre tipos
- **Hierarquia**: Explore relacionamentos de herança entre tipos
- **Propriedades**: Liste todas as propriedades disponíveis (incluindo herdadas)
- **Exemplos JSON-LD**: Gere exemplos válidos automaticamente
- **Documentação Automática**: Crie documentação completa para tipos

## 🛠️ Ferramentas Disponíveis

### 1. `get_schema_type`
Obter informações detalhadas sobre um tipo schema.org.

```json
{
  "typeName": "Person"
}
```

### 2. `search_schemas`
Buscar tipos schema.org por palavra-chave.

```json
{
  "query": "article",
  "limit": 10
}
```

### 3. `get_type_hierarchy`
Obter a hierarquia de herança para um tipo.

```json
{
  "typeName": "NewsArticle"
}
```

### 4. `get_type_properties`
Obter todas as propriedades disponíveis para um tipo.

```json
{
  "typeName": "Organization",
  "includeInherited": true
}
```

### 5. `generate_example`
Gerar um exemplo JSON-LD para um tipo.

```json
{
  "typeName": "Recipe",
  "properties": {
    "name": "Chocolate Chip Cookies",
    "prepTime": "PT20M"
  }
}
```

## 🔧 Integração com Schema Explorer

O Schema Explorer agora possui integração completa com o schema.org MCP, oferecendo:

### Funcionalidades Integradas

1. **Busca Avançada**: 
   - Busca por tipos schema.org diretamente na interface
   - Resultados enriquecidos com metadados

2. **Documentação Completa**:
   - Documentação automática para qualquer tipo
   - Hierarquia visual de herança
   - Exemplos de uso com validação

3. **Análise de Relacionamentos**:
   - Tipos relacionados automaticamente identificados
   - Análise de padrões de uso
   - Melhores práticas sugeridas

4. **Exemplos Validados**:
   - Geração de exemplos JSON-LD válidos
   - Validação automática de propriedades
   - Alternativas de implementação

### Como Usar

#### Via Interface (Schema Explorer)
1. Abra o Schema Explorer
2. Use a barra lateral para navegar pelos tipos
3. Clique em qualquer tipo para ver documentação completa
4. Use o painel de busca para encontrar tipos específicos

#### Via MCP Server
```bash
# Iniciar o servidor MCP
npm start

# Usar com Claude Desktop (configuração automática via Mercantia TABA)
# O servidor é automaticamente detectado e configurado
```

## 📁 Estrutura do Projeto

```
mcp-schema-org/
├── index.ts                           # Servidor MCP principal
├── schema-org-client.ts              # Cliente para schema.org
├── schema-explorer-integration.ts    # Integração com Schema Explorer
├── package.json                      # Dependências e scripts
└── README.md                        # Este arquivo
```

## 🔌 Integração Técnica

### EsquemaExplorerIntegration

A classe `SchemaExplorerIntegration` fornece uma ponte entre o Schema Explorer UI e o servidor MCP:

```typescript
import { SchemaExplorerIntegration } from './schema-explorer-integration.js';

const schemaExplorer = new SchemaExplorerIntegration();

// Inicializar conexão
await schemaExplorer.initialize();

// Buscar tipos com metadados enriquecidos
const results = await schemaExplorer.searchSchemaTypes('article');

// Obter informações completas
const docs = await schemaExplorer.generateTypeDocumentation('BlogPosting');

// Analisar relacionamentos
const analysis = await schemaExplorer.analyzeTypeRelationships('Person');
```

### Eventos de Integração

O Schema Explorer automaticamente:
- Carrega dados do schema.org ao inicializar
- Mantém cache de tipos frequentemente usados
- Fornece feedback visual durante consultas
- Exibe erro amigável em caso de falhas

## 🎯 Casos de Uso

### Para Desenvolvedores Web
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Minha Página",
  "description": "Descrição da página",
  "url": "https://exemplo.com"
}
```

### Para E-commerce
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Smartphone",
  "description": "Smartphone de última geração",
  "brand": "TechCorp",
  "offers": {
    "@type": "Offer",
    "price": "999.99",
    "priceCurrency": "USD"
  }
}
```

### Para SEO Local
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Restaurante do João",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Flores, 123",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "postalCode": "01234-567"
  }
}
```

## 🌐 Fonte de Dados

- **URL Oficial**: `https://schema.org/version/latest/schemaorg-current-https.jsonld`
- **Versão**: Sempre utiliza a última versão disponível
- **Atualizações**: Cache local com invalidação automática
- **Validação**: Todos os exemplos gerados são válidos conforme especificação

## 🔍 Exemplos Práticos

### Buscar e Analisar um Tipo

```typescript
// 1. Buscar tipos relacionados a "product"
const products = await schemaExplorer.searchSchemaTypes('product', 5);

// 2. Escolher Product e gerar documentação
const docs = await schemaExplorer.generateTypeDocumentation('Product');

// 3. Analisar relacionamentos
const analysis = await schemaExplorer.analyzeTypeRelationships('Product');

// 4. Gerar exemplo personalizado
const example = await schemaExplorer.generateValidatedExample('Product', {
  name: "iPhone 15 Pro",
  brand: "Apple",
  category: "Smartphone"
});
```

### Explorar Hierarquia

```typescript
// Obter hierarquia completa
const hierarchy = await schemaClient.getTypeHierarchy('Article');

// Navegar por herança
const parents = hierarchy.parents;
const children = hierarchy.children;

// Analisar profundidade de herança
const depth = schemaExplorer.calculateInheritanceLevel(parents);
```

## 🚀 Mercantia TABA

Este MCP server é integrado automaticamente ao **Mercantia TABA Schema Explorer**, fornecendo:

- ✅ **Interface Visual**: Navegação intuitiva pelos tipos
- ✅ **Documentação Automática**: Documentação completa gerada automaticamente
- ✅ **Exemplos Interativos**: Exemplos JSON-LD com validação
- ✅ **Busca Integrada**: Busca de tipos diretamente na interface
- ✅ **Hierarquia Visual**: Visualização de relacionamentos de herança
- ✅ **Tema Suporte**: Cores e estilos seguem o tema do Schema Explorer

## 📚 Recursos Adicionais

- [Documentação Oficial Schema.org](https://schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)
- [Guia de Dados Estruturados Google](https://developers.google.com/search/docs/appearance/structured-data)
- [Especificação MCP](https://modelcontextprotocol.io/)

## 🎉 Resultado Final

Com a integração do schema.org MCP, o **Mercantia TABA Schema Explorer** agora oferece:

- 🔍 **Busca Inteligente**: Encontre tipos schema.org rapidamente
- 📖 **Documentação Automática**: Documentação completa gerada automaticamente
- 🎨 **Exemplos Válidos**: Exemplos JSON-LD prontos para uso
- 🔗 **Relacionamentos**: Explore hierarquias e relacionamentos visualmente
- 💡 **Melhores Práticas**: Orientações para uso otimizado
- 🌐 **Integração Total**: Funciona perfeitamente com a interface existente

O Schema Explorer é agora uma ferramenta completa para trabalhar com schema.org, combinando a força do protocolo MCP com uma interface visual intuitiva! 🎊
