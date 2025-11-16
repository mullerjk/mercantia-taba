'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CartSummary } from './CartSummary'
import { ShippingForm } from './ShippingForm'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Loader2, AlertCircle, Check, MapPin, CreditCard } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CartItem {
  id: string
  productId: string
  quantity: number
  pricePerUnit: number
  product?: {
    id: string
    name: string
    slug: string
    images?: Array<{ url: string; alt?: string }>
    currentPrice: number
  }
}

interface CartData {
  cart: { id: string; userId: string; createdAt: string; updatedAt: string }
  items: CartItem[]
  totals: { subtotal: number; itemCount: number }
}

type CheckoutStep = 'shipping' | 'payment'

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Load cart
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const loadCart = async () => {
      try {
        const response = await fetch('/api/cart', {
          headers: { 'x-user-id': user.id },
        })

        if (response.ok) {
          const data = await response.json()
          setCart(data)

          // Calculate tax and shipping
          const subtotal = data.totals.subtotal
          setTax(Math.round(subtotal * 0.1)) // 10% tax
          setShipping(1000) // $10 shipping (in cents)
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [user, router])

  const handleCheckout = async (addressId: string) => {
    if (!user || !cart || cart.items.length === 0) return

    setShippingAddressId(addressId)
    setCurrentStep('payment')
    setPaymentError(null)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!user || !cart || cart.items.length === 0 || !shippingAddressId) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          shippingAddressId,
          notes: undefined,
          paymentId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Checkout failed:', error)
        setPaymentError('Erro ao finalizar pedido')
        return
      }

      const result = await response.json()
      // Redirect to order confirmation
      router.push(`/my-orders?created=${result.orders[0].id}`)
    } catch (error) {
      console.error('Error during checkout:', error)
      setPaymentError('Erro ao finalizar pedido')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
          <Link href="/cart">
            <Button>Voltar ao Carrinho</Button>
          </Link>
        </div>
      </div>
    )
  }

  const total = cart.totals.subtotal + tax + shipping

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (currentStep === 'payment') {
              setCurrentStep('shipping')
            } else {
              router.push('/cart')
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-gray-600 text-sm mt-1">
            {currentStep === 'shipping' ? 'Passo 1: Selecione seu endereço de entrega' : 'Passo 2: Escolha o método de pagamento'}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between gap-4 max-w-2xl">
        {/* Step 1: Shipping */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep === 'shipping' || currentStep === 'payment'
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300'
          }`}>
            {currentStep === 'payment' ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Endereço</p>
            <p className="text-xs text-gray-600">Selecione seu endereço</p>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-1 flex-1 rounded ${currentStep === 'payment' ? 'bg-primary' : 'bg-gray-300'}`} />

        {/* Step 2: Payment */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep === 'payment'
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300'
          }`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Pagamento</p>
            <p className="text-xs text-gray-600">Escolha o método</p>
          </div>
        </div>
      </div>

      {paymentError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{currentStep === 'shipping' ? 'Endereço de Entrega' : 'Método de Pagamento'}</CardTitle>
              <CardDescription>
                {currentStep === 'shipping'
                  ? 'Selecione ou adicione um endereço de entrega'
                  : 'Escolha como deseja pagar sua compra'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 'shipping' ? (
                <ShippingForm
                  onSubmit={handleCheckout}
                  loading={submitting}
                />
              ) : (
                <PaymentMethodSelector
                  total={total}
                  orderId={undefined}
                  customerId={user?.id}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  loading={submitting}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items List */}
              <div className="max-h-48 overflow-y-auto space-y-3 border-b pb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || 'Product'}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">R$ {((item.pricePerUnit * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {(cart.totals.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>R$ {(shipping / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impostos</span>
                  <span>R$ {(tax / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold text-primary">R$ {(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="text-green-600 flex-shrink-0">🔒</div>
                <div>
                  <p className="text-sm font-semibold text-green-900">Pagamento Seguro</p>
                  <p className="text-xs text-green-800 mt-1">
                    Suas informações de pagamento são criptografadas e seguras.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Info */}
          {currentStep === 'payment' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-blue-900">Métodos de Pagamento</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Cartão de Crédito (até 12x)</li>
                    <li>✓ PIX (desconto de 2%)</li>
                    <li>✓ Boleto Bancário</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
