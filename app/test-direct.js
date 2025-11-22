// Teste direto para Pagar.me - versão simples
require('dotenv').config({ path: '.env.local' })
const axios = require('axios')

async function testPagarMeDirect() {
  console.log('🚀 TESTE DIRETO PAGAR.ME')
  console.log('=====================================')
  
  const secretKey = process.env.PAGARME_SECRET_KEY
  const apiKey = process.env.PAGARME_API_KEY
  
  console.log('🔑 Verificando variáveis...')
  console.log('  PAGARME_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 10)}...` : 'MISSING')
  console.log('  PAGARME_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING')
  
  if (!secretKey) {
    console.log('❌ FATAL: PAGARME_SECRET_KEY não encontrada!')
    return
  }
  
  console.log('\n🧪 1. Teste API v5 Balance')
  try {
    const response = await axios.get('https://api.pagar.me/core/v5/balance', {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
    
    console.log('✅ API v5 Balance - SUCCESS!')
    console.log('📊 Resposta:', response.status, response.data?.id || 'OK')
    
  } catch (error) {
    console.log('❌ API v5 Balance - FAILED!')
    console.log('   Status:', error.response?.status)
    console.log('   Error:', error.response?.data?.errors?.[0]?.message || error.message)
    
    if (error.response?.status === 401) {
      console.log('🚨 PROBLEMA: Chaves inválidas (401)')
    } else if (error.response?.status === 403) {
      console.log('🚨 PROBLEMA: IP blocking (403)')
    }
  }
  
  console.log('\n🧪 2. Teste API v5 PIX (criação)')
  try {
    const paymentData = {
      amount: 1110,
      payment_method: 'pix',
      customer: {
        name: 'Test Customer',
        email: 'test@mercantia.local',
        external_id: 'test_local_123'
      },
      metadata: {
        source: 'local_test'
      }
    }
    
    const response = await axios.post('https://api.pagar.me/core/v5/orders', paymentData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
    
    console.log('✅ API v5 PIX - SUCCESS!')
    console.log('💰 PIX ID:', response.data.id)
    console.log('📊 Amount:', response.data.amount)
    console.log('📊 Status:', response.data.status)
    
  } catch (error) {
    console.log('❌ API v5 PIX - FAILED!')
    console.log('   Status:', error.response?.status)
    console.log('   Error:', error.response?.data?.errors?.[0]?.message || error.message)
    
    if (error.response?.status === 401) {
      console.log('🚨 DIAGNÓSTICO: Chaves inválidas!')
    } else if (error.response?.status === 403) {
      console.log('🚨 DIAGNÓSTICO: IP blocked!')
    }
  }
  
  console.log('\n🎯 CONCLUSÃO:')
  console.log('Se ambos os testes passaram = Chaves válidas, problema é IP blocking')
  console.log('Se ambos falharam com 401 = Chaves inválidas')
  console.log('Se falharam com 403 = IP blocking')
}

testPagarMeDirect().catch(console.error)
