import * as pagarme from 'pagarme'

let client: any = null

/**
 * Inicializa o cliente Pagar.me com múltiplos métodos
 */
export async function initializePagarmeClient() { 
  if (client) return client

  try {
    // Get API keys from environment variables
    const secretKey = process.env.PAGARME_SECRET_KEY
    const apiKey = process.env.PAGARME_API_KEY
    const environment = process.env.PAGARME_ENVIRONMENT || 'sandbox'
    
    console.log('🔑 Environment variables check:')
    console.log('  - PAGARME_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 10)}...` : '❌ MISSING')
    console.log('  - PAGARME_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : '❌ MISSING') 
    console.log('  - Environment:', environment)
    
    if (!secretKey && !apiKey) {
      throw new Error('PAGARME_SECRET_KEY ou PAGARME_API_KEY não encontrada nas variáveis de ambiente')
    }

    // Try different initialization methods for Pagar.me SDK
    let initializedClient = null
    
    // Method 1: Direct module usage (most common)
    try {
      initializedClient = pagarme
      console.log('✅ Method 1: Direct module initialized')
    } catch (error) {
      console.log('❌ Method 1 failed:', error.message)
    }

    // Method 2: With credentials
    if (!initializedClient && secretKey) {
      try {
        initializedClient = pagarme(secretKey)
        console.log('✅ Method 2: Initialized with secret key')
      } catch (error) {
        console.log('❌ Method 2 failed:', error.message)
      }
    }

    // Method 3: With API key
    if (!initializedClient && apiKey) {
      try {
        initializedClient = pagarme(apiKey)
        console.log('✅ Method 3: Initialized with API key')
      } catch (error) {
        console.log('❌ Method 3 failed:', error.message)
      }
    }

    // Method 4: With options object
    if (!initializedClient && (secretKey || apiKey)) {
      try {
        const key = secretKey || apiKey
        initializedClient = pagarme({
          apiKey: key,
          environment: environment
        })
        console.log('✅ Method 4: Initialized with options object')
      } catch (error) {
        console.log('❌ Method 4 failed:', error.message)
      }
    }

    if (!initializedClient) {
      throw new Error('Failed to initialize Pagar.me client with any method')
    }

    client = initializedClient
    console.log('✅ Pagar.me client initialized successfully')
    
    // Note: Removed balance test as it doesn't exist in v4.35.0
    // The real test will be the transaction itself
    
    return client
  } catch (error) {
    console.error('❌ Error initializing Pagar.me client:', error)
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      name: error.name
    })
    throw error
  }
}

/**
 * Testa a conexão com o Pagar.me (sem balance API)
 */
export async function testPagarMeConnection() {
  try {
    const client = await initializePagarmeClient()
    
    // Test connection with a simple transaction attempt (will fail but shows if keys work)
    console.log('🧪 Testing connection with basic transaction...')
    const testTransaction = {
      amount: 100, // Minimum amount
      payment_method: 'credit_card',
      credit_card: {
        number: '4242424242424242',
        holder_name: 'Test User',
        exp_month: 12,
        exp_year: 2030,
        cvv: 123,
      }
    }
    
    try {
      await client.transactions.create(testTransaction)
      // Should fail but shows the API is responding
    } catch (testError) {
      // We expect this to fail, but it shows if the connection works
      if (testError.response?.status === 401) {
        return {
          success: false,
          errorType: 'Authentication Error',
          message: 'Chaves de API inválidas ou expiradas',
          fullError: testError.message,
          status: 401
        }
      }
    }
    
    return {
      success: true,
      message: 'API connection successful - keys valid'
    }
  } catch (error) {
    console.error('❌ API connection test failed:', error)
    
    // Provide detailed error analysis
    let errorType = 'Unknown'
    let errorMessage = error.message
    
    if (error.response?.status === 401) {
      errorType = 'Authentication Error'
      errorMessage = 'Chaves de API inválidas ou expiradas'
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('DNS')) {
      errorType = 'Network Error' 
      errorMessage = 'Problema de conectividade de rede'
    } else if (error.response?.status === 403) {
      errorType = 'Authorization Error'
      errorMessage = 'IP não autorizado ou conta suspensa'
    }
    
    return {
      success: false,
      errorType: errorType,
      message: errorMessage,
      fullError: error.message,
      status: error.response?.status
    }
  }
}

/**
 * Gera uma cobrança PIX (versão corrigida sem balance test)
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
    
    // Estrutura simplificada para PIX
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
      throw new Error('ERRO 401 - Chaves de API inválidas. Verifique PAGARME_SECRET_KEY no Vercel. As chaves devem começar com "sk_test_" para sandbox.')
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
