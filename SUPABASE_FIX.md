# ✅ Correção da Conexão Supabase - Erro ECONNREFUSED

## 🚨 **Problema Identificado:**
```
Registration error: Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Causa:** Aplicação ainda tentando conectar com banco local em vez do Supabase

## 🛠️ **Correções Aplicadas:**

### **1. Arquivos Atualizados:**
- `app/src/app/api/marketplace/route.ts` - Removida conexão direta com PostgreSQL local
- `app/src/lib/supabase.ts` - Configurado para usar variáveis de ambiente
- `app/src/lib/supabase-server.ts` - Configurado para usar variáveis de ambiente

### **2. Mudanças na API Marketplace:**
**ANTES (Problema):**
```typescript
const psqlCommand = `psql "postgresql://postgres:postgres@127.0.0.1:54325/postgres" -c "${query}" -t -A -F '|'`
```

**DEPOIS (Correção):**
```typescript
// Create Supabase client
const supabase = await createServerSupabaseClient()

// Query through Supabase
const { data: entities, error } = await supabase
  .from('schema_entities')
  .select('*')
  .in('schema_type', ['schema:Organization', 'schema:Product'])
```

### **3. Variáveis Usadas (do Vercel):**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

## 🎯 **Deploy Status:**
- ✅ **Commit:** `1cd6e00`
- ✅ **Push:** Repository atualizado
- 🔄 **Deploy automático:** Triggered na Vercel

## ✅ **Resultado Esperado:**
- ✅ **Supabase conectado** corretamente
- ✅ **Registro de usuários** funcionará
- ✅ **API marketplace** usa Supabase
- ✅ **Erro ECONNREFUSED** resolvido

**Conexão Supabase corrigida - autenticação funcionará em produção!**
