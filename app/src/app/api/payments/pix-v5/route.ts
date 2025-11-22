import { NextRequest, NextResponse } from 'next/server'
import { generatePixChargeV5 } from '@/lib/pagarme-client-v5'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API v5 PIX request received')
    
    const body = await request.json()
    const { amount, customerId, orderId } = body

    // Validação básica
    if (!amount || amount < 100) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be at least 100 (R$ 1.00)'
      }, { status: 400 })
    }

    console.log('💰 Processing PIX v5 payment for amount:', amount)
    
    // Gerar cobrança PIX usando API v5
    const result = await generatePixChargeV5(amount, customerId, orderId)
    
    console.log('✅ PIX v5 payment successful:', result.transactionId)

    return NextResponse.json({
      success: true,
      payment: {
        id: result.transactionId,
        amount: result.amount,
        status: result.status,
        qrCode: result.qrCode,
        qrCodeImage: result.qrCodeImage,
        pixKey: result.pixKey,
        expiresAt: result.expiresAt,
        paymentMethod: 'pix',
        apiVersion: 'v5'
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('❌ PIX v5 API error:', error)
    
    // Determinar status code baseado no erro
    let statusCode = 500
    let errorMessage = error.message

    if (error.message.includes('401')) {
      statusCode = 401
      errorMessage = 'Unauthorized - Verifique as chaves de API'
    } else if (error.message.includes('403')) {
      statusCode = 403
      errorMessage = 'Forbidden - Configure IP no painel Pagar.me'
    } else if (error.message.includes('422')) {
      statusCode = 422
      errorMessage = 'Unprocessable Entity - Dados inválidos'
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PIX v5 Payment API - Use POST to create payments',
    endpoints: {
      createPayment: 'POST /api/payments/pix-v5',
      testConnection: 'GET /api/diagnostic/pagarme-v5'
    },
    example: {
      amount: 1110,
      customerId: 'optional-customer-id',
      orderId: 'optional-order-id'
    }
  })
}
