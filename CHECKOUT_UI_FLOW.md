# 🛒 Fluxo UI Completo de Checkout

## 📍 Rotas Corretas (sem /dashboard)

```
/marketplace      → Listagem de produtos
   ↓
/cart            → Carrinho de compras
   ↓
/checkout        → Finalizar compra (2 passos)
   ↓
/my-orders       → Confirmação e histórico de pedidos
```

---

## 🎯 Tela 1: Marketplace (`/marketplace`)

**Exibição:**
```
┌─────────────────────────────────────────┐
│ 🏪 MERCANTIA - Marketplace              │
├─────────────────────────────────────────┤
│                                         │
│  [Categoria 1] [Categoria 2] [...]     │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Produto 1    │  │ Produto 2    │    │
│  │              │  │              │    │
│  │ R$ 99.90     │  │ R$ 149.90    │    │
│  │ [Adicionar]  │  │ [Adicionar]  │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Produto 3    │  │ Produto 4    │    │
│  │              │  │              │    │
│  │ R$ 79.90     │  │ R$ 199.90    │    │
│  │ [Adicionar]  │  │ [Adicionar]  │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Ações do Usuário:**
- Clica em [Adicionar] em um produto
- Produto é adicionado ao carrinho
- Badge no carrinho mostra quantidade (ex: 🛒 2)

---

## 🛒 Tela 2: Carrinho (`/cart`)

**Header:**
```
← Carrinho de Compras
```

**Layout (Desktop 3 colunas):**
```
┌─────────────────────────────────────────────────┐
│ ← Carrinho de Compras                           │
└─────────────────────────────────────────────────┘

┌──────────────────────────────────────┬─────────────────┐
│                                      │ Resumo da       │
│ Itens no Carrinho:                   │ Compra          │
│                                      │                 │
│ ┌────────────────────────────────┐   │ Produto 1  R$ X │
│ │ Produto 1 - R$ 99.90           │   │ Produto 2  R$ Y │
│ │ Qty: [1] [↑] [↓]               │   │ ...             │
│ │ [✕ Remover]                    │   │                 │
│ │                                │   │ Subtotal:       │
│ ├────────────────────────────────┤   │ R$ ZZZ.ZZ       │
│ │ Produto 2 - R$ 149.90          │   │                 │
│ │ Qty: [2] [↑] [↓]               │   │ Impostos e      │
│ │ [✕ Remover]                    │   │ frete serão     │
│ │                                │   │ calculados no   │
│ └────────────────────────────────┘   │ checkout        │
│                                      │                 │
│                                      │ [Ir para        │
│                                      │  Checkout]      │
│                                      │                 │
│                                      │ [Continuar      │
│                                      │  Comprando]     │
│                                      │                 │
│                                      │ 💙 Frete grátis │
│                                      │ em pedidos      │
│                                      │ acima de R$ 100 │
└──────────────────────────────────────┴─────────────────┘
```

**Mobile (1 coluna):**
```
┌───────────────────────────────────┐
│ ← Carrinho de Compras             │
├───────────────────────────────────┤
│                                   │
│ Produto 1 - R$ 99.90             │
│ Qty: [1] [↑] [↓]                 │
│ [✕ Remover]                      │
│                                   │
│ Produto 2 - R$ 149.90            │
│ Qty: [2] [↑] [↓]                 │
│ [✕ Remover]                      │
│                                   │
├───────────────────────────────────┤
│ Subtotal: R$ ZZZ.ZZ              │
│                                   │
│ [Ir para Checkout]               │
│ [Continuar Comprando]            │
│                                   │
│ 💙 Frete grátis em pedidos       │
│    acima de R$ 100               │
└───────────────────────────────────┘
```

**Fluxo Clicando "Ir para Checkout":**
```
[Ir para Checkout] → Navigate to /checkout (PASSO 1)
```

---

## 💳 Tela 3: Checkout - PASSO 1 (Endereço) (`/checkout`)

**Header:**
```
← Finalizar Compra
  Passo 1: Selecione seu endereço de entrega
```

**Step Indicator:**
```
● Endereço ────── ○ Pagamento
  Selecione seu  Escolha o
  endereço       método
