# ✅ Erro PIX Pagar.me - API Error

## 🚨 **Problema Identificado:**
```bash
❌ PIX transaction error: Error [ApiError]: Pagar.me API error
```

## 🔍 **Causas Possíveis:**

### **1. IP Não Autorizado (Mais Provável):**
- **Causa:** Painel Pagar.me tem configuração de segurança de IP
- **Local:** Aplicação na Vercel usa IPs dinâmicos
- **Resultado:** API rejeita requests por IP não autorizado

### **2. Chaves de API Incorretas:**
- **Causa:** Chaves sandbox vs produção
- **Verificar:** `PAGARME_API_KEY` e `PAGARME_SECRET_KEY`

### **3. Configuração de Webhook:**
- **Causa:** URLs de webhook não configurados
- **Painel:** Settings → Webhooks → Add endpoint

## 🛠️ **Soluções Necessárias:**

### **Solução 1: Configurar IPs no Pagar.me**
1. **Acessar dashboard do Pagar.me**
2. **Settings → Security → Allowed IPs**
3. **Adicionar IPs da Vercel:**
   - `76.76.19.0/20` (range da Vercel)
   - Ou `*` (todos os IPs - menos seguro)

### **Solução 2: Verificar Chaves de API**
1. **Settings → API Keys**
2. **Copiar para Vercel Environment Variables:**
   ```
   PAGARME_API_KEY=pk_live_xxx (para produção)
   PAGARME_SECRET_KEY=sk_live_xxx (para produção)
   ```

### **Solução 3: Configurar Webhook**
1. **Settings → Webhooks**
2. **Add Endpoint:** `https://mercantia-taba.vercel.app/api/webhooks/pagar-me`
3. **Events:** Transaction events

### **Solução 4: Teste com cURL**
```bash
curl -X POST https://api.pagar.me/1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'sk_test_xxx:' | base64)" \
  -d '{
    "amount": 1000,
    "payment_method": "pix"
  }'
```

## 🎯 **Resultado Esperado:**
- ✅ PIX transaction funcionando
- ✅ QR Code gerado
- ✅ Webhooks processando

**Configure IP allowed no Pagar.me para resolver o erro da API!**
