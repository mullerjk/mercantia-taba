import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { updateOrderStatus, createPaymentRecord } from '@/lib/supabase-service'

/**
 * Webhook do Pagar.me para receber notificações de pagamentos
 * Baseado na documentação oficial: https://docs.pagar.me/reference/notifica%C3%A7%C3%B5es-webhooks
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Webhook do Pagar.me recebida')
    console.log('📋 Headers recebidos:', Object.fromEntries(request.headers.entries()))
    console.log('📋 Method:', request.method)
    console.log('📋 URL:', request.url)

    // Obter dados da requisição
    const bodyBytes = await request.arrayBuffer()
    const bodyText = Buffer.from(bodyBytes).toString()

    console.log('📋 Raw body:', bodyText)

    // Validar se é JSON válido
    let body
    try {
      body = JSON.parse(bodyText)
    } catch (parseError) {
      console.error('❌ Body não é JSON válido:', parseError)
      // Para Pagar.me, ainda devemos retornar 200 mesmo com erro
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON body'
      }, { status: 200 })
    }

    // Verificar assinatura da webhook (opcional mas recomendado)
    const signature = request.headers.get('X-Hub-Signature-256') || ''
    const secretKey = process.env.PAGARME_WEBHOOK_SECRET || ''

    if (secretKey && signature) {
      const expectedSignature = createHmac('sha256', secretKey)
        .update(bodyText)
        .digest('hex')

      const actualSignature = signature.replace('sha256=', '')

      if (!signature.startsWith('sha256=') || expectedSignature !== actualSignature) {
        console.log('❌ Assinatura do webhook inválida')
        return NextResponse.json({
          success: false,
          error: 'Invalid webhook signature'
        }, { status: 401 })
      }
    }

    // Extraír informações do evento
    const { id: eventId, event, data } = body

    console.log('📋 Webhook Event:')
    console.log('  Evento:', event)
    console.log('  ID do Evento:', eventId)
    console.log('  Dados:', JSON.stringify(data, null, 2))

    // Processar diferentes tipos de eventos
    let processedSuccessfully = true
    let errorMessage = null

    try {
      switch (event) {
        case 'order.created':
          console.log('🆕 Pedido criado:', data.id)
          // Aqui você pode salvar o pedido no banco ou atualizar status
          await handleOrderCreated(data)
          break

        case 'order.updated':
          console.log('📝 Pedido atualizado:', data.id, '- Status:', data.status)
          await handleOrderUpdated(data)
          break

        case 'order.payment_failed':
          console.log('❌ Pagamento do pedido falhou:', data.id)
          await handlePaymentFailed(data)
          break

        case 'order.paid':
          console.log('✅ Pedido pago:', data.id)
          await handleOrderPaid(data)
          break

        case 'charge.created':
          console.log('💳 Cobrança criada:', data.id)
          await handleChargeCreated(data)
          break

        case 'charge.updated':
          console.log('📝 Cobrança atualizada:', data.id, '- Status:', data.charges?.data?.[0]?.status)
          await handleChargeUpdated(data)
          break

        case 'charge.payment_failed':
          console.log('❌ Pagamento da cobrança falhou:', data.id)
          await handleChargePaymentFailed(data)
          break

        case 'charge.paid':
          console.log('✅ Cobrança paga:', data.id)
          await handleChargePaid(data)
          break

        case 'customer.created':
          console.log('👤 Comprador criado:', data.id)
          await handleCustomerCreated(data)
          break

        case 'customer.updated':
          console.log('📝 Comprador atualizado:', data.id)
          await handleCustomerUpdated(data)
          break

        default:
          console.log('ℹ️  Evento não processado:', event)
          break
      }
    } catch (processingError: any) {
      console.error('❌ Erro ao processar webhook:', processingError.message)
      processedSuccessfully = false
      errorMessage = processingError.message
    }

    // Responder conforme especificação do Pagar.me
    // Deve retornar 200 para confirmar recebimento
    return NextResponse.json({
      success: processedSuccessfully,
      message: processedSuccessfully ? 'Webhook processed' : 'Webhook processing failed',
      eventId: eventId,
      event: event,
      ...(errorMessage && { error: errorMessage })
    }, {
      status: processedSuccessfully ? 200 : 200 // Sempre 200 para Pagar.me
    })

  } catch (error: any) {
    console.error('❌ Erro geral no webhook:', error.message)

    // Mesmo em caso de erro, retornar 200 para evitar reenvios
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Webhook processing failed but acknowledged'
    }, { status: 200 })
  }
}

/**
 * Processa evento de pedido criado
 */