```

**Layout (Desktop 3 colunas):**
```
┌──────────────────────────────────────────────────────────┐
│ ← Finalizar Compra                                       │
│   Passo 1: Selecione seu endereço de entrega            │
├──────────────────────────────────────────────────────────┤
│ ● Endereço ────────── ○ Pagamento                       │
│   Selecione seu        Escolha o método                 │
│   endereço                                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────┐
│ Endereço de Entrega              │ Resumo do Pedido     │
│ Selecione ou adicione um endereço │                     │
│                                  │ Produto 1    R$ X    │
│ ┌──────────────────────────────┐ │ Produto 2    R$ Y    │
│ │ João Silva                   │ │                      │
│ │ 🌟 Padrão  ✓ Selecionado    │ │ Subtotal   R$ ZZZ   │
│ │                              │ │ Frete      R$  10   │
│ │ Av. Paulista, 1000          │ │ Impostos   R$  ZZ   │
│ │ São Paulo, SP 01311-100     │ │                      │
│ │ (11) 98765-4321             │ │ TOTAL     R$ XXXX   │
│ │                              │ │                      │
│ │ [Editar] [Remover]          │ │ 🔒 Pagamento Seguro │
│ └──────────────────────────────┘ │ Suas informações são │
│                                  │ criptografadas.      │
│ ┌──────────────────────────────┐ │                      │
│ │ Outro Endereço               │ │ ✓ Métodos de        │
│ │                              │ │   Pagamento:         │
│ │ Rua X, 200                   │ │                      │
│ │ Rio de Janeiro, RJ 20000-000 │ │ • Cartão (até 12x)  │
│ │                              │ │ • PIX (-2%)         │
│ │ [Editar] [Remover]          │ │ • Boleto            │
│ └──────────────────────────────┘ │                      │
│                                  │                      │
│ [+ Adicionar Novo Endereço]      │                      │
│                                  │                      │
│ [Continuar para Pagamento] →     │                      │
└──────────────────────────────────┴──────────────────────┘
```

**Clicando "Continuar para Pagamento":**
```
[Continuar] → setCurrentStep('payment') → Atualiza a UI
             (mantém na mesma URL /checkout)
```

---

## 💸 Tela 4: Checkout - PASSO 2 (Pagamento) (`/checkout`)

**Header (Atualizado):**
```
← Finalizar Compra
  Passo 2: Escolha o método de pagamento
```

**Step Indicator (Atualizado):**
```
✓ Endereço ────── ● Pagamento
 Selecionado      Escolha o
                  método
