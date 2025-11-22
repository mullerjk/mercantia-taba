import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase-service'

/**
 * API para verificar status de pagamento PIX
 * Usado pelo frontend para detectar quando webhook atualizou pedido
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id
    console.log(`🔍 Verificando status do pagamento: ${paymentId}`)

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID is required'
      }, { status: 400 })
    }

    // Tentar encontrar pedido pelo ID do pagamento
    // Como os IDs podem ser diferentes, tentar várias estratégias

    // Estratégia 1: IDs que começam com 'or_' são order IDs
    if (paymentId.startsWith('or_')) {
      try {
        const { data: order, error } = await supabaseService
          .from('orders')
          .select('*')
          .eq('id', paymentId)
          .single()

        if (order) {
          console.log(`✅ Status do pedido ${paymentId}: ${order.status}`)
          return NextResponse.json({
            success: true,
            status: order.status,
            orderId: paymentId,
            paymentId: paymentId,
            updated_at: order.updated_at
          })
        }
      } catch (error) {
        console.log(`⚠️ Order ${paymentId} não encontrado na base:`, error)
      }
    }

    // Estratégia 2: Verificar se é um mock e buscar pedido real
    if (paymentId.startsWith('or_mock_')) {
      // Para mocks, retornar sempre pending (não deve nunca ser confirmed via polling)
      // Só o webhook deve marcar como confirmed
      console.log(`🎭 Mock payment ${paymentId} - sempre pending`)
      return NextResponse.json({
        success: true,
        status: 'pending',
        orderId: paymentId,
        paymentId: paymentId,
        note: 'Mock payment - status updated only via webhook'
      })
    }

    // Estratégia 3: Buscar em notas de pedidos existentes
    try {
      const { data: orders, error } = await supabaseService
        .from('orders')
        .select('*')
        .limit(50)

      if (orders) {
        // Procurar em notas JSON se há referência ao paymentId
        for (const order of orders) {
          if (order.notes) {
            try {
              const notes = JSON.parse(order.notes)
              if (notes.pagarme_order_id === paymentId) {
                console.log(`✅ Status encontrado via notas: ${order.status}`)
                return NextResponse.json({
                  success: true,
                  status: order.status,
                  orderId: order.id,
                  paymentId: paymentId,
                  updated_at: order.updated_at
                })
              }
            } catch (jsonError) {
              // Ignorar erros de JSON das notas
            }
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Erro ao buscar em notas:', error)
    }

    // Se não encontrou, retornar pending (padrão)
    console.log(`ℹ️ Payment ${paymentId} não encontrado - status: pending`)
    return NextResponse.json({
      success: true,
      status: 'pending',
      orderId: null,
      paymentId: paymentId,
      note: 'Payment not found, assuming pending status'
    })

  } catch (error: any) {
    console.error('❌ Erro ao verificar status do pagamento:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      status: 'unknown'
    }, { status: 500 })
  }
}
