import * as pagarme from 'pagarme'

let client: any = null

/**
 * Inicializa o cliente Pagar.me
 */
export async function initializePagarmeClient() { 
  if (client) return client

  try {
    // Get API keys from environment variables
    const apiKey = process.env.PAGARME_SECRET_KEY || process.env.PAGARME_API_KEY
    const environment = process.env.PAGARME_ENVIRONMENT || 'sandbox'
    
    if (!apiKey) {
      throw new Error('PAGARME_SECRET_KEY ou PAGARME_API_KEY não encontrada nas variáveis de ambiente')
    }

    console.log('🔑 API Key found:', apiKey ? '✅' : '❌')
    console.log('🌍 Environment:', environment)
    
    // Pagar.me SDK v4 uses direct module usage with apiKey
    client = pagarme.connect({
      apiKey: apiKey,
      environment: environment
    })
    
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
 * Gera uma cobrança PIX (versão melhorada)
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
    console.log('🔄 Generating PIX charge for amount:', amount)
    
    // Estrutura robusta para PIX
    const transactionData = {
      amount: amount,
      payment_method: 'pix',
      customer: {
        name: 'Customer Test',
        email: `customer_${Date.now()}@mercantia.local`,
        type: 'individual',
        external_id: externalId,
      },
      metadata: {
        order_id: orderId || 'unknown',
        external_id: externalId,
      },
      // Configurações específicas do PIX
      pix: {
        expires_in: 3600, // 1 hora
      }
    }

    console.log('📤 Transaction data:', JSON.stringify(transactionData, null, 2))

    // Criar transação PIX
    const transaction = await pagarmeClient.transactions.create(transactionData)

    console.log('✅ PIX transaction generated:', transaction.id)
    console.log('📋 PIX response:', JSON.stringify(transaction, null, 2))

    // Extrair dados do PIX de forma robusta
    const pixData = transaction.pix || transaction.pix_qr_code || transaction
    
    return {
      transactionId: transaction.id,
      pixKey: pixData.pix_key || pixData.key, 
      qrCode: pixData.pix_qr_code || pixData.qr_code,
      qrCodeImage: pixData.pix_qr_code_base64 || pixData.qr_code_base64,
      expiresAt: transaction.pix_expires_at ? new Date(transaction.pix_expires_at) : new Date(Date.now() + 30 * 60 * 1000),
      status: transaction.status,
      amount: transaction.amount,
    }
  } catch (error: any) {
    console.error('❌ PIX transaction error:', error)
    
    // Log detailed error information
    console.error('📋 Full error object:', JSON.stringify(error, null, 2))
    
    if (error.response) {
      console.error('📋 Error response details:', JSON.stringify(error.response, null, 2))
    }
    
    if (error.response?.errors) {
      console.error('📋 API errors:', JSON.stringify(error.response.errors, null, 2))
    }
    
    // Extrair mensagem de erro clara
    let errorMessage = 'Unknown error'
    
    if (error.response?.errors && Array.isArray(error.response.errors)) {
      errorMessage = error.response.errors[0]?.message || 'API Error'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    console.error('📋 Extracted error message:', errorMessage)
    
    // Verificar se é erro de autorização (401)
    if (error.response?.status === 401 || errorMessage.includes('Authorization') || errorMessage.includes('denied')) {
      throw new Error('Erro 401 - Autorização negada. Verifique as chaves de API (PAGARME_SECRET_KEY ou PAGARME_API_KEY) no Vercel.')
    }
    
    // Verificar se é erro de IP não autorizado
    if (errorMessage.includes('IP de origem não autorizado') || 
        errorMessage.includes('origin IP') ||
        errorMessage.includes('unauthorized')) {
      throw new Error('IP de origem não autorizado. Configure o IP no painel do Pagar.me (Settings → Security → Allowed IPs) ou adicione 76.76.19.0/20 para Vercel.')
    }
    
    // Verificar outros erros comuns
    if (errorMessage.includes('API key') || errorMessage.includes('chave')) {
      throw new Error('Chave API inválida. Verifique PAGARME_API_KEY e PAGARME_SECRET_KEY no Vercel.')
    }
    
    if (errorMessage.includes('amount') || errorMessage.includes('valor')) {
      throw new Error('Valor inválido para transação. Verifique o amount enviado.')
    }
    
    if (errorMessage.includes('payment_method') || errorMessage.includes('pix')) {
      throw new Error('Método de pagamento PIX não disponível. Verifique a conta no Pagar.me.')
    }
    
    // Re-lançar o erro original com mais contexto
    const enhancedError = new Error(`Pagar.me API Error (${error.status || 'Unknown Status'}): ${errorMessage}`)
    enhancedError.cause = error
    throw enhancedError
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
