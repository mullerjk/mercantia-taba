import * as pagarme from 'pagarme'

/**
 * Diagnóstico completo das chaves de API Pagar.me
 */
export async function runPagarMeDiagnostic() {
  console.log('🔍 === DIAGNÓSTICO COMPLETO PAGAR.ME ===')
  
  const diagnosticResults = {
    environment: {},
    initialization: {},
    apiTests: [],
    finalDiagnosis: null
  }

  // 1. Verificar Environment Variables
  console.log('\n📋 1. VERIFICAÇÃO DE VARIÁVEIS')
  const secretKey = process.env.PAGARME_SECRET_KEY
  const apiKey = process.env.PAGARME_API_KEY
  const environment = process.env.PAGARME_ENVIRONMENT || 'sandbox'
  
  diagnosticResults.environment = {
    hasSecretKey: !!secretKey,
    hasApiKey: !!apiKey,
    secretKeyPrefix: secretKey ? secretKey.substring(0, 10) + '...' : 'MISSING',
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING',
    environment: environment,
    secretKeyFormat: secretKey ? (secretKey.startsWith('sk_test_') ? 'VALID' : 'INVALID') : 'MISSING',
    apiKeyFormat: apiKey ? (apiKey.startsWith('pk_test_') ? 'VALID' : 'INVALID') : 'MISSING'
  }

  console.log('  PAGARME_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 10)}... (${diagnosticResults.environment.secretKeyFormat})` : '❌ MISSING')
  console.log('  PAGARME_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}... (${diagnosticResults.environment.apiKeyFormat})` : '❌ MISSING')
  console.log('  Environment:', environment)

  // 2. Testar diferentes inicializações
  console.log('\n🔧 2. TESTE DE INICIALIZAÇÃO')
  let workingClient = null
  
  // Method 1: Direct module
  try {
    const testClient = pagarme
    workingClient = testClient
    diagnosticResults.initialization.direct = 'SUCCESS'
    console.log('  ✅ Method 1: Direct module - SUCCESS')
  } catch (error) {
    diagnosticResults.initialization.direct = `FAILED: ${error.message}`
    console.log('  ❌ Method 1: Direct module - FAILED')
  }

  // Method 2: With secret key
  if (!workingClient && secretKey) {
    try {
      const testClient = pagarme(secretKey)
      workingClient = testClient
      diagnosticResults.initialization.withSecretKey = 'SUCCESS'
      console.log('  ✅ Method 2: With secret key - SUCCESS')
    } catch (error) {
      diagnosticResults.initialization.withSecretKey = `FAILED: ${error.message}`
      console.log('  ❌ Method 2: With secret key - FAILED')
    }
  }

  // Method 3: With API key
  if (!workingClient && apiKey) {
    try {
      const testClient = pagarme(apiKey)
      workingClient = testClient
      diagnosticResults.initialization.withApiKey = 'SUCCESS'
      console.log('  ✅ Method 3: With API key - SUCCESS')
    } catch (error) {
      diagnosticResults.initialization.withApiKey = `FAILED: ${error.message}`
      console.log('  ❌ Method 3: With API key - FAILED')
    }
  }

  if (!workingClient) {
    diagnosticResults.finalDiagnosis = 'FAILURE - No initialization method worked'
    console.log('\n❌ FALHA: Nenhum método de inicialização funcionou')
    return diagnosticResults
  }

  // 3. Testar API com operações simples
  console.log('\n🧪 3. TESTE DE API')
  
  // Test A: List customers (should work even with wrong keys but show error)
  try {
    console.log('  Testando API customers...')
    await workingClient.customers.list()
    diagnosticResults.apiTests.push({ test: 'customers.list', result: 'SUCCESS - Keys valid' })
    console.log('  ✅ customers.list - SUCCESS (keys valid)')
  } catch (error) {
    const errorInfo = {
      test: 'customers.list',
      result: 'FAILED',
      status: error.response?.status,
      message: error.message
    }
    diagnosticResults.apiTests.push(errorInfo)
    
    if (error.response?.status === 401) {
      console.log('  ❌ customers.list - 401 Unauthorized (keys invalid)')
    } else {
      console.log(`  ❌ customers.list - ${error.response?.status || 'ERROR'}: ${error.message}`)
    }
  }

  // Test B: Create minimal transaction
  try {
    console.log('  Testando criação de transação PIX...')
    const minimalTransaction = {
      amount: 100,
      payment_method: 'pix',
      customer: {
        name: 'Test Customer',
        email: 'test@diagnostic.local',
        external_id: 'diagnostic_test'
      }
    }
    
    const transaction = await workingClient.transactions.create(minimalTransaction)
    diagnosticResults.apiTests.push({ test: 'pix.transaction', result: 'SUCCESS - Transaction created' })
    console.log('  ✅ PIX transaction - SUCCESS (keys valid, transaction created)')
  } catch (error) {
    const errorInfo = {
      test: 'pix.transaction',
      result: 'FAILED',
      status: error.response?.status,
      message: error.message
    }
    diagnosticResults.apiTests.push(errorInfo)
    
    if (error.response?.status === 401) {
      console.log('  ❌ PIX transaction - 401 Unauthorized (keys invalid)')
    } else {
      console.log(`  ❌ PIX transaction - ${error.response?.status || 'ERROR'}: ${error.message}`)
    }
  }

  // 4. Final Diagnosis
  console.log('\n🎯 4. DIAGNÓSTICO FINAL')
  
  const hasValidKeys = diagnosticResults.environment.hasSecretKey && 
                      diagnosticResults.environment.secretKeyFormat === 'VALID' &&
                      diagnosticResults.environment.hasApiKey &&
                      diagnosticResults.environment.apiKeyFormat === 'VALID'

  const hasWorkingInitialization = Object.values(diagnosticResults.initialization).some(result => result === 'SUCCESS')

  const hasSuccessfulApiTest = diagnosticResults.apiTests.some(test => test.result === 'SUCCESS - Keys valid' || test.result === 'SUCCESS - Transaction created')

  if (hasValidKeys && hasWorkingInitialization && hasSuccessfulApiTest) {
    diagnosticResults.finalDiagnosis = 'SUCCESS - Everything is working correctly'
    console.log('✅ SUCESSO: Sistema Pagar.me funcionando perfeitamente!')
  } else if (!hasValidKeys) {
    diagnosticResults.finalDiagnosis = 'FAILURE - Invalid key format. Keys must start with sk_test_ and pk_test_ for sandbox'
    console.log('❌ FALHA: Formato de chaves inválido. Use sk_test_ e pk_test_ para sandbox')
  } else if (diagnosticResults.environment.hasSecretKey && diagnosticResults.environment.secretKeyFormat === 'VALID') {
    diagnosticResults.finalDiagnosis = 'FAILURE - Keys format valid but API rejects them. Generate new keys in Pagar.me dashboard'
    console.log('❌ FALHA: Chaves com formato válido mas API as rejeita. Gere novas chaves no painel Pagar.me')
  } else {
    diagnosticResults.finalDiagnosis = 'FAILURE - Multiple issues detected'
    console.log('❌ FALHA: Múltiplos problemas detectados')
  }

  console.log('\n📊 RESUMO DO DIAGNÓSTICO:')
  console.log(JSON.stringify(diagnosticResults, null, 2))

  return diagnosticResults
}

// Para uso em API route
export async function getDiagnosticResult() {
  try {
    const result = await runPagarMeDiagnostic()
    return {
      success: true,
      diagnosis: result,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}
