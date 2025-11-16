import PagarmeApiSDK from 'pagarme'

let client: any = null

/**
 * Inicializa o cliente Pagar.me
 */
export function initializePagarmeClient() {
  if (client) return client

  try {
    client = new PagarmeApiSDK.Client({
      basicAuthCredentials: {
        username: process.env.PAGARME_API_KEY || '',
        password: process.env.PAGARME_SECRET_KEY || '',
      },
      timeout: 30000,
      httpClientOptions: {
        timeout: 30000,
      },
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
  const pagarmeClient = initializePagarmeClient()

  try {
    // Criar cliente se não existir
    let customer = null
    if (customerId) {
      try {
        customer = await pagarmeClient.customers.getCustomer(customerId)
      } catch (error) {
        console.log('Customer not found, creating new one')
        customer = null
      }
    }

    // Se não tem cliente, cria um novo
    if (!customer) {
      customer = await pagarmeClient.customers.createCustomer({
        name: cardholderName,
        email: `customer@mercantia.local`, // Você pode melhorar isso
        type: 'individual',
      })
    }

    // Criar cobrança com cartão de crédito
    const charge = await pagarmeClient.charges.createCharge({
      amount: amount,
      payment_method: 'credit_card',
      credit_card: {
        card_number: cardNumber.replace(/\s/g, ''),
        holder_name: cardholderName,
        exp_month: expiryMonth,
        exp_year: expiryYear,
        cvv: cvv,
      },
      customer_id: customer.id,
      installments: installments,
      metadata: {
        order_id: orderId || 'unknown',
      },
    })

    console.log('✅ Card payment processed:', charge.id)

    return {
      transactionId: charge.id,
      status: charge.status,
      amount: charge.amount,
      installments: charge.installments,
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
  const pagarmeClient = initializePagarmeClient()

  try {
    // Criar cliente se não existir
    let customer = null
    if (customerId) {
      try {
        customer = await pagarmeClient.customers.getCustomer(customerId)
      } catch (error) {
        console.log('Customer not found, creating new one')
        customer = null
      }
    }

    // Se não tem cliente, cria um novo
    if (!customer) {
      customer = await pagarmeClient.customers.createCustomer({
        name: 'Customer',
        email: 'customer@mercantia.local',
        type: 'individual',
      })
    }

    // Criar cobrança PIX
    const charge = await pagarmeClient.charges.createCharge({
      amount: amount,
      payment_method: 'pix',
      pix: {
        expires_in: 1800, // 30 minutos
      },
      customer_id: customer.id,
      metadata: {
        order_id: orderId || 'unknown',
      },
    })

    console.log('✅ PIX charge generated:', charge.id)

    return {
      transactionId: charge.id,
      pixKey: charge.qr_code, // Pode variar conforme resposta da API
      qrCode: charge.qr_code_url,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      status: charge.status,
    }
  } catch (error) {
    console.error('❌ PIX charge error:', error)
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
  const pagarmeClient = initializePagarmeClient()

  try {
    // Calcular data de vencimento (3 dias úteis)
    const dueDate = new Date()
    let businessDaysAdded = 0
    while (businessDaysAdded < 3) {
      dueDate.setDate(dueDate.getDate() + 1)
      const dayOfWeek = dueDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDaysAdded++
      }
    }

    // Criar cliente se não existir
    let customer = null
    if (customerId) {
      try {
        customer = await pagarmeClient.customers.getCustomer(customerId)
      } catch (error) {
        console.log('Customer not found, creating new one')
        customer = null
      }
    }

    // Se não tem cliente, cria um novo
    if (!customer) {
      customer = await pagarmeClient.customers.createCustomer({
        name: 'Customer',
        email: 'customer@mercantia.local',
        type: 'individual',
      })
    }

    // Criar cobrança com boleto
    const charge = await pagarmeClient.charges.createCharge({
      amount: amount,
      payment_method: 'boleto',
      boleto: {
        due_date: dueDate.toISOString().split('T')[0],
        instructions: 'Pagável em qualquer banco. Não receber após a data de vencimento.',
        bank_account: {
          account: '123456',
          account_digit: '1',
          bank_code: '001',
          holder_document: '00000000000000',
          holder_name: 'Mercantia',
          type: 'checking',
        },
      },
      customer_id: customer.id,
      metadata: {
        order_id: orderId || 'unknown',
      },
    })

    console.log('✅ Boleto generated:', charge.id)

    return {
      transactionId: charge.id,
      boletoNumber: charge.boleto?.boleto_line || 'N/A',
      barcode: charge.boleto?.barcode || 'N/A',
      dueDate: dueDate.toLocaleDateString('pt-BR'),
      pdfUrl: charge.boleto?.pdf?.url || null,
      status: charge.status,
    }
  } catch (error) {
    console.error('❌ Boleto generation error:', error)
    throw error
  }
}

/**
 * Consulta status de uma cobrança
 */
export async function getChargeStatus(chargeId: string) {
  const pagarmeClient = initializePagarmeClient()

  try {
    const charge = await pagarmeClient.charges.getCharge(chargeId)

    return {
      id: charge.id,
      status: charge.status,
      amount: charge.amount,
      paidAmount: charge.paid_amount,
      refundedAmount: charge.refunded_amount,
      paymentMethod: charge.payment_method,
      createdAt: charge.created_at,
      updatedAt: charge.updated_at,
    }
  } catch (error) {
    console.error('❌ Error getting charge status:', error)
    throw error
  }
}

/**
 * Processa reembolso de uma cobrança
 */
export async function refundCharge(chargeId: string, amount?: number) {
  const pagarmeClient = initializePagarmeClient()

  try {
    const refund = await pagarmeClient.charges.refundCharge(chargeId, {
      amount: amount, // Se não informar, reembolsa o valor total
    })

    console.log('✅ Charge refunded:', refund.id)

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
