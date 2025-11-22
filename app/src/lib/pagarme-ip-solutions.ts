/**
 * Soluções para problema de IP blocking no Pagar.me
 * Pagar.me tem Allowlist que só aceita IPs estáticos
 */

import axios from 'axios'

/**
 * Diagnostica se o problema é IP blocking
 */
export async function diagnoseIpIssue() {
  console.log('🔍 === DIAGNÓSTICO DE IP BLOCKING ===')
  
  const diagnostics: any = {
    currentIp: null,
    cloudflareHeaders: {},
    vercelInfo: {},
    possibleSolutions: []
  }

  try {
    // 1. Obter IP atual usando serviço público
    console.log('🌍 Getting current server IP...')
    const ipResponse = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 })
    diagnostics.currentIp = ipResponse.data.ip
    console.log('📍 Current server IP:', diagnostics.currentIp)

    // 2. Verificar headers do Vercel
    console.log('🟢 Checking Vercel headers...')
    const vercelHeaders = {
      'x-vercel-ip': process.env.VERCEL_URL || 'not-vercel',
      'x-forwarded-for': process.env.VERCEL_REGION || 'unknown-region'
    }
    diagnostics.vercelInfo = vercelHeaders
    console.log('🟢 Vercel info:', JSON.stringify(vercelHeaders, null, 2))

    // 3. Possíveis soluções
    diagnostics.possibleSolutions = [
      {
        problem: 'IP Dinâmico do Vercel FREE',
        solution: 'Adicionar Range de IPs do Vercel',
        action: 'Configure no Pagar.me: 76.76.19.0/20',
        difficulty: 'Fácil',
        immediate: true
      },
      {
        problem: 'Configuração de Allowlist Rígida', 
        solution: 'Adicionar IP Específico Atual',
        action: `Configure no Pagar.me: ${diagnostics.currentIp}`,
        difficulty: 'Médio',
        immediate: true,
        note: 'IP pode mudar em redeploy'
      },
      {
        problem: 'Pagar.me Configuração',
        solution: 'Desabilitar Allowlist Temporariamente',
        action: 'Painel Pagar.me → Settings → Security → Disable Allowlist',
        difficulty: 'Fácil', 
        immediate: true,
        caution: 'Só para testes'
      },
      {
        problem: 'Redeployment do Vercel',
        solution: 'Obter novo IP e configurar',
        action: 'Fazer novo deploy e capturar novo IP',
        difficulty: 'Médio',
        note: 'IP muda a cada deploy'
      },
      {
        problem: 'Solução Definitiva',
        solution: 'Upgrade para Vercel Pro (IPs estáticos)',
        action: 'Plan → Pro ($20/mês)',
        difficulty: 'Difícil',
        permanent: true
      }
    ]

    return {
      success: true,
      diagnosis: diagnostics,
      recommendation: 'Configure range 76.76.19.0/20 no painel Pagar.me'
    }

  } catch (error: any) {
    console.error('❌ IP diagnostic error:', error.message)
    
    return {
      success: false,
      error: error.message,
      fallbackSolutions: [
        '1. Configure 76.76.19.0/20 no Allowlist do Pagar.me',
        '2. Disable Allowlist temporariamente no Pagar.me',
        '3. Upgrade para Vercel Pro para IPs estáticos'
      ]
    }
  }
}

/**
 * Obtém informações da conexão atual
 */
export async function getConnectionInfo() {
  try {
    // Tentar múltiplos serviços de IP
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip'
    ]

    for (const service of services) {
      try {
        const response = await axios.get(service, { timeout: 3000 })
        return {
          ip: response.data.ip || response.data.origin,
          service: service,
          data: response.data
        }
      } catch (serviceError) {
        console.log(`⚠️ Service ${service} failed, trying next...`)
        continue
      }
    }

    throw new Error('All IP services failed')
  } catch (error: any) {
    console.error('❌ Connection info error:', error.message)
    
    return {
      error: 'Could not determine server IP',
      solutions: [
        'Check Vercel deployment IP in logs',
        'Use Vercel CLI: vercel inspect'
      ]
    }
  }
}

/**
 * Verifica se we’re running on Vercel
 */
export function isVercelEnvironment(): boolean {
  return !!process.env.VERCEL || 
         !!process.env.VERCEL_URL ||
         !!process.env.VERCEL_ENV
}

/**
 * Obtém informações específicas do Vercel
 */
export function getVercelInfo() {
  const vercelInfo: any = {
    isVercel: isVercelEnvironment(),
    url: process.env.VERCEL_URL,
    environment: process.env.VERCEL_ENV,
    region: process.env.VERCEL_REGION,
    plan: process.env.VERCEL_PLAN || 'FREE', // Vercel FREE não tem IPs estáticos
  }

  if (!vercelInfo.isVercel) {
    vercelInfo.recommendation = 'Not running on Vercel'
  } else if (vercelInfo.plan === 'FREE') {
    vercelInfo.issue = 'FREE plan has dynamic IPs'
    vercelInfo.solutions = [
      'Upgrade to Pro plan ($20/month)',
      'Configure Vercel IP range in Pagar.me',
      'Disable Allowlist temporarily for testing'
    ]
  }

  return vercelInfo
}
