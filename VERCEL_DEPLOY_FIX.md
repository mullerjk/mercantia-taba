# ✅ Correções para Deploy na Vercel

## 🔧 Problemas Identificados e Solucionados:

### **Erro Original:**
```
Command "turbo run build" exited with 1
```

### **Causa Raiz:**
- Workspace pnpm/turbo configurado mas não compatível com Vercel
- Configurações de monorepo conflitando com build simples

## 🛠️ Correções Implementadas:

### 1. **Package.json Root - Simplificado**
```json
{
  "scripts": {
    "build": "cd app && npm run build"
  }
}
```

### 2. **Removed Conflicting Files:**
- `turbo.json` → `turbo.json.bak`
- `pnpm-workspace.yaml` → `pnpm-workspace.yaml.bak`

### 3. **Added Vercel Config Files:**
- `.vercelignore` - Foca apenas na pasta app
- `vercel.json` - Configuração de build específica

## 🚀 Próximos Passos:

### **Para Deploy Manual:**
```bash
git add .
git commit -m "Fix: Vercel deploy configuration"
git push origin main
```

### **Para Deploy na Vercel Dashboard:**
1. Go to Project Settings
2. Build Command: `cd app && npm run build`
3. Output Directory: `app/.next`

## 📦 **Variáveis de Ambiente Necessárias na Vercel:**
- `PAGARME_API_KEY`
- `PAGARME_SECRET_KEY`
- `PAGARME_ENVIRONMENT=sandbox`
- `SUPABASE_DB_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ **Status Esperado:**
- Build Command: `cd app && npm run build`
- Output Directory: `app/.next`
- Install Command: `cd app && npm install`
- Root Directory: `/`

## 🎯 **Benefícios das Correções:**
- ✅ Build simplificado sem dependência do Turbo
- ✅ Workspace pnpm removido - uso de npm nativo
- ✅ Foco na aplicação Next.js na pasta `app/`
- ✅ Configuração otimizada para Vercel
