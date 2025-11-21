import * as pagarme from 'pagarme'

let client: any = null

/**
 * Inicializa o cliente Pagar.me
 */
export async function initializePagarmeClient() { 
  if (client) return client

  try {
    // Pagar.me SDK v4 uses direct module usage
    client = pagarme
    console.log('✅ Pagar.me client initialized successfully')
    return client
  } catch (error) {
    console.error('❌ Error initializing Pagar.me client:', error)
    throw error
  }
}

/**
 * Processa pagamento com cartão de crédito
 */
export async function processCardPayment(
  cardNumber: string,
  cardholderName: string,
  expiryMonth: number,
  expiryYear: number,
  cvv: string,
  amount: number,
  installments: number = 1,
  customerId?: string,
  orderId?: string
) {
  const pagarmeClient = await initializePagarmeClient() 

  try {
    // Create customer first
    const customer = await pagarmeClient.customers.create({
      name: cardholderName,
      email: `customer@mercantia.local`,
      type: 'individual',
    })

    // Create card
    const card = await pagarmeClient.cards.create({
      customer_id: customer.id,
      holder_name: cardholderName,
      number: cardNumber.replace(/\s/g, ''),
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvv: cvv,
    })

    // Create charge with credit card
    const charge = await pagarmeClient.transactions.create({
      amount: amount,
      payment_method: 'credit_card',
      credit_card: {
        card_id: card.id,
        installments: installments,
      },
      customer_id: customer.id,
      metadata: {
        order_id: orderId || 'unknown',
      },
    })

    console.log('✅ Card payment processed:', charge.id)

    return {
      transactionId: charge.id,
      status: charge.status,
      amount: charge.amount,
      installments: installments,
      paidAmount: charge.paid_amount,
      refundedAmount: charge.refunded_amount,
    }
  } catch (error) {
    console.error('❌ Card payment error:', error)
    throw error
  }
}

/**
 * Gera uma cobrança PIX
 */
export async function generatePixCharge(
  amount: number,
  customerId?: string,
  orderId?: string
) {
  const pagarmeClient = await initializePagarmeClient() 

  // Criar um customer ID único
  const externalId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // Criar customer com external_id obrigatório
    const customer = await pagarmeClient.customers.create({
      name: 'Customer Test',
      email: `customer_${Date.now()}@mercantia.local`,
      type: 'individual',
      external_id: externalId,
    })

    console.log('✅ Customer created:', customer.id)

    // Criar transação PIX
    const transaction = await pagarmeClient.transactions.create({
      amount: amount,
      payment_method: 'pix',
      customer_id: customer.id,
      metadata: {
        order_id: orderId || 'unknown',
        external_id: externalId,
      },
    })

    console.log('✅ PIX transaction generated:', transaction.id)

    return {
      transactionId: transaction.id,
      pixKey: transaction.pix_key, 
      qrCode: transaction.pix_qr_code, 
      expiresAt: transaction.pix_expires_at ? new Date(transaction.pix_expires_at) : new Date(Date.now() + 30 * 60 * 1000),
      status: transaction.status,
    }
  } catch (error: any) {
    console.error('❌ PIX transaction error:', error)
    
    // Verificar se é erro de IP não autorizado
    if (error.response?.errors?.[0]?.message?.includes('IP de origem não autorizado')) {
      throw new Error('IP de origem não autorizado. Configure o IP no painel do Pagar.me ou use uma VPN.')
    }
    
    // Re-lançar o erro original
    throw error
  }
}

/**
 * Gera um boleto
 */
export async function generateBoleto(
  amount: number,
  customerId?: string,
  orderId?: string
) {
  const pagarmeClient = await initializePagarmeClient() 

  try {
    // Calculate due date (3 business days)
    const dueDate = new Date()
    let businessDaysAdded = 0
    while (businessDaysAdded < 3) {
      dueDate.setDate(dueDate.getDate() + 1)
      const dayOfWeek = dueDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDaysAdded++
      }
    }

    // Create customer
    const customer = await pagarmeClient.customers.create({
      name: 'Customer',
      email: 'customer@mercantia.local',
      type: 'individual',
    })

    // Create boleto transaction
    const transaction = await pagarmeClient.transactions.create({
      amount: amount,
      payment_method: 'boleto',
      boleto: {
        due_date: dueDate.toISOString().split('T')[0],
        instructions: 'Pagável em qualquer banco. Não receber após a data de vencimento.',
      },
      customer_id: customer.id,
      metadata: {
        order_id: orderId || 'unknown',
      },
    })

    console.log('✅ Boleto transaction generated:', transaction.id)

    return {
      transactionId: transaction.id,
      boletoNumber: transaction.boleto_boleto_line || 'N/A',
      barcode: transaction.boleto_barcode || 'N/A',
      dueDate: dueDate.toLocaleDateString('pt-BR'),
      pdfUrl: transaction.boleto_url || null,
      status: transaction.status,
    }
  } catch (error) {
    console.error('❌ Boleto generation error:', error)
    
    // Verificar se é erro de IP não autorizado
    if (error.response?.errors?.[0]?.message?.includes('IP de origem não autorizado')) {
      throw new Error('IP de origem não autorizado. Configure o IP no painel do Pagar.me ou use uma VPN.')
    }
    
    throw error
  }
}

/**
 * Consulta status de uma transação
 */
export async function getTransactionStatus(transactionId: string) {
  const pagarmeClient = await initializePagarmeClient() 

  try {
    const transaction = await pagarmeClient.transactions.find({
      id: transactionId
    })

    return {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      paidAmount: transaction.paid_amount,
      refundedAmount: transaction.refunded_amount,
      paymentMethod: transaction.payment_method,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    }
  } catch (error) {
    console.error('❌ Error getting transaction status:', error)
    throw error
  }
}

/**
 * Processa reembolso de uma transação
 */
export async function refundTransaction(transactionId: string, amount?: number) {
  const pagarmeClient = await initializePagarmeClient() 

  try {
    const refund = await pagarmeClient.refunds.create({
      transaction_id: transactionId,
      amount: amount, // Se não informar, reembolsa o valor total
    })

    console.log('✅ Transaction refunded:', refund.id)

    return {
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
      reason: refund.reason,
    }
  } catch (error) {
    console.error('❌ Refund error:', error)
    throw error
  }
}