```

**Layout (Desktop 3 colunas):**
```
┌──────────────────────────────────────────────────────────┐
│ ← Finalizar Compra                                       │
│   Passo 2: Escolha o método de pagamento               │
├──────────────────────────────────────────────────────────┤
│ ✓ Endereço ────────── ● Pagamento                       │
│  Selecionado          Escolha o método                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────┐
│ Método de Pagamento              │ Resumo do Pedido     │
│ Escolha como deseja pagar sua    │                      │
│ compra                            │ Produto 1    R$ X    │
│                                  │ Produto 2    R$ Y    │
│ ◉ Cartão de Crédito             │                      │
│   [Número 1234 5678 9012 3456]  │ Subtotal   R$ ZZZ   │
│   [João da Silva       ]         │ Frete      R$  10   │
│   [10/28]  [123]                 │ Impostos   R$  ZZ   │
│   Parcelamento: [1x] [até 12x]   │                      │
│   ☐ Salvar este cartão           │ TOTAL     R$ XXXX   │
│                                  │                      │
│   [Pagar]                        │ 🔒 Pagamento Seguro │
│                                  │                      │
│ ○ PIX (Desconto -2%)            │ ✓ Métodos:           │
│                                  │   • Cartão (até 12x) │
│ ○ Boleto Bancário               │   • PIX (-2%)        │
│                                  │   • Boleto           │
└──────────────────────────────────┴──────────────────────┘
```

### Opção 1: Cartão de Crédito

**Clicando em "Cartão de Crédito":**
```
┌──────────────────────────────────┐
│ ◉ Cartão de Crédito             │
│                                  │
│ [Número do Cartão]              │
│ [1234 5678 9012 3456]           │
│                                  │
│ [Nome do Titular]               │
│ [JOÃO SILVA OLIVEIRA]           │
│                                  │
│ [MM/YY]     [CVV]               │
│ [10/28]     [123]               │
│                                  │
│ Parcelamento:                    │
│ [1x R$ 999.99] [▼]              │
│ • 1x R$ 999.99                  │
│ • 2x R$ 499.99                  │
│ • 3x R$ 333.33                  │
│ • ... até 12x                   │
│                                  │
│ ☐ Salvar este cartão            │
│                                  │
│ [← Voltar] [Pagar R$ 999.99]    │
└──────────────────────────────────┘
```

### Opção 2: PIX

**Clicando em "PIX (Desconto -2%)":**
```
┌──────────────────────────────────┐
│ ◉ PIX (Desconto -2%)            │
│                                  │
│ ┌────────────────────────────┐   │
│ │                            │   │
│ │     ▌▌▌▌▌▌▌▌▌▌            │   │
│ │     ▌▌ QR CODE ▌▌          │   │
│ │     ▌▌▌▌▌▌▌▌▌▌            │   │
│ │                            │   │
│ │  Válido por: 30 minutos    │   │
│ │                            │   │
│ └────────────────────────────┘   │
│                                  │
│ Chave PIX (Cópia):              │
│ [12345678-1234-1234-1234-123456] │
│                          [COPIAR]│
│                                  │
│ Valor: R$ 979.99 (-2%)          │
│                                  │
│ [← Voltar] [Pagar com PIX]      │
└──────────────────────────────────┘
```

### Opção 3: Boleto Bancário

**Clicando em "Boleto Bancário":**
```
┌──────────────────────────────────┐
│ ◉ Boleto Bancário               │
│                                  │
│ Código de Barras:                │
│ 12345 67890 12345 67890 123456   │
│                                  │
│ Número do Boleto:                │
│ 1234.5678 9012.345 6789.012 34   │
│                                  │
│ Beneficiário: MERCANTIA          │
│ Cedente: SEU CPNJ                │
│                                  │
│ Valor: R$ 999.99                 │
│ Data de Vencimento:              │
│ 19/11/2025 (3 dias úteis)        │
│                                  │
│ Instruções:                       │
│ 1. Copie o código de barras      │
│ 2. Vá ao seu banco                │
│ 3. Cole no sistema               │
│ 4. Confirme o pagamento          │
│                                  │
│ [← Voltar] [Pagar com Boleto]   │
│            [Download PDF]        │
└──────────────────────────────────┘
```

**Clicando [Pagar] em qualquer opção:**
```
Processa pagamento via Pagar.me
  ↓
Se aprovado:
  ↓
POST /api/orders {
  shippingAddressId: "uuid-do-endereco",
  paymentId: "id-do-pagamento-pagarme"
}
  ↓
Redireciona para /my-orders?created={orderId}
```

---

## ✅ Tela 5: Meus Pedidos (`/my-orders`)

**Depois do Pagamento Aprovado:**
```
┌────────────────────────────────────────────┐
│ ✓ Meus Pedidos                             │
│   Seu pedido foi confirmado com sucesso!   │
├────────────────────────────────────────────┤
│                                            │
│ 🟢 Pedido #1234 (Confirmado)              │
│    Data: 16/11/2024                       │
│    Total: R$ 999.99                       │
│                                            │
│    Itens:                                  │
│    • Produto 1 x 1 - R$ 99.90             │
│    • Produto 2 x 2 - R$ 149.90            │
│                                            │
│    Endereço de Entrega:                   │
│    João Silva                             │
│    Av. Paulista, 1000                     │
│    São Paulo, SP 01311-100                │
│                                            │
│    Status: 📦 Processando                 │
│    Rastreamento: BR12345678901BR         │
│                                            │
│    [Ver Detalhes] [Rastrear] [Imprimir]  │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔄 Fluxo Completo (Resumido)

