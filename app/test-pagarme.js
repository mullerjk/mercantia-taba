#!/usr/bin/env node

/**
 * Script de teste local para Pagar.me
 * Execute: npm run test:pagarme
 */

require('dotenv').config()
const { testPagarMeLocally, quickTest } = require('./src/lib/test-pagarme-local.ts')

async function main() {
  console.log('🚀 INICIANDO TESTE LOCAL PAGAR.ME')
  console.log('=====================================')
  
  try {
    const args = process.argv.slice(2)
    
    if (args[0] === 'quick') {
      // Teste rápido de uma API específica
      const apiVersion = args[1] === 'v5' ? 'v5' : 'v1'
      console.log(`⚡ Executando teste rápido da API ${apiVersion}...`)
      const result = await quickTest(apiVersion)
      console.log('\n🎯 RESULTADO:', result)
    } else {
      // Teste completo
      console.log('🧪 Executando teste completo...')
      const results = await testPagarMeLocally()
      
      console.log('\n' + '='.repeat(50))
      console.log('🎯 DIAGNÓSTICO FINAL')
      console.log('='.repeat(50))
      console.log('Conclusão:', results.conclusion)
      console.log('Ação:', results.action)
      console.log(`Sucesso: ${results.summary?.successRate || 0}%`)
      
      if (results.summary?.successRate === 100) {
        console.log('\n✅ CONFIRMADO: Chaves funcionando localmente!')
        console.log('❌ PROBLEMA: IP blocking do Vercel FREE')
        console.log('\n🔧 SOLUÇÃO: Configure 76.76.19.0/20 no painel Pagar.me')
      } else if (results.summary?.successRate === 0) {
        console.log('\n❌ CONFIRMADO: Chaves inválidas!')
        console.log('\n🔧 SOLUÇÃO: Gere novas chaves no painel Pagar.me')
      } else {
        console.log('\n⚠️ PROBLEMA PARCIAL: Verificar configuração das chaves')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    process.exit(1)
  }
}

main()
