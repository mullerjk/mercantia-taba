'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShippingForm } from './checkout/ShippingForm'
import { PaymentMethodSelector } from './checkout/PaymentMethodSelector'
import { useAuth } from '@/contexts/AuthContext'
import { useCartAPI } from '@/hooks/useCartAPI'
import { ArrowLeft, AlertCircle, Check, MapPin, CreditCard, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Alert, AlertDescription } from '@/components/ui/alert'

type CheckoutStep = 'cart' | 'shipping' | 'payment'

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { cart, loading, updateQuantity, removeItem } = useCartAPI()
  const [submitting, setSubmitting] = useState(false)
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart')
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [user, router])

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    await updateQuantity(itemId, quantity)
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleCheckout = async (addressId: string) => {
    if (!user || cart.items.length === 0) return

    setShippingAddressId(addressId)
    setCurrentStep('payment')
    setPaymentError(null)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!user || cart.items.length === 0 || !shippingAddressId) return

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

  // Show loading while fetching cart
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Carregando carrinho...</p>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
            <Link href="/marketplace">
              <Button>Ir para Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate totals
  const subtotal = cart.total
  const tax = Math.round(subtotal * 0.1) // 10% tax
  const shipping = 1000 // $10 shipping (in cents)
  const total = subtotal + tax + shipping

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (currentStep === 'payment') {
              setCurrentStep('shipping')
            } else if (currentStep === 'shipping') {
              setCurrentStep('cart')
            } else {
              router.push('/marketplace')
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-gray-600 text-sm mt-1">
            {currentStep === 'cart' ? 'Passo 1: Revise seu carrinho' : currentStep === 'shipping' ? 'Passo 2: Selecione seu endereço de entrega' : 'Passo 3: Escolha o método de pagamento'}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between gap-2 max-w-full">
        {/* Step 1: Cart */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep === 'cart' || currentStep === 'shipping' || currentStep === 'payment'
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300'
          }`}>
            {currentStep !== 'cart' ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </div>
          <div className="hidden sm:block flex-1">
            <p className="font-semibold text-sm">Carrinho</p>
          </div>
        </div>

        {/* Divider 1 */}
        <div className={`h-1 flex-1 rounded ${currentStep === 'shipping' || currentStep === 'payment' ? 'bg-primary' : 'bg-gray-300'}`} />

        {/* Step 2: Shipping */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep === 'shipping' || currentStep === 'payment'
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300'
          }`}>
            {currentStep === 'payment' ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>
          <div className="hidden sm:block flex-1">
            <p className="font-semibold text-sm">Endereço</p>
          </div>
        </div>

        {/* Divider 2 */}
        <div className={`h-1 flex-1 rounded ${currentStep === 'payment' ? 'bg-primary' : 'bg-gray-300'}`} />

        {/* Step 3: Payment */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep === 'payment'
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300'
          }`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="hidden sm:block flex-1">
            <p className="font-semibold text-sm">Pagamento</p>
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
              <CardTitle>{currentStep === 'cart' ? 'Revise seu Carrinho' : currentStep === 'shipping' ? 'Endereço de Entrega' : 'Método de Pagamento'}</CardTitle>
              <CardDescription>
                {currentStep === 'cart'
                  ? 'Ajuste as quantidades ou remova itens'
                  : currentStep === 'shipping'
                  ? 'Selecione ou adicione um endereço de entrega'
                  : 'Escolha como deseja pagar sua compra'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 'cart' ? (
                <div className="space-y-4">
                  {cart.items.map((item) => {
                    const itemTotal = (item.pricePerUnit * item.quantity) / 100
                    const productName = item.product?.name || 'Product'
                    const productImage = item.product?.images?.[0]?.url

                    return (
                      <div key={item.id} className="pb-4 border-b last:border-b-0">
                        <div className="flex gap-4">
                          {productImage && (
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <Image
                                src={productImage}
                                alt={productName}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{productName}</h3>
                              <span className="text-lg font-bold text-primary">R$ {itemTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Preço unitário: R$ {(item.pricePerUnit / 100).toFixed(2)}</p>

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-200 disabled:opacity-50 transition-colors rounded"
                                  aria-label="Diminuir quantidade"
                                >
                                  <Minus className="w-5 h-5" />
                                </button>
                                <div className="flex flex-col items-center">
                                  <span className="text-2xl font-bold min-w-[3rem] text-center">{item.quantity}</span>
                                  <span className="text-xs text-gray-600">un</span>
                                </div>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-200 transition-colors rounded"
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm transition-colors rounded border border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <div className="pt-4 border-t">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setCurrentStep('shipping')}
                      disabled={cart.items.length === 0}
                    >
                      Continuar para Endereço
                    </Button>
                  </div>
                </div>
              ) : currentStep === 'shipping' ? (
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
                      <p className="text-gray-600">{item.quantity} × R$ {(item.pricePerUnit / 100).toFixed(2)}</p>
                    </div>
                    <p className="font-semibold">R$ {((item.pricePerUnit * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setCurrentStep('cart')}
                disabled={currentStep === 'cart'}
              >
                Editar Carrinho
              </Button>

              {/* Pricing Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {(subtotal / 100).toFixed(2)}</span>
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
    </div>
  )
}
