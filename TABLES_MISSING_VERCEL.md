# ✅ Problema: Tabelas Faltando na Vercel

## 🚨 **Problema Identificado:**
```bash
# Erros na Vercel:
- ea: relation "users" does not exist (registro)
- ea: relation "products" does not exist (produtos)

# Funcionando localmente:
✅ Todas as tabelas existem no banco local
```

## 🔍 **Causa Raiz:**
**Mismatch entre bancos de dados:**
- **Local:** `.env.local` → Banco PostgreSQL local
- **Vercel:** `DATABASE_URL` → Banco Supabase

**A aplicação na Vercel não tem as tabelas porque está conectada ao banco Supabase, não ao local.**

## 🛠️ **Solução Necessária:**

### **1. Aplicar Migrações no Supabase:**
No **dashboard do Supabase**, você precisa executar as migrações:

**SQL para executar no Supabase Editor:**
```sql
-- Tabela users (para registro de usuários)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    email varchar(255) NOT NULL,
    password_hash text NOT NULL,
    full_name varchar(255),
    avatar_url text,
    email_verified boolean DEFAULT false NOT NULL,
    role varchar(50) DEFAULT 'user' NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp,
    last_login_at timestamp,
    CONSTRAINT users_email_unique UNIQUE(email)
);

-- Tabela products (para marketplace)
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    store_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL,
    description text,
    price integer NOT NULL,
    cost integer,
    currency varchar(3) DEFAULT 'USD',
    sku varchar(100),
    images jsonb DEFAULT '[]'::jsonb,
    inventory integer DEFAULT 0,
    category varchar(100),
    tags jsonb DEFAULT '[]'::jsonb,
    rating integer DEFAULT 0,
    review_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp
);

-- Tabela stores (para vendedores)
CREATE TABLE IF NOT EXISTS stores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL,
    description text,
    logo_url text,
    banner_url text,
    email varchar(255),
    phone varchar(20),
    website text,
    address jsonb,
    rating integer DEFAULT 0,
    review_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp,
    CONSTRAINT stores_slug_unique UNIQUE(slug)
);
```

### **2. Ou Executar Script de Migração:**
```bash
# No Supabase Dashboard → SQL Editor
# Cole o conteúdo de app/drizzle/0001_puzzling_kat_farrell.sql
```

## 🎯 **Resultado Esperado:**
- ✅ **Registro de usuários** funcionará (tabela users)
- ✅ **Listagem de produtos** funcionará (tabela products)
- ✅ **Marketplace** estará operacional

**A aplicação está configurada corretamente, apenas falta aplicar as migrações no banco Supabase!**
