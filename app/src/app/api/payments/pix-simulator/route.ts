import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/supabase-service'

/**
 * API para simulação de aprovação PIX
 * Permite testar o fluxo completo sem esperar pela expiração do QR Code
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 PIX Simulator: Aprovando pagamento...')

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 })
    }

    console.log(`🎯 Aprovando pagamento para pedido: ${orderId}`)

    // Atualizar pedido como pago (simulando Pagar.me)
    await updateOrderStatus(orderId, 'confirmed', {
      pagarme_status: 'paid',
      payment_date: new Date().toISOString(),
      event_type: 'simulator_approved',
      is_simulator: true,
      simulator_instructions: 'Pagamento aprovado via simulador PIX - não requer ação manual',
      simulator_url: 'https://docs.pagar.me/docs/simulador-pix',
      approved_at: new Date().toISOString(),
      approved_method: 'api_simulator'
    })

    console.log(`✅ SIMULADOR: Pedido ${orderId} aprovado IMEDIATAMENTE!`)

    return NextResponse.json({
      success: true,
      message: 'Payment approved via PIX simulator',
      orderId,
      status: 'confirmed',
      approvedAt: new Date().toISOString(),
      note: 'Este pedido foi confirmado via simulador PIX - sem necessidade de aguardar expiração'
    })

  } catch (error: any) {
    console.error('❌ Erro no simulador PIX:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      orderId: error?.details?.orderId
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({
      error: 'Order ID required',
      usage: 'GET /api/payments/pix-simulator?orderId=YOUR_ORDER_ID',
      example: 'GET /api/payments/pix-simulator?orderId=or_NwWjbrzS0SWb3E1m',
      simulatorDocs: 'https://docs.pagar.me/docs/simulador-pix',
      note: 'Este endpoint simula aprovação imediata do PIX para testes'
    }, { status: 400 })
  }

  try {
    console.log(`🎯 GET Simulator: Aprovando pedido ${orderId}`)

    await updateOrderStatus(orderId, 'confirmed', {
      pagarme_status: 'paid',
      payment_date: new Date().toISOString(),
      event_type: 'simulator_get_approved',
      is_simulator: true,
      simulator_instructions: 'Pagamento aprovado via simulador PIX (GET) - não requer ação manual',
      approved_at: new Date().toISOString(),
      approved_method: 'api_simulator_get'
    })

    console.log(`✅ SIMULADOR GET: Pedido ${orderId} aprovado!`)

    return NextResponse.json({
      success: true,
      message: 'Payment approved via PIX simulator (GET method)',
      orderId,
      status: 'confirmed',
      approvedAt: new Date().toISOString(),
      method: 'GET',
      instructions: 'Copie a URL abaixo para aprovar outros pedidos:',
      exampleUrl: `${request.nextUrl.origin}/api/payments/pix-simulator?orderId=${orderId}`,
      docs: 'https://docs.pagar.me/docs/simulador-pix'
    })

  } catch (error: any) {
    console.error('❌ Erro no simulador PIX (GET):', error)

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