```
┌─────────────────┐
│  Marketplace    │
│   /marketplace  │
└────────┬────────┘
         │ Clica em [Adicionar]
         ↓
┌─────────────────┐
│    Carrinho     │
│    /cart        │
└────────┬────────┘
         │ Clica em [Ir para Checkout]
         ↓
┌─────────────────────────────────────────┐
│  Checkout - Passo 1                     │
│  Selecione Endereço                     │
│  /checkout (currentStep='shipping')     │
└────────┬────────────────────────────────┘
         │ Clica em [Continuar para Pagamento]
         ↓
┌─────────────────────────────────────────┐
│  Checkout - Passo 2                     │
│  Escolha Método de Pagamento            │
│  /checkout (currentStep='payment')      │
└────────┬────────────────────────────────┘
         │ Clica em [Pagar]
         ↓
    Processa Pagamento
    (Pagar.me)
         │
    ┌────┴────┐
    │          │
  ✓ OK       ✗ Erro
    │          │
    ↓          ↓
  Cria    Mostra Erro
  Pedido  Permite Tentar
    │     Novamente
    │
    ↓
┌─────────────────┐
│   My Orders     │
│   /my-orders    │
│  com status ✓   │
└─────────────────┘
```

---

## 🔗 Links de Navegação

| De | Para | Ação | Rota |
|----|------|------|------|
| Marketplace | Carrinho | Clica ícone carrinho | → `/cart` |
| Carrinho | Marketplace | Clica voltar | → `/marketplace` |
| Carrinho | Checkout | Clica "Ir para Checkout" | → `/checkout` |
| Checkout Passo 1 | Carrinho | Clica voltar | → `/cart` |
| Checkout Passo 1 | Checkout Passo 2 | Clica "Continuar" | → `/checkout` (state atualiza) |
| Checkout Passo 2 | Checkout Passo 1 | Clica voltar | → `/checkout` (state atualiza) |
| Checkout (após pagamento) | Meus Pedidos | Redirecionamento automático | → `/my-orders?created={id}` |

---

## 📊 Estrutura de Estado (React)

```typescript
// CheckoutPage (/checkout)
const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping')
const [shippingAddressId, setShippingAddressId] = useState<string | null>(null)
const [cart, setCart] = useState<CartData | null>(null)
const [paymentError, setPaymentError] = useState<string | null>(null)
const [submitting, setSubmitting] = useState(false)

// Quando clica "Continuar para Pagamento":
setShippingAddressId(addressId)
setCurrentStep('payment')

// Quando clica voltar do passo 2:
setCurrentStep('shipping')

// Quando pagamento é aprovado:
router.push(`/my-orders?created=${orderId}`)
```

---

## ✨ Recursos Implementados

✅ 2-step checkout flow
✅ Address cards com seleção visual
✅ Add/Edit/Delete addresses
✅ 3 métodos de pagamento (Cartão, PIX, Boleto)
✅ Step indicator progressivo
✅ Order summary sidebar
✅ Mobile responsive
✅ Portuguese UI completo
✅ Validação com Zod
✅ Error handling
✅ Loading states
✅ Pagar.me integration

---

## 🚀 Para Testar

1. Acesse `/marketplace` e adicione produtos ao carrinho
2. Clique no ícone do carrinho ou acesse `/cart`
3. Clique em "Ir para Checkout"
4. Selecione um endereço ou adicione um novo
5. Clique em "Continuar para Pagamento"
6. Escolha um método de pagamento
7. Clique em "Pagar"
8. Após aprovação, será redirecionado para `/my-orders`

---

## 📱 Responsividade

- **Desktop:** 3 colunas (formulário + sidebar)
- **Tablet:** 2 colunas (formulário + sidebar empilhado)
- **Mobile:** 1 coluna (full-width com scroll)

---

## 🔐 Segurança

✅ Autenticação via `x-user-id` header
✅ Validação Zod
✅ Números de cartão não armazenados (Pagar.me)
✅ Dados criptografados
✅ HTTPS em produção

---

## 📋 Build Status

✅ **Compilação Completa:** 65 rotas compiladas com sucesso!
