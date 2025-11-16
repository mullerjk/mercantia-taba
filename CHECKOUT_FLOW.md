# Fluxo Completo de Checkout

## 📋 Visão Geral

O checkout foi implementado com um fluxo de 2 passos, oferecendo uma experiência clara e segura ao cliente:

```
Carrinho → Endereço → Pagamento → Confirmação
```

---

## 🛒 Passo 1: Carrinho (Cart Page)

**Rota:** `/dashboard/cart`

### Componentes:
- **CartSummary**: Lista de itens com opções de editar quantidade ou remover
- **Order Summary Sidebar**:
  - Subtotal
  - Mensagem sobre frete e impostos calculados no checkout
  - Botão "Proceed to Checkout"

### Funcionalidades:
- ✅ Listar itens do carrinho
- ✅ Remover itens
- ✅ Atualizar quantidade
- ✅ Navegar para checkout

---

## 📍 Passo 2: Endereço de Entrega (Step 1 do Checkout)

**Rota:** `/dashboard/checkout` (Passo 1)

### Componentes:
- **ShippingForm**: Wrapper que contém o AddressSelector
- **AddressSelector**: Gerenciador de endereços com:
  - **AddressCard**: Mini card para cada endereço salvo
  - **AddressForm**: Formulário para criar/editar endereços
- **Order Summary Sidebar**: Resumo com lista de itens e totais

### Fluxo do Usuário:

#### Cenário A: Usuário com endereços salvos
1. Vê lista de endereços em cards (1 coluna mobile, 2 colunas desktop)
2. Cada card mostra:
   - Nome completo
   - Rua e número
   - Cidade, estado, CEP
   - País
   - Telefone (opcional)
   - Badge "Padrão" se aplicável
   - Checkmark de seleção
   - Botões Editar e Remover

3. Seleciona um dos endereços (clicando no card)
4. Clica em "Continuar para Pagamento"

#### Cenário B: Primeiro endereço
1. Vê mensagem "Adicione um endereço para continuar"
2. Clica em "Adicionar Primeiro Endereço"
3. Preenche formulário com:
   - Nome Completo *
   - Email (opcional)
   - Telefone (opcional)
   - CEP *
   - Rua e Número *
   - Cidade *
   - Estado (UF) *
   - País *
   - Checkbox "Definir como endereço padrão"

4. Clica em "Adicionar Endereço"
5. Endereço é criado via `POST /api/shipping-addresses`
6. Nova compra é adicionada à lista
7. É selecionado automaticamente
8. Clica em "Continuar para Pagamento"

#### Cenário C: Adicionar novo endereço
1. Clica em "Adicionar Novo Endereço"
2. Formulário abre
3. Preenche dados (ver Cenário B)
4. Clica em "Adicionar Endereço"
5. É selecionado automaticamente
6. Clica em "Continuar para Pagamento"

#### Cenário D: Editar endereço
1. No card do endereço, clica em "Editar"
2. Formulário abre com dados pré-preenchidos
3. Altera dados desejados
4. Clica em "Atualizar Endereço"
5. Endereço é atualizado via `PATCH /api/shipping-addresses/[id]`
6. Lista de endereços é atualizada
7. Clica em "Continuar para Pagamento"

#### Cenário E: Remover endereço
1. No card do endereço, clica em "Remover"
2. Diálogo de confirmação aparece
3. Confirma exclusão
4. Endereço é deletado via `DELETE /api/shipping-addresses/[id]`
5. Se era o selecionado, outro é selecionado automaticamente
6. Lista é atualizada

### Validação:
- Todos os campos obrigatórios validados com Zod
- Mensagens de erro inline
- Usuário só pode proceder após selecionar um endereço

---

## 💳 Passo 3: Método de Pagamento (Step 2 do Checkout)

**Rota:** `/dashboard/checkout` (Passo 2)

### Componentes:
- **PaymentMethodSelector**: Radio group com 3 opções:
  1. **Cartão de Crédito** → CreditCardForm
  2. **PIX** → PIXForm
  3. **Boleto** → BoletoForm

- **Order Summary Sidebar**: Resumo com:
  - Lista de itens
  - Subtotal, frete, impostos
  - **Total em destaque**
  - Card de segurança
  - Card com informações dos métodos de pagamento

### Métodos de Pagamento:

