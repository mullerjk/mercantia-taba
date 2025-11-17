# Configuração de Pagamento com Pagar.me

Este documento contém as instruções para configurar e usar o Pagar.me SDK na aplicação Mercantia.

## Instalação

O SDK do Pagar.me já foi instalado via npm:

```bash
npm install pagarme
```

## Configuração das Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env.local`:

```env
NEXT_PUBLIC_PAGARME_PUBLIC_KEY=sua_chave_publica
PAGARME_API_KEY=sua_chave_privada
PAGARME_SECRET_KEY=sua_chave_secreta
```

Você pode obter essas chaves em: https://dashboard.pagar.me/

## Estrutura de Pagamento

### 1. **Endpoints de API**

#### POST `/api/payments/card`
Processa pagamentos com cartão de crédito.

**Request:**
```json
{
  "cardNumber": "4111111111111111",
  "cardholderName": "João Silva",
  "expiryMonth": 12,
  "expiryYear": 2025,
  "cvv": "123",
  "installments": 3,
  "amount": 10000,
  "orderId": "order_123",
  "customerId": "customer_456"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "txn_1234567890",
  "message": "Pagamento processado com sucesso"
}
```

#### POST `/api/payments/pix`
Gera um código PIX para pagamento instantâneo.

**Request:**
```json
{
  "amount": 10000,
  "orderId": "order_123",
  "customerId": "customer_456"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "pix_1234567890",
  "pixKey": "abc123def456",
  "qrCode": "...",
  "qrCodeUrl": "data:image/...",
  "expiresAt": "2025-01-01T12:30:00Z"
}
```

#### POST `/api/payments/boleto`
Gera um boleto para pagamento em até 3 dias úteis.

**Request:**
```json
{
  "amount": 10000,
  "orderId": "order_123",
  "customerId": "customer_456"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "bol_1234567890",
  "boletoNumber": "12345.67890 12345.678901 12345.678901 1 12345678901234",
  "barcode": "123456789012345678901234567890123456789012345",
  "dueDate": "01/01/2025",
  "pdfUrl": "/api/payments/boleto/bol_123/pdf"
}
```

### 2. **Componentes React**

#### PaymentMethodSelector
Componente principal para seleção de método de pagamento.

```tsx
<PaymentMethodSelector
  total={10000}
  orderId="order_123"
  customerId="customer_456"
  onPaymentSuccess={(paymentId) => handleSuccess(paymentId)}
  onPaymentError={(error) => handleError(error)}
  loading={false}
/>
```

**Props:**
- `total`: Valor em centavos
- `orderId`: ID do pedido (opcional)
- `customerId`: ID do cliente (opcional)
- `onPaymentSuccess`: Callback quando pagamento é bem-sucedido
- `onPaymentError`: Callback quando há erro
- `loading`: Estado de carregamento

#### CreditCardForm
Formulário para pagamento com cartão de crédito.

Recursos:
- Formatação automática de número do cartão
- Validação de data de validade
- Suporte a parcelamento até 12x
- Validação Luhn do cartão
- Máscara de entrada

#### PIXForm
Gerador de código PIX e QR Code.

Recursos:
- Geração de chave PIX
- QR Code para escanear
- Cópia automática da chave
- Desconto de 2% para PIX
- Timeout de 30 minutos para pagamento

#### BoletoForm
Gerador de boleto bancário.

Recursos:
- Número do boleto formatado
- Código de barras
- Vencimento em 3 dias úteis
- Download em PDF
- Cópia do código de barras

## Fluxo de Pagamento

```
1. Usuário preenche carrinho
   ↓
2. Clica em "Checkout"
   ↓
3. Preenche endereço de entrega
   ↓
4. Clica em "Proceder ao Pagamento"
   ↓
5. Seleciona método de pagamento:
   a) Cartão: Preenche dados e confirma
   b) PIX: Gera código e escaneia
   c) Boleto: Gera boleto e paga no banco
   ↓
6. Após sucesso, pedido é criado
   ↓
7. Redirecionado para confirmação
```

## Implementação do Pagar.me SDK

### Iniciabilizar Cliente

```typescript
import { Client } from 'pagarme'

const client = new Client({
  basicAuthCredentials: {
    username: process.env.PAGARME_API_KEY,
    password: process.env.PAGARME_SECRET_KEY
  }
})
```

### Criar Cobrança com Cartão

```typescript
const charge = await client.charges.createCharge({
  amount: 10000, // em centavos
  payment_method: 'credit_card',
  credit_card: {
    card_number: '4111111111111111',
    holder_name: 'João Silva',
    exp_month: 12,
    exp_year: 2025,
    cvv: '123'
  },
  customer: {
    id: 'customer_123'
  },
  metadata: {
    order_id: 'order_123'
  },
  installments: 3
})
```

### Criar Cobrança PIX

```typescript
const charge = await client.charges.createCharge({
  amount: 10000,
  payment_method: 'pix',
  pix: {
    expires_in: 1800 // 30 minutos
  },
  customer: {
    id: 'customer_123'
  },
  metadata: {
    order_id: 'order_123'
  }
})
```

### Criar Boleto

```typescript
const charge = await client.charges.createCharge({
  amount: 10000,
  payment_method: 'boleto',
  boleto: {
    due_date: '2025-01-15',
    instructions: 'Pagável em qualquer banco'
  },
  customer: {
    id: 'customer_123'
  },
  metadata: {
    order_id: 'order_123'
  }
})
```

## Testes

### Cartões de Teste

**Cartão Aprovado:**
- Número: 4111111111111111
- Validade: 12/2025
- CVV: 123

**Cartão Recusado:**
- Número: 5555555555554444
- Validade: 12/2025
- CVV: 123

### Webhooks

Implemente webhooks para receber notificações de pagamento:

```typescript
POST /api/webhooks/payment
Content-Type: application/json

{
  "event": "charge.paid",
  "charge_id": "txn_1234567890",
  "status": "paid",
  "amount": 10000,
  "timestamp": "2025-01-01T10:00:00Z"
}
```

## Segurança

- ✅ Validação de cartão com algoritmo Luhn
- ✅ Validação de data de validade
- ✅ CVV armazenado apenas durante transação
- ✅ Certificado SSL/TLS
- ✅ PCI DSS Compliance via Pagar.me
- ⚠️ Nunca armazene dados completos do cartão

## Próximas Etapas

1. [ ] Adicionar variáveis de ambiente do Pagar.me
2. [ ] Testar integração com sandbox do Pagar.me
3. [ ] Implementar webhooks para confirmação de pagamento
4. [ ] Adicionar histórico de transações
5. [ ] Implementar cancelamento e reembolso
6. [ ] Adicionar dashboard de pagamentos
7. [ ] Integrar com sistema de faturas
8. [ ] Adicionar suporte a múltiplas moedas

## Referências

- [Documentação Pagar.me](https://docs.pagar.me/)
- [SDK Node.js](https://github.com/pagarme/pagarme-nodejs-sdk)
- [Dashboard Pagar.me](https://dashboard.pagar.me/)
- [API Reference](https://www.pagar.me/docs/api/)
