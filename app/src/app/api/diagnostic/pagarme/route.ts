import { NextRequest, NextResponse } from 'next/server'
import { getDiagnosticResult } from '@/lib/pagarme-diagnostic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting Pagar.me diagnostic...')
    
    const result = await getDiagnosticResult()
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('❌ Diagnostic route error:', error)
    
    return NextResponse.json({
      success: false,
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