#### 1️⃣ Cartão de Crédito
**Formulário:**
- Número do Cartão (com máscara e validação Luhn)
- Nome do Titular
- Data de Expiração (MM/YY)
- CVV (mascarado)
- Seletor de Parcelamento (1-12x)
- Checkbox "Salvar este cartão"

**Features:**
- Validação em tempo real
- Formatação automática
- Cálculo de juros por parcela
- Integração com Pagar.me

#### 2️⃣ PIX
**Exibição:**
- QR Code gerado dinamicamente
- Chave PIX para cópia
- Valor com desconto de 2%
- Validade: 30 minutos
- Instruções de uso

**Features:**
- Geração de QR Code instantânea
- Copy-to-clipboard da chave
- Contador de tempo
- Integração com Pagar.me

#### 3️⃣ Boleto Bancário
**Exibição:**
- Número do Boleto
- Código de Barras (numérico)
- Data de Vencimento (3 dias úteis)
- Link para download do PDF
- Instruções de pagamento

**Features:**
- Geração instantânea
- Formatação ABNT
- Download em PDF
- Integração com Pagar.me

### Step Indicator:
```
Passo 1 ✓ Endereço  ─────  Passo 2 ◉ Pagamento
```

- Mostra progresso visual
- Permite voltar ao passo anterior (clique na seta ou Step 1)
- Ao voltar, mantém o endereço selecionado

---

## ✅ Confirmação (Após Pagamento Aprovado)

1. Pagamento é processado
2. Pedido é criado via `POST /api/orders` com:
   - `shippingAddressId`: ID do endereço selecionado
   - `paymentId`: ID do pagamento do Pagar.me
3. Usuário é redirecionado para `/my-orders?created={orderId}`
4. Pedido aparece no histórico com status "Confirmado"

---

## 🔌 API Endpoints

### Endereços

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/shipping-addresses` | Lista endereços do usuário |
| POST | `/api/shipping-addresses` | Cria novo endereço |
| PATCH | `/api/shipping-addresses/[id]` | Atualiza endereço |
| DELETE | `/api/shipping-addresses/[id]` | Deleta endereço |

### Pagamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/payments/card` | Processa pagamento com cartão |
| POST | `/api/payments/pix` | Gera PIX |
| POST | `/api/payments/boleto` | Gera boleto |

### Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/orders` | Cria pedido após pagamento |

---

## 🗄️ Estrutura de Banco de Dados

### Tabela: shipping_addresses
```sql
CREATE TABLE shipping_addresses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),

  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,

  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔒 Segurança

### Autenticação
- Todos os endpoints requerem header `x-user-id`
- Usuário só pode acessar/modificar seus próprios dados

### Validação
- Zod schema validation em todos os campos
- Validação Luhn para cartões
- Validação de email

### Proteção
- Números de cartão não são armazenados (Pagar.me)
- Dados de pagamento são criptografados (Pagar.me)
- HTTPS obrigatório em produção
- CSP headers configurados

---

## 📊 Fluxo Resumido

```
                    ┌─────────────────┐
                    │   Cart Page     │
                    │ /dashboard/cart │
                    └────────┬────────┘
                             │
                    "Proceed to Checkout"
                             │
                    ┌────────▼──────────┐
                    │ Checkout Page     │
                    │ /dashboard/checkout
                    └────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              │      Step 1: Address       │
              │  (ShippingForm +           │
              │   AddressSelector)         │
              │                            │
              │ ├─ List saved addresses    │
              │ ├─ Select address          │
              │ ├─ Add new address         │
              │ ├─ Edit address            │
              │ └─ Delete address          │
              │                            │
              │      Click "Continuar     │
              │      para Pagamento"      │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      Step 2: Payment        │
              │  (PaymentMethodSelector)    │
              │                             │
              │ ├─ Credit Card              │
              │ ├─ PIX                      │
              │ └─ Boleto                   │
              │                             │
              │   Click "Pagar"             │
              └──────────────┬──────────────┘
                             │
                  "Processing Payment..."
                             │
              ┌──────────────▼──────────────┐
              │    Order Confirmation      │
              │    /dashboard/my-orders    │
              │                             │
              │ ✓ Pedido Criado             │
              │ ✓ Endereço confirmado      │
              │ ✓ Pagamento processado     │
              └─────────────────────────────┘
```

---

## 🎨 UI Components Layout

### Desktop (3 colunas)
```
┌─────────────────────────────────────────┐
│ Back  Finalizar Compra                  │
│       Passo 1: Selecione endereço       │
└─────────────────────────────────────────┘

