/**
 * Script de teste local para Pagar.me
 * Testa as chaves sem IP blocking do Vercel
 */

import { generatePixChargeV5, testPagarMeV5Connection } from './pagarme-client-v5'
import { generatePixCharge } from './pagarme-client'

/**
 * Testa ambas as APIs (v1 e v5) localmente
 */
export async function testPagarMeLocally() {
  console.log('🧪 === TESTE LOCAL PAGAR.ME ===')
  console.log('🌍 Ambiente: Local (sem IP blocking do Vercel)')
  console.log('📅 Timestamp:', new Date().toISOString())
  
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: 'local',
    tests: []
  }

  // 1. Verificar variáveis de ambiente
  console.log('\n📋 1. VERIFICAÇÃO DE VARIÁVEIS')
  
  const hasSecretKey = !!process.env.PAGARME_SECRET_KEY
  const hasApiKey = !!process.env.PAGARME_API_KEY
  const environment = process.env.PAGARME_ENVIRONMENT || 'sandbox'
  
  console.log('🔑 PAGARME_SECRET_KEY:', hasSecretKey ? 'FOUND' : 'MISSING')
  console.log('🔑 PAGARME_API_KEY:', hasApiKey ? 'FOUND' : 'MISSING')
  console.log('🌍 Environment:', environment)
  
  results.tests.push({
    name: 'Environment Variables',
    passed: hasSecretKey && hasApiKey,
    details: {
      secretKey: hasSecretKey,
      apiKey: hasApiKey,
      environment: environment
    }
  })

  if (!hasSecretKey || !hasApiKey) {
    console.log('❌ FATAL: API keys não configuradas!')
    results.error = 'API keys não configuradas'
    return results
  }

  // 2. Teste API v5 (chaves novas)
  console.log('\n🔄 2. TESTE API v5')
  try {
    console.log('🧪 Testando conexão v5...')
    const v5Connection = await testPagarMeV5Connection()
    console.log('🔗 Resultado v5:', v5Connection)
    
    results.tests.push({
      name: 'API v5 Connection',
      passed: v5Connection.success,
      details: v5Connection
    })

    if (v5Connection.success) {
      console.log('💰 Testando PIX v5...')
      const v5Payment = await generatePixChargeV5(1110, 'test-local', 'local-test')
      console.log('✅ PIX v5 criado:', v5Payment.transactionId)
      
      results.tests.push({
        name: 'API v5 PIX Payment',
        passed: true,
        details: {
          transactionId: v5Payment.transactionId,
          amount: v5Payment.amount,
          status: v5Payment.status
        }
      })
    }
    
  } catch (error: any) {
    console.log('❌ API v5 falhou:', error.message)
    results.tests.push({
      name: 'API v5 Payment',
      passed: false,
      error: error.message,
      details: error.response?.data || error.message
    })
  }

  // 3. Teste API v1 (SDK)
  console.log('\n🔄 3. TESTE API v1 (SDK)')
  try {
    console.log('💰 Testando PIX v1 (SDK)...')
    const v1Payment = await generatePixCharge(1110, 'test-local', 'local-test')
    console.log('✅ PIX v1 criado:', v1Payment.transactionId)
    
    results.tests.push({
      name: 'API v1 (SDK) PIX Payment',
      passed: true,
      details: {
        transactionId: v1Payment.transactionId,
        amount: v1Payment.amount,
        status: v1Payment.status
      }
    })
    
  } catch (error: any) {
    console.log('❌ API v1 falhou:', error.message)
    results.tests.push({
      name: 'API v1 (SDK) PIX Payment',
      passed: false,
      error: error.message,
      details: error.response?.data || error.message
    })
  }

  // 4. Resumo
  console.log('\n🎯 4. RESUMO DOS TESTES')
  
  const passedTests = results.tests.filter((test: any) => test.passed).length
  const totalTests = results.tests.length
  
  console.log(`📊 Testes passados: ${passedTests}/${totalTests}`)
  
  results.summary = {
    totalTests: totalTests,
    passedTests: passedTests,
    failedTests: totalTests - passedTests,
    successRate: Math.round((passedTests / totalTests) * 100)
  }

  if (passedTests === totalTests) {
    console.log('✅ TODOS OS TESTES PASSARAM!')
    console.log('🎉 As chaves estão funcionando corretamente!')
    results.conclusion = 'SUCCESS - Keys work perfectly locally'
    results.action = 'O problema é IP blocking do Vercel FREE'
  } else if (passedTests === 0) {
    console.log('❌ TODOS OS TESTES FALHARAM!')
    results.conclusion = 'FAILURE - Keys are invalid or expired'
    results.action = 'Gere novas chaves no painel Pagar.me'
  } else {
    console.log('⚠️ ALGUNS TESTES PASSARAM!')
    results.conclusion = 'PARTIAL - Some APIs work, others don\'t'
    results.action = 'Verifique configuração das chaves'
  }

  console.log('\n📊 RESULTADO FINAL:')
  console.log(JSON.stringify(results, null, 2))

  return results
}

/**
 * Teste rápido de uma API específica
 */
export async function quickTest(apiVersion: 'v1' | 'v5') {
  console.log(`⚡ QUICK TEST API ${apiVersion.toUpperCase()}`)
  
  try {
    if (apiVersion === 'v5') {
      const result = await generatePixChargeV5(1110, 'quick-test', 'local')
      console.log('✅ API v5 SUCCESS:', result.transactionId)
      return { success: true, transactionId: result.transactionId }
    } else {
      const result = await generatePixCharge(1110, 'quick-test', 'local')
      console.log('✅ API v1 SUCCESS:', result.transactionId)
      return { success: true, transactionId: result.transactionId }
    }
  } catch (error: any) {
    console.log(`❌ API ${apiVersion} FAILED:`, error.message)
    return { success: false, error: error.message }
  }
}

// Export functions para uso em scripts
export { generatePixChargeV5, testPagarMeV5Connection }
