import axios from 'axios'

/**
 * Cliente Pagar.me API v5
 * Usa endpoints diretos da API v5 ao invés do SDK
 */
class PagarMeV5Client {
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
   * Gera uma cobrança PIX usando API v5
   */
  async createPixCharge(amount: number, customerData: any, metadata: any = {}) {
    try {
      console.log('🔄 Creating PIX charge with Pagar.me v5 API...')
      console.log('🌍 Using base URL:', this.baseURL)
      console.log('🔑 API Key prefix:', this.apiKey.substring(0, 10) + '...')

      const requestData = {
        amount: amount,
        payment_method: 'pix',
        customer: customerData,
        metadata: {
          source: 'mercantia_app',
          ...metadata
        },
        pix: {
          expires_in: 3600 // 1 hora
        }
      }

      console.log('📤 V5 Request data:', JSON.stringify(requestData, null, 2))

      const response = await this.axiosInstance.post('/orders', requestData)

      console.log('✅ V5 Response received:', JSON.stringify(response.data, null, 2))

      // Extrair dados do PIX da resposta v5
      const pixData = response.data.payments?.[0]?.pix || response.data.pix || response.data

      return {
        transactionId: response.data.id,
        pixKey: pixData.pix_key || pixData.key,
        qrCode: pixData.pix_qr_code || pixData.qr_code,
        qrCodeImage: pixData.pix_qr_code_base64 || pixData.qr_code_base64,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos fallback
        status: response.data.status,
        amount: response.data.amount,
        v5Response: response.data
      }
    } catch (error: any) {
      console.error('❌ V5 API Error:', error.response?.data || error.message)
      
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
   * Testa conectividade com API v5
   */
  async testConnection() {
    try {
      console.log('🧪 Testing Pagar.me v5 API connection...')
      
      // Teste simples - obter informações da conta
      const response = await this.axiosInstance.get('/balance')
      console.log('✅ V5 Connection test successful:', response.data)
      
      return {
        success: true,
        balance: response.data,
        message: 'API v5 connection successful'
      }
    } catch (error: any) {
      console.error('❌ V5 Connection test failed:', error.response?.data || error.message)
      
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        message: 'API v5 connection failed'
      }
    }
  }
}

/**
 * Inicializa cliente Pagar.me v5
 */
export async function initializePagarMeV5Client() {
  const apiKey = process.env.PAGARME_SECRET_KEY
  
  if (!apiKey) {
    throw new Error('PAGARME_SECRET_KEY não encontrada nas variáveis de ambiente')
  }

  console.log('🔑 Initializing Pagar.me v5 client...')
  return new PagarMeV5Client(apiKey)
}

/**
 * Gera cobrança PIX usando API v5
 */
export async function generatePixChargeV5(
  amount: number,
  customerId?: string,
  orderId?: string
) {
  const client = await initializePagarMeV5Client()

  // Dados do cliente no formato da API v5
  const customerData = {
    name: 'Customer Test',
    email: `customer_${Date.now()}@mercantia.local`,
    type: 'individual',
    external_id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Metadados
  const metadata = {
    order_id: orderId || 'unknown',
    customer_id: customerId || 'unknown',
    source: 'mercantia_app'
  }

  try {
    console.log('🔄 Generating PIX charge with API v5...')
    
    const result = await client.createPixCharge(amount, customerData, metadata)
    
    console.log('✅ PIX charge created with API v5:', result.transactionId)
    
    return result
  } catch (error: any) {
    console.error('❌ PIX charge v5 failed:', error)
    
    // Tratamento específico de erros v5
    if (error.response?.status === 401) {
      throw new Error('ERRO 401 - Chave API inválida para API v5. Verifique se a chave é para Pagar.me v5.')
    } else if (error.response?.status === 403) {
      throw new Error('ERRO 403 - Acesso negado. Configure IP no painel Pagar.me.')
    } else if (error.response?.status === 422) {
      throw new Error('ERRO 422 - Dados inválidos. Verifique formato dos dados enviados.')
    }
    
    throw error
  }
}

/**
 * Testa conectividade com API v5
 */
export async function testPagarMeV5Connection() {
  try {
    const client = await initializePagarMeV5Client()
    return await client.testConnection()
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to initialize v5 client'
    }
  }
}