async function handleOrderCreated(orderData: any) {
  console.log('📝 Processando criação de pedido:', orderData.id)

  try {
    // Criar registro de pagamento para rastreamento
    await createPaymentRecord(orderData.id, {
      pagarme_order_id: orderData.id,
      amount: orderData.amount,
      status: 'pending',
      payment_method: 'pix',
      event_type: 'order_created',
      created_at: new Date().toISOString()
    })

    console.log('✅ Pedido registrado no sistema:', orderData.id)
  } catch (error) {
    console.error('❌ Erro ao processar criação do pedido:', error)
    throw error
  }
}

/**
 * Processa evento de pedido atualizado
 */
async function handleOrderUpdated(orderData: any) {
  console.log('📝 Processando atualização de pedido:', orderData.id, '- Status:', orderData.status)

  // Map Pagar.me status to internal database status
  const statusMapping: Record<string, string> = {
    'pending': 'pending',
    'paid': 'confirmed',  // Pagar.me paid → internal confirmed
    'canceled': 'cancelled',
    'failed': 'cancelled'
  }

  const dbStatus = statusMapping[orderData.status] || orderData.status

  try {
    await updateOrderStatus(orderData.id, dbStatus, {
      pagarme_status: orderData.status,
      event_type: 'order_updated',
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', error)
    throw error
  }
}

/**
 * Processa evento de pagamento falhado
 */
async function handlePaymentFailed(orderData: any) {
  console.log('❌ Processando falha de pagamento:', orderData.id)

  try {
    await updateOrderStatus(orderData.id, 'cancelled', {
      pagarme_status: 'payment_failed',
      failure_reason: orderData.failure_reason || 'Unknown',
      event_type: 'payment_failed',
      updated_at: new Date().toISOString()
    })

    // TODO: Implementar notificação de falha por email
    console.log('📧 TODO: Enviar notificação de falha para o cliente')

  } catch (error) {
    console.error('❌ Erro ao processar falha de pagamento:', error)
    throw error
  }
}

/**
 * Processa evento de pedido pago
 */
async function handleOrderPaid(orderData: any) {
  console.log('✅ Processando pedido pago:', orderData.id)

  try {
    // Verifica se é um pagamento de teste/simulador (aprovação imediata)
    const isSimulatorPayment = orderData.metadata?.source === 'pix_simulator' ||
                              orderData.amount < 1000 || // Pagamentos pequenos geralmente são testes
                              orderData.customer?.email?.includes('teste') ||
                              new Date(orderData.created_at) > new Date(Date.now() - 5 * 60 * 1000) // Criado nos últimos 5 minutos

    const targetStatus = isSimulatorPayment ? 'confirmed' : 'confirmed'

    console.log(`📋 Pagamento classificado como: ${isSimulatorPayment ? 'SIMULADOR (confirmação imediata)' : 'PRODUÇÃO'}`)

    await updateOrderStatus(orderData.id, targetStatus, {
      pagarme_status: 'paid',
      payment_date: new Date().toISOString(),
      event_type: 'order_paid',
      paid_amount: orderData.amount,
      is_simulator: isSimulatorPayment,
      simulator_instructions: isSimulatorPayment ? 'Pagamento aprovado via simulador PIX - não requer ação manual' : null,
      updated_at: new Date().toISOString()
    })

    if (isSimulatorPayment) {
      console.log('🎯 SIMULADOR: Pedido confirmado imediatamente!')
    }

    // TODO: Implementar ativação de produtos/serviços
    console.log('🎯 TODO: Ativar produtos/serviços para o cliente')

    // TODO: Implementar notificação de confirmação
    console.log('📧 TODO: Enviar confirmação de pagamento para o cliente')

  } catch (error) {
    console.error('❌ Erro ao processar pedido pago:', error)
    throw error
  }
}

/**
 * Processa evento de cobrança criada
 */
async function handleChargeCreated(chargeData: any) {
  console.log('💳 Processando criação de cobrança:', chargeData.id)

  // TODO: Salvar cobrança no banco
  // Exemplo:
  // await saveChargeToDatabase({
  //   chargeId: chargeData.id,
  //   orderId: chargeData.order?.id,
  //   amount: chargeData.amount,
  //   status: 'pending',
  //   paymentMethod: chargeData.payment_method
  // })
}

/**
 * Processa evento de cobrança atualizada
 */
async function handleChargeUpdated(chargeData: any) {
  console.log('📝 Processando atualização de cobrança:', chargeData.id)

  // TODO: Atualizar status da cobrança
  // const payment = chargeData.charges?.data?.[0]
  // if (payment) {
  //   await updateChargeStatus(chargeData.id, payment.status)
  // }
}

/**
 * Processa evento de falha no pagamento da cobrança
 */
async function handleChargePaymentFailed(chargeData: any) {
  console.log('❌ Processando falha de pagamento da cobrança:', chargeData.id)

  // TODO: Atualizar status e notificar usuário
  // await updateChargeStatus(chargeData.id, 'failed')
  // const orderId = chargeData.order?.id
  // if (orderId) {
  //   await updateOrderStatus(orderId, 'payment_failed')
  // }
}

/**
 * Processa evento de cobrança paga
 */
async function handleChargePaid(chargeData: any) {
  console.log('✅ Processando cobrança paga:', chargeData.id)

  // TODO: Atualizar status, ativar produtos e enviar confirmação
  // await updateChargeStatus(chargeData.id, 'paid')
  // const orderId = chargeData.order?.id
  // if (orderId) {
  //   await updateOrderStatus(orderId, 'paid')
  //   await activateUserProducts(chargeData.customer?.id)
  // }
}

/**
 * Processa evento de comprador criado
 */
async function handleCustomerCreated(customerData: any) {
  console.log('👤 Processando criação de comprador:', customerData.id)

  // TODO: Salvar dados do comprador no banco se necessário
  // Exemplo:
  // await saveCustomerToDatabase({
  //   customerId: customerData.id,
  //   name: customerData.name,
  //   email: customerData.email,
  //   document: customerData.document
  // })
}

/**
 * Processa evento de comprador atualizado
 */
async function handleCustomerUpdated(customerData: any) {
  console.log('📝 Processando atualização de comprador:', customerData.id)

  // TODO: Atualizar dados do comprador no banco
  // await updateCustomerData(customerData.id, customerData)
}

export async function GET() {
  return NextResponse.json({
    message: 'Pagar.me Webhook Endpoint',
    status: 'active',
    events_supported: [
      'order.created',
      'order.updated',
      'order.payment_failed',
      'order.paid',
      'charge.created',
      'charge.updated',
      'charge.payment_failed',
      'charge.paid',
      'customer.created',
      'customer.updated'
    ],
    setup_url: 'https://dashboard.pagar.me/settings/webhooks',
    webhook_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/webhooks/pagar-me`,
    example_payload: {
      id: 'wh_xxxxxxxxxxxxxxxxxx',
      event: 'order.paid',
      data: {
        id: 'or_xxxxxxxxxxxxxxxxxx',
        status: 'paid',
        amount: 1000,
        customer: { id: 'cus_xxxxxxxxxxxxxxxxxx' }
      }
    }
  })
}
