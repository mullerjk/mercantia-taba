# ✅ Configuração DATABASE_URL para Vercel

## 🚨 **Problema Identificado:**
```
Error: DATABASE_URL environment variable is required
at module evaluation (.next/server/app/api/auth/logout/route.js:7:3)
```

**Causa:** Sistema de auth personalizado usa Drizzle ORM que precisa de DATABASE_URL

## 🛠️ **Solução:**

### **Adicionar no Vercel Dashboard → Settings → Environment Variables:**

**VARIÁVEL:** `DATABASE_URL`
**VALOR:** Use o POSTGRES_URL das variáveis do Supabase

**De suas variáveis no Vercel:**
```
POSTGRES_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
```

**Copie esse valor e adicione como:**
```
DATABASE_URL=<valor_do_POSTGRES_URL>
```

### **Por que isso funciona:**
- ✅ **Mantém compatibilidade** com sistema de auth existente
- ✅ **Usa banco Supabase** através de Drizzle ORM
- ✅ **Solução rápida** sem reescrever todas as rotas de auth

### **Deploy After Adding Variable:**
1. **Add DATABASE_URL** no Vercel Dashboard
2. **Redeploy automático** será triggered
3. **Auth system** funcionará novamente

**Configuração simples - resolve o erro imediatamente!**
