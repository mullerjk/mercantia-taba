// Teste FINAL com estrutura correta API v5
require('dotenv').config({ path: '.env.local' })
const axios = require('axios')

async function testPagarMeFinal() {
  console.log('🚀 TESTE FINAL PAGAR.ME API v5 (estrutura correta)')
  console.log('=====================================')
  
  const secretKey = process.env.PAGARME_SECRET_KEY
  
  console.log('🔑 Verificando variáveis...')
  console.log('  PAGARME_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 10)}...` : 'MISSING')
  
  if (!secretKey) {
    console.log('❌ FATAL: PAGARME_SECRET_KEY não encontrada!')
    return
  }
  
  console.log('\n🧪 PIX API v5 (estrutura CORRETA)')
  try {
    // API v5 - estrutura correta com amount
    const paymentData = {
      items: [
        {
          description: 'Test Product',
          quantity: 1,
          amount: 1110  // API v5 usa 'amount', não 'unit_price'
        }
      ],
      customer: {
        name: 'Test Customer',
        email: 'test@mercantia.local',
        code: 'test_local_123'
      },
      payments: [
        {
          payment_method: 'pix'
        }
      ],
      metadata: {
        source: 'local_test_final'
      }
    }
    
    console.log('📤 Dados do pedido (estrutura correta):')
    console.log(JSON.stringify(paymentData, null, 2))
    
    const response = await axios.post('https://api.pagar.me/core/v5/orders', paymentData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
    
    console.log('🎉 SUCESSO TOTAL! 🎉')
    console.log('✅ API v5 PIX - SUCCESS!')
    console.log('💰 Order ID:', response.data.id)
    console.log('📊 Amount:', response.data.total_amount)
    console.log('📊 Status:', response.data.status)
    
    // Buscar método de pagamento PIX
    const pixPayment = response.data.payments?.find(p => p.payment_method === 'pix')
    if (pixPayment) {
      console.log('📱 PIX QR Code:', pixPayment.qr_code ? pixPayment.qr_code.substring(0, 50) + '...' : 'No QR code')
      console.log('📱 PIX Code Base64:', pixPayment.qr_code_base64 ? 'Yes' : 'No base64')
    }
    
    console.log('\n🎯 RESULTADO FINAL:')
    console.log('✅ CHAVES FUNCIONANDO PERFEITAMENTE!')
    console.log('✅ API v5 ESTRUTURA CORRETA!')
    console.log('✅ PIX CRIADO COM SUCESSO!')
    
  } catch (error) {
    console.log('❌ API v5 PIX - FAILED!')
    console.log('   Status:', error.response?.status)
    console.log('   Error details:', JSON.stringify(error.response?.data, null, 2))
    
    if (error.response?.status === 401) {
      console.log('🚨 PROBLEMA: Ainda erro 401 - verificar endpoint/estrutura')
    } else if (error.response?.status === 422) {
      console.log('🔧 PROBLEMA: Erro de estrutura - ajustar formato da API v5')
    }
  }
}

testPagarMeFinal().catch(console.error)
