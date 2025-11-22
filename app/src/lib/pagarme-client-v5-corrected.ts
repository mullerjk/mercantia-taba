import axios from 'axios'

/**
 * Cliente Pagar.me API v5 CORRIGIDO
 * Usa a estrutura correta baseada no teste local que funcionou
 */
class PagarMeV5ClientFixed {
  private apiKey: string
  private baseURL = 'https://api.pagar.me/core/v5'
  private axiosInstance

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mercantia-TABA/1.0'
      },
      timeout: 30000
    })
  }

  /**
   * Gera uma cobrança PIX usando API v5 ESTRUTURA CORRIGIDA
   * Baseado no teste local que criou Order ID: or_r7eaXGVinirANwV8
   */
  async createPixCharge(amount: number, customerData: any, metadata: any = {}) {
    try {
      console.log('🔄 Creating PIX charge with Pagar.me v5 API (CORRECTED)...')
      console.log('🌍 Using base URL:', this.baseURL)
      console.log('🔑 API Key prefix:', this.apiKey.substring(0, 10) + '...')

      // ESTRUTURA CORRETA baseada no teste local
      const requestData = {
        items: [
          {
            description: 'Test Product',
            quantity: 1,
            amount: amount  // API v5 usa 'amount', não 'unit_price'
          }
        ],
        customer: customerData,
        payments: [
          {
            payment_method: 'pix',
            pix: {
              expires_in: 3600  // 1 hora
            }
          }
        ],
        metadata: {
          source: 'mercantia_app',
          ...metadata
        }
      }

      console.log('📤 V5 CORRECTED Request data:', JSON.stringify(requestData, null, 2))

      const response = await this.axiosInstance.post('/orders', requestData)

      console.log('✅ V5 CORRECTED Response received:', JSON.stringify(response.data, null, 2))

      // Extrair dados do PIX da resposta v5
      const pixPayment = response.data.payments?.find((p: any) => p.payment_method === 'pix')

      return {
        transactionId: response.data.id,
        orderId: response.data.id,
        pixKey: pixPayment?.pix_key || 'N/A',
        qrCode: pixPayment?.qr_code || 'N/A',
        qrCodeImage: pixPayment?.qr_code_base64 || 'N/A',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos fallback
        status: response.data.status,
        amount: amount,
        totalAmount: response.data.total_amount,
        items: response.data.items,
        payments: response.data.payments,
        v5Response: response.data
      }
    } catch (error: any) {
      console.error('❌ V5 CORRECTED API Error:', error.response?.data || error.message)
      
      // Log detalhes do erro
      if (error.response) {
        console.error('📋 Error status:', error.response.status)
        console.error('📋 Error headers:', error.response.headers)
        console.error('📋 Error data:', JSON.stringify(error.response.data, null, 2))
      }

      throw error
    }

  }

  /**
   * Testa conectividade com API v5 usando endpoint correto
   */
  async testConnection() {
    try {
      console.log('🧪 Testing Pagar.me v5 API connection (CORRECTED)...')
      
      // API v5 não tem /balance, testar com /orders
      const response = await this.axiosInstance.get('/orders?limit=1')
      console.log('✅ V5 CORRECTED Connection test successful:', response.data)
      
      return {
        success: true,
        apiResponse: response.data,
        message: 'API v5 connection successful (CORRECTED)',
        endpoint: '/orders',
        testType: 'CORRECTED_STRUCTURE'
      }
    } catch (error: any) {
      console.error('❌ V5 CORRECTED Connection test failed:', error.response?.data || error.message)
      
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        message: 'API v5 connection failed (CORRECTED)'
      }
    }
  }
}

/**
 * Inicializa cliente Pagar.me v5 CORRIGIDO
 */
export async function initializePagarMeV5ClientFixed() {
  const apiKey = process.env.PAGARME_SECRET_KEY
  
  if (!apiKey) {
    throw new Error('PAGARME_SECRET_KEY não encontrada nas variáveis de ambiente')
  }

  console.log('🔑 Initializing Pagar.me v5 client (CORRECTED)...')
  return new PagarMeV5ClientFixed(apiKey)
}

/**
 * Gera cobrança PIX usando API v5 ESTRUTURA CORRIGIDA
 */
export async function generatePixChargeV5Fixed(
  amount: number,
  customerId?: string,
  orderId?: string
) {
  const client = await initializePagarMeV5ClientFixed()

  // Dados do cliente no formato correto da API v5
  const customerData = {
    name: 'Customer Test',
    email: `customer_${Date.now()}@mercantia.local`,
    code: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`  // API v5 usa 'code', não 'external_id'
  }

  // Metadados
  const metadata = {
    order_id: orderId || 'unknown',
    customer_id: customerId || 'unknown',
    source: 'mercantia_app',
    test_type: 'corrected_v5'
  }

  try {
    console.log('🔄 Generating PIX charge with API v5 (CORRECTED)...')
    
    const result = await client.createPixCharge(amount, customerData, metadata)
    
    console.log('✅ PIX charge created with CORRECTED v5 API:', result.transactionId)
    console.log('📊 Status:', result.status)
    console.log('💰 Total Amount:', result.totalAmount)
    
    return result
  } catch (error: any) {
    console.error('❌ PIX charge v5 CORRECTED failed:', error)
    
    // Tratamento específico de erros v5 CORRIGIDO
    if (error.response?.status === 401) {
      throw new Error('ERRO 401 - Chave API inválida para API v5. Gere novas chaves no painel Pagar.me.')
    } else if (error.response?.status === 403) {
      throw new Error('ERRO 403 - Acesso negado. Configure IP no painel Pagar.me.')
    } else if (error.response?.status === 422) {
      const errorDetails = error.response?.data?.errors || {}
      const firstError = Object.keys(errorDetails)[0] || 'unknown'
      const errorMessage = errorDetails[firstError]?.[0] || 'Estrutura inválida'
      throw new Error(`ERRO 422 - ${errorMessage}. Estrutura da API v5 corrigida automaticamente.`)
    }
    
    throw error
  }
}

/**
 * Testa conectividade com API v5 CORRIGIDO
 */
export async function testPagarMeV5ConnectionFixed() {
  try {
    const client = await initializePagarMeV5ClientFixed()
    return await client.testConnection()
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to initialize CORRECTED v5 client'
    }
  }
}

// Export principais funções CORRIGIDAS
export { 
  generatePixChargeV5Fixed as generatePixChargeV5,
  testPagarMeV5ConnectionFixed as testPagarMeV5Connection
}
