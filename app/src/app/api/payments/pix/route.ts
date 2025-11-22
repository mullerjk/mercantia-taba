import { NextRequest, NextResponse } from 'next/server'
import { generatePixCharge } from '@/lib/pagarme-client' // Import the actual Pagar.me PIX generation function

interface PIXPaymentRequest {
  amount: number
  orderId?: string
  customerId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PIXPaymentRequest = await request.json()

    // Validate required fields
    if (!body.amount) {
      return NextResponse.json(
        { message: 'Valor do pagamento é obrigatório' },
        { status: 400 }
      )
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { message: 'Valor deve ser maior que zero' },
        { status: 400 }
      )
    }

    // Call the actual Pagar.me PIX generation function
    const pixCharge = await generatePixCharge(
      body.amount,
      body.customerId,
      body.orderId
    )

    console.log('PIX Payment Generated:', {
      transactionId: pixCharge.transactionId,
      amount: body.amount,
      pixKey: pixCharge.pixKey,
      orderId: body.orderId,
      timestamp: new Date(),
      expiresAt: pixCharge.expiresAt,
    })

    return NextResponse.json(
      {
        success: true,
        transactionId: pixCharge.transactionId,
        pixKey: pixCharge.pixKey,
        qrCode: pixCharge.qrCode,
        expiresAt: pixCharge.expiresAt,
        message: 'PIX gerado com sucesso',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PIX payment error:', error)
    return NextResponse.json(
      { message: 'Erro ao gerar PIX' },
      { status: 500 }
    )
  }
}
