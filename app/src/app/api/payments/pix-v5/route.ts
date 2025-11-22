import { NextRequest, NextResponse } from 'next/server'
import { generatePixChargeV5 } from '@/lib/pagarme-client-v5'

// MOCK PIX para funcionamento imediato
const USE_MOCK = false // Set to false when Pagar.me keys are properly configured

async function createMockPixCharge(amount: number) {
  console.log('🎭 Using MOCK PIX charge for testing:', amount)

  const mockOrderId = `or_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const mockPixKey = `pix_mock_${Math.random().toString(36).substr(2, 9)}@mock.pix`

  return {
    transactionId: mockOrderId,
    orderId: mockOrderId,
    pixKey: mockPixKey,
    qrCode: `qr_code_mock_${mockOrderId}`,
    qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pix:${mockPixKey}?amount=${(amount/100).toFixed(2)}`,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos para mock
    status: 'pending',
    amount: amount,
    totalAmount: amount,
    items: [{ description: 'Mock Product', quantity: 1, amount: amount }],
    payments: [{
      payment_method: 'pix',
      pix_key: mockPixKey,
      qr_code: `qr_code_mock_${mockOrderId}`,
      qr_code_base64: 'mock_qr_base64',
      status: 'pending'
    }],
    v5Response: {
      id: mockOrderId,
      status: 'pending',
      amount: amount,
      mock: true,
      mock_instructions: 'Use GET /api/payments/pix-simulator?orderId=' + mockOrderId + ' to approve this payment instantly'
    }
  }
}

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

    // Escolhe entre MOCK ou API real baseado na configuração
    const result = USE_MOCK
      ? await createMockPixCharge(amount)
      : await generatePixChargeV5(amount, customerId, orderId)

    console.log(`✅ PIX v5 payment successful (${USE_MOCK ? 'MOCK' : 'REAL'}):`, result.transactionId)

    if (USE_MOCK) {
      console.log('🎭 MOCK MODE: Use this URL to approve the payment immediately:')
      console.log(`   https://mercantia-taba.vercel.app/api/payments/pix-simulator?orderId=${result.orderId}`)
    }

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
