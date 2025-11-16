import { NextRequest, NextResponse } from 'next/server'

interface CardPaymentRequest {
  cardNumber: string
  cardholderName: string
  expiryMonth: number
  expiryYear: number
  cvv: string
  installments: number
  amount: number
  orderId?: string
  customerId?: string
}

// Validate card number using Luhn algorithm
function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Validate expiry date
function validateExpiry(month: number, year: number): boolean {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  if (month < 1 || month > 12) return false

  return true
}

export async function POST(request: NextRequest) {
  try {
    const body: CardPaymentRequest = await request.json()

    // Validate required fields
    if (!body.cardNumber || !body.cardholderName || !body.expiryMonth || !body.expiryYear || !body.cvv || !body.amount) {
      return NextResponse.json(
        { message: 'Campos obrigatórios ausentes' },
        { status: 400 }
      )
    }

    // Validate card number
    if (!validateCardNumber(body.cardNumber)) {
      return NextResponse.json(
        { message: 'Número de cartão inválido' },
        { status: 400 }
      )
    }

    // Validate expiry
    if (!validateExpiry(body.expiryMonth, body.expiryYear)) {
      return NextResponse.json(
        { message: 'Data de validade expirada ou inválida' },
        { status: 400 }
      )
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(body.cvv)) {
      return NextResponse.json(
        { message: 'CVV inválido' },
        { status: 400 }
      )
    }

    // TODO: Integrate with Pagar.me SDK
    // const client = new PagarmeClient({
    //   basicAuthCredentials: {
    //     username: process.env.PAGARME_API_KEY,
    //     password: ''
    //   }
    // })

    // For now, return a mock success response
    // In production, this would create a charge via Pagar.me API
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Here you would call the Pagar.me API to create a charge
    // Example (when SDK is properly configured):
    // const charge = await client.charges.createCharge({
    //   amount: body.amount,
    //   payment_method: 'credit_card',
    //   credit_card: {
    //     card_number: body.cardNumber,
    //     holder_name: body.cardholderName,
    //     exp_month: body.expiryMonth,
    //     exp_year: body.expiryYear,
    //     cvv: body.cvv
    //   },
    //   customer: body.customerId ? { id: body.customerId } : undefined,
    //   metadata: {
    //     order_id: body.orderId
    //   },
    //   installments: body.installments
    // })

    // Log the transaction (in production, save to database)
    console.log('Card Payment Processed:', {
      transactionId,
      amount: body.amount,
      cardLast4: body.cardNumber.slice(-4),
      installments: body.installments,
      orderId: body.orderId,
      timestamp: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        transactionId,
        message: 'Pagamento processado com sucesso',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Card payment error:', error)
    return NextResponse.json(
      { message: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
