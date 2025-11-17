# Guia de Integração Pagar.me - Próximas Etapas

## ✅ O que foi feito

- [x] SDK Pagar.me instalado (`pagarme@^4.35.2`)
- [x] Componentes de UI criados (Cartão, PIX, Boleto)
- [x] Endpoints mock criados (`/api/payments/*`)
- [x] Arquivo de configuração do Pagar.me criado (`src/lib/pagarme-client.ts`)
- [x] Variáveis de ambiente adicionadas ao `.env.local`

## 🚀 Próximas Etapas

### 1. Obter Credenciais do Pagar.me

1. Acesse [https://dashboard.pagar.me/](https://dashboard.pagar.me/)
2. Crie uma conta ou faça login
3. Vá para **Configurações → Chaves de API**
4. Copie:
   - **API Key** → `PAGARME_API_KEY`
   - **Secret Key** → `PAGARME_SECRET_KEY`
   - **Public Key** → `NEXT_PUBLIC_PAGARME_PUBLIC_KEY` (opcional)

### 2. Configurar Variáveis de Ambiente

No arquivo `app/.env.local`, atualize as variáveis com suas chaves reais:

```env
PAGARME_API_KEY=sua_chave_api_do_pagarme
PAGARME_SECRET_KEY=sua_chave_secreta_do_pagarme
NEXT_PUBLIC_PAGARME_PUBLIC_KEY=sua_chave_publica_do_pagarme
```

### 3. Integrar com os Endpoints

Atualize os arquivo dos endpoints para usar as funções do `pagarme-client.ts`:

#### `app/src/app/api/payments/card/route.ts`

```typescript
import { processCardPayment } from '@/lib/pagarme-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações...

    const result = await processCardPayment(
      body.cardNumber,
      body.cardholderName,
      body.expiryMonth,
      body.expiryYear,
      body.cvv,
      body.amount,
      body.installments,
      body.customerId,
      body.orderId
    )

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      status: result.status,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
```

#### `app/src/app/api/payments/pix/route.ts`

```typescript
import { generatePixCharge } from '@/lib/pagarme-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await generatePixCharge(
      body.amount,
      body.customerId,
      body.orderId
    )

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      pixKey: result.pixKey,
      qrCodeUrl: result.qrCode,
      expiresAt: result.expiresAt,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao gerar PIX' },
      { status: 500 }
    )
  }
}
```

#### `app/src/app/api/payments/boleto/route.ts`

```typescript
import { generateBoleto } from '@/lib/pagarme-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await generateBoleto(
      body.amount,
      body.customerId,
      body.orderId
    )

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      boletoNumber: result.boletoNumber,
      barcode: result.barcode,
      dueDate: result.dueDate,
      pdfUrl: result.pdfUrl,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao gerar boleto' },
      { status: 500 }
    )
  }
}
```

### 4. Testar com Cartões Sandbox

Use esses cartões para testar na sandbox do Pagar.me:

| Cartão | Número | Validade | CVV | Status |
|--------|--------|----------|-----|--------|
| VISA Aprovado | 4111111111111111 | 12/2025 | 123 | ✅ Aprovado |
| VISA Recusado | 4000000000000002 | 12/2025 | 123 | ❌ Recusado |
| Mastercard | 5555555555554444 | 12/2025 | 123 | ✅ Aprovado |
| Amex | 378282246310005 | 12/2025 | 123 | ✅ Aprovado |

### 5. Implementar Webhooks

Crie um endpoint para receber notificações de pagamento:

```typescript
// app/src/app/api/webhooks/pagar-me/route.ts

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-pagar-me-signature')

    // Verificar assinatura da webhook
    const secretKey = process.env.PAGARME_SECRET_KEY || ''
    const bodyString = JSON.stringify(body)
    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(bodyString)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Processar eventos
    const { event, charge } = body

    switch (event) {
      case 'charge.paid':
        // Processamento de pagamento realizado
        console.log('✅ Charge paid:', charge.id)
        // Atualizar status do pedido no banco de dados
        break

      case 'charge.failed':
        // Processamento de pagamento falhado
        console.log('❌ Charge failed:', charge.id)
        break

      case 'charge.refunded':
        // Processamento de reembolso
        console.log('💸 Charge refunded:', charge.id)
        break
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 6. Adicionar Webhooks no Dashboard do Pagar.me

1. No [dashboard do Pagar.me](https://dashboard.pagar.me/)
2. Vá para **Configurações → Webhooks**
3. Clique em **Adicionar URL**
4. Insira a URL: `https://seu-dominio.com/api/webhooks/pagar-me`
5. Selecione os eventos:
   - `charge.paid`
   - `charge.failed`
   - `charge.refunded`
   - `charge.pending`

### 7. Adicionar Histórico de Transações

Crie uma tabela no banco de dados para armazenar transações:

```typescript
// src/db/schema.ts

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  orderId: text('order_id').references(() => orders.id),
  pagarmeId: text('pagarme_id').notNull().unique(),
  amount: integer('amount').notNull(),
  method: text('method').notNull(), // 'card', 'pix', 'boleto'
  status: text('status').notNull(), // 'pending', 'paid', 'failed', 'refunded'
  cardLast4: text('card_last_4'),
  installments: integer('installments').default(1),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
```

### 8. Dashboard de Pagamentos

Crie uma página para visualizar histórico de pagamentos:

```typescript
// app/src/app/dashboard/payments/page.tsx

import { TransactionList } from '@/components/TransactionList'
import { useAuth } from '@/contexts/AuthContext'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Histórico de Pagamentos</h1>
      <TransactionList />
    </div>
  )
}
```

### 9. Adicionar Reembolso

Permita que usuários solicitem reembolsos:

```typescript
// app/src/app/api/payments/refund/route.ts

import { refundCharge } from '@/lib/pagarme-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chargeId, amount } = body

    const result = await refundCharge(chargeId, amount)

    return NextResponse.json({
      success: true,
      refundId: result.refundId,
      status: result.status,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao processar reembolso' },
      { status: 500 }
    )
  }
}
```

## 📚 Referências

- [Documentação Pagar.me](https://docs.pagar.me/)
- [SDK Node.js GitHub](https://github.com/pagarme/pagarme-nodejs-sdk)
- [Dashboard Pagar.me](https://dashboard.pagar.me/)
- [API Reference](https://docs.pagar.me/reference)

## 🔐 Checklist de Segurança

- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS habilitado em produção
- [ ] Validação de assinatura de webhooks
- [ ] CVV nunca armazenado no banco
- [ ] PCI DSS compliance verificado
- [ ] Testes com sandbox completados
- [ ] Logs de erro configurados
- [ ] Rate limiting implementado

## 🎯 Status da Integração

| Item | Status | Data | Notas |
|------|--------|------|-------|
| SDK Instalado | ✅ | 2025-11-16 | pagarme@^4.35.2 |
| UI Components | ✅ | 2025-11-16 | Card, PIX, Boleto |
| Endpoints Mock | ✅ | 2025-11-16 | Prontos para integração |
| Pagarme Client | ✅ | 2025-11-16 | src/lib/pagarme-client.ts |
| Variáveis de Env | ✅ | 2025-11-16 | Adicionadas ao .env.local |
| Testes Sandbox | ⏳ | - | Aguardando credenciais |
| Webhooks | ⏳ | - | Pronto para implementação |
| Produção | ⏳ | - | Aguardando testes completos |
