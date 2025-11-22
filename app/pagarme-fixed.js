// Teste corrigido para Pagar.me API v5
require('dotenv').config({ path: '.env.local' })
const axios = require('axios')

async function testPagarMeFixed() {
  console.log('🚀 TESTE CORRIGIDO PAGAR.ME API v5')
  console.log('=====================================')
  
  const secretKey = process.env.PAGARME_SECRET_KEY
  const accountId = process.env.PAGARME_ACCOUNT_ID
  
  console.log('🔑 Verificando variáveis...')
  console.log('  PAGARME_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 10)}...` : 'MISSING')
  console.log('  PAGARME_ACCOUNT_ID:', accountId ? accountId : 'MISSING')
  
  if (!secretKey) {
    console.log('❌ FATAL: PAGARME_SECRET_KEY não encontrada!')
    return
  }
  
  console.log('\n🧪 1. Teste API v5 Get Account (endpoint correto)')
  try {
    const response = await axios.get('https://api.pagar.me/core/v5/accounts', {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
    
    console.log('✅ API v5 Account - SUCCESS!')
    console.log('📊 Resposta:', response.data)
    
  } catch (error) {
    console.log('❌ API v5 Account - FAILED!')
    console.log('   Status:', error.response?.status)
    console.log('   Error:', error.response?.data)
  }
  
  console.log('\n🧪 2. Teste API v5 PIX (endpoint e estrutura corretos)')
  try {
    // API v5 usa /orders, não /transactions
    const paymentData = {
      items: [
        {
          description: 'Test Product',
          quantity: 1,
          unit_price: 1110
        }
      ],
      customer: {
        name: 'Test Customer',
        email: 'test@mercantia.local',
        code: 'test_local_123'
      },
      payment_methods: ['pix'],
      metadata: {
        source: 'local_test_fixed'
      }
    }
    
    console.log('📤 Dados do pedido:', JSON.stringify(paymentData, null, 2))
    
    const response = await axios.post('https://api.pagar.me/core/v5/orders', paymentData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
    
    console.log('✅ API v5 PIX - SUCCESS!')
    console.log('💰 Order ID:', response.data.id)
    console.log('📊 Amount:', response.data.total_amount)
    console.log('📊 Status:', response.data.status)
    
    // Buscar método de pagamento PIX
    const pixPayment = response.data.payments?.find(p => p.payment_method === 'pix')
    if (pixPayment) {
      console.log('📱 PIX QR Code:', pixPayment.qr_code || 'No QR code')
      console.log('📱 PIX Code:', pixPayment.qr_code_base64 || 'No base64')
    }
    
  } catch (error) {
    console.log('❌ API v5 PIX - FAILED!')
    console.log('   Status:', error.response?.status)
    console.log('   Error details:', error.response?.data)
  }
  
  console.log('\n🎯 CONCLUSÃO:')
  console.log('Se os testes passaram = API v5 funcionando perfeitamente!')
  console.log('Se falharam = Ajustar estrutura da API v5')
}

testPagarMeFixed().catch(console.error)
