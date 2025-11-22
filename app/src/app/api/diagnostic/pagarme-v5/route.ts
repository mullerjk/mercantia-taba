import { NextRequest, NextResponse } from 'next/server'
import { testPagarMeV5Connection } from '@/lib/pagarme-client-v5'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Pagar.me v5 API connection...')
    
    const result = await testPagarMeV5Connection()
    
    console.log('🎯 V5 Diagnostic result:', result)
    
    return NextResponse.json({
      success: result.success,
      api: 'pagarme-v5',
      timestamp: new Date().toISOString(),
      connection: result,
      baseURL: 'https://api.pagar.me/core/v5',
      nextSteps: {
        ifSuccess: 'Use POST /api/payments/pix-v5 to create payments',
        ifFail: 'Check API keys and network connectivity'
      }
    }, {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('❌ V5 Diagnostic route error:', error)
    
    return NextResponse.json({
      success: false,
      api: 'pagarme-v5',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
