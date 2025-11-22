# 🔗 Configuração do Webhook Pagar.me

## 📋 Problema Identificado
Os webhooks do Pagar.me estavam falhando porque não existia endpoint para receber as notificações. Todos os eventos estavam sendo marcados como "Falha" no painel do Pagar.me.

## ✅ Solução Implementada
Endpoint de webhook criado em: `app/src/app/api/webhooks/pagar-me/route.ts`

## 🛠️ Configuração no Pagar.me

### 1. Acesse o Painel do Pagar.me
- Vá para: https://dashboard.pagar.me/settings/webhooks

### 2. Adicione um Novo Webhook
Clique em **"Adicionar URL"** ou **"Add Endpoint"**

### 3. Configure o Webhook
```
URL: https://mercantia-taba.vercel.app/api/webhooks/pagar-me
Secret: (opcional, gere uma senha segura para validação)
```

### 4. Selecione os Eventos
Marque todos os eventos necessários:
- [x] **order.created** - Pedido criado
- [x] **order.updated** - Pedido atualizado
- [x] **order.payment_failed** - Falha no pagamento do pedido
- [x] **order.paid** - Pedido pago
- [x] **charge.created** - Cobrança criada
- [x] **charge.updated** - Cobrança atualizada
- [x] **charge.payment_failed** - Falha no pagamento da cobrança
- [x] **charge.paid** - Cobrança paga
- [x] **customer.created** - Comprador criado
- [x] **customer.updated** - Comprador atualizado

### 5. Salve as Configurações
Clique em **"Salvar"** ou **"Save"**

## 🎯 TESTE COM SIMULADOR PAGAR.ME OFICIAL

[Para testar usando o simulador oficial do Pagar.me:]
1. Vá para: `https://docs.pagar.me/docs/simulador-pix`
2. Cole o **Order ID** gerado pelo seu pagamento
3. Clique em **"Aprovar pagamento"**
4. O webhook será chamado automaticamente e o pedido será confirmado

## 🔍 Verificação
Após configurar, você pode testar o webhook:

### Teste Manual
```bash
curl -X GET https://mercantia-taba.vercel.app/api/webhooks/pagar-me
```

Deve retornar:
```json
{
  "message": "Pagar.me Webhook Endpoint",
  "status": "active",
  "events_supported": [...],
  "webhook_url": "https://mercantia-taba.vercel.app/api/webhooks/pagar-me"
}
```

## 📊 Status Atual
- ✅ Endpoint criado e funcional
- ✅ Todos os eventos suportados
- ⏳ Aguardando configuração no painel Pagar.me
- ⏳ Teste de comunicação

## 🔐 Segurança
- [x] Validação opcional de assinatura HMAC-SHA256
- [x] Logs detalhados em produção
- [x] Tratamento de erros adequado
- [x] Resposta sempre com status 200 (conforme exigido pelo Pagar.me)

## 🐛 Próximos Passos
1. Testar webhook quando uma cobrança for criada
2. Implementar lógica de negócio nos handlers
3. Adicionar notificações por email quando pagamentos falharem/sucederem
4. Salvar dados no banco de dados quando eventos forem recebidos

## 📋 Logs de Debug
O endpoint tem logs detalhados. Você pode verificar no console:
- ✅ Webhook recebida
- 📋 Evento processado
- ❌ Erro (se houver)
- ℹ️  Status de processamento

---

**IMPORTANTE**: Certifique-se de que o domínio está acessível publicamente na Vercel para que o Pagar.me possa enviar as notificações.