┌────────────────────────────────────────────┬──────────────────┐
│                                            │ Resumo do Pedido │
│ ┌──────────────────────────────────────┐  │                  │
│ │ Endereço de Entrega                  │  │ Item 1: R$ XX    │
│ │                                      │  │ Item 2: R$ XX    │
│ │ ┌─────────────────┐ ┌─────────────┐ │  │                  │
│ │ │ Address Card 1  │ │ Address Card│ │  │ Subtotal: R$ XXX │
│ │ │ (selected)      │ │     2       │ │  │ Frete:    R$ X   │
│ │ └─────────────────┘ └─────────────┘ │  │ Impostos: R$ X   │
│ │                                      │  │                  │
│ │ [+ Adicionar Novo Endereço]          │  │ Total: R$ XXXX   │
│ │                                      │  │                  │
│ │              [Continuar → Pagamento] │  │ 🔒 Pagamento... │
│ └──────────────────────────────────────┘  │                  │
│                                            │ ✓ Métodos:       │
│                                            │   • Cartão (12x) │
│                                            │   • PIX (-2%)    │
│                                            │   • Boleto       │
└────────────────────────────────────────────┴──────────────────┘
```

### Mobile (1 coluna)
```
┌──────────────────────────────────────┐
│ ◀ Finalizar Compra                   │
│   Passo 1: Selecione endereço        │
└──────────────────────────────────────┘

Passo 1 ◉ Endereço ─── Passo 2 ○ Pagamento

┌──────────────────────────────────────┐
│ Endereço de Entrega                  │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ Address Card 1 (selected)      │   │
│ │                                │   │
│ │ [Editar] [Remover]             │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ Address Card 2                 │   │
│ │                                │   │
│ │ [Editar] [Remover]             │   │
│ └────────────────────────────────┘   │
│                                      │
│ [+ Adicionar Novo Endereço]          │
│ [Continuar → Pagamento]              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Resumo do Pedido                     │
│                                      │
│ Item 1       x1        R$ XX.XX      │
│ Item 2       x2        R$ XX.XX      │
│                                      │
│ Subtotal          R$ XXX.XX          │
│ Frete             R$   X.XX          │
│ Impostos          R$   X.XX          │
│                                      │
│ Total            R$ XXXX.XX          │
└──────────────────────────────────────┘
```

---

## ✨ Features Implementadas

### ✅ Completo
- [x] 2-step checkout flow
- [x] Address selection com AddressCard mini-cards
- [x] Add/Edit/Delete addresses com forms
- [x] Payment method selector (Card, PIX, Boleto)
- [x] Order summary sidebar
- [x] Step indicator visual
- [x] Portuguese UI labels
- [x] Mobile responsive
- [x] API endpoints (GET, POST, PATCH, DELETE)
- [x] Validation com Zod
- [x] Error handling
- [x] Loading states
- [x] Default address management
- [x] Order creation after payment

### 🚀 Ready for
- [ ] Pagar.me API keys configuration
- [ ] Webhook integration for payment confirmations
- [ ] Email notifications
- [ ] Admin order management
- [ ] Shipping tracking

---

## 🧪 Testing Checklist

### Address Selection
- [ ] Load and display saved addresses
- [ ] Select address from list
- [ ] Auto-select default address
- [ ] Edit address
- [ ] Delete address with confirmation
- [ ] Add new address
- [ ] Mark address as default
- [ ] Navigate to payment step

### Payment Methods
- [ ] Display all 3 payment methods
- [ ] Select credit card option
- [ ] Select PIX option
- [ ] Select Boleto option
- [ ] Back button returns to address step
- [ ] Validate form fields

### Order Creation
- [ ] Successful payment creates order
- [ ] Order has correct shipping address
- [ ] Order has correct payment method
- [ ] User is redirected to my-orders
- [ ] Order appears in order history

### UI/UX
- [ ] Mobile responsive (1 column)
- [ ] Desktop layout (3 columns)
- [ ] Step indicator shows progress
- [ ] Error messages are clear
- [ ] Loading states are visible
- [ ] Security notice is visible

---

## 📝 Notes

- Database migration needed: `npx drizzle-kit migrate:sqlite`
- Pagar.me API keys must be in `.env.local`
- All prices in cents (e.g., R$ 10.00 = 1000)
- Default shipping: R$ 10.00
- Default tax: 10% of subtotal
- PIX discount: 2% applied automatically
- Boleto validity: 3 business days
