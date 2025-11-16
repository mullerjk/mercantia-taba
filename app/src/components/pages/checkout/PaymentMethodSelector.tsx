'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CreditCard, QrCode, Banknote } from 'lucide-react'
import { CreditCardForm } from './PaymentMethods/CreditCardForm'
import { PIXForm } from './PaymentMethods/PIXForm'
import { BoletoForm } from './PaymentMethods/BoletoForm'

export type PaymentMethod = 'card' | 'pix' | 'boleto'

interface PaymentMethodSelectorProps {
  total: number
  orderId?: string
  customerId?: string
  onPaymentSuccess?: (paymentId: string, method: PaymentMethod) => void
  onPaymentError?: (error: string) => void
  loading?: boolean
}

export function PaymentMethodSelector({
  total,
  orderId,
  customerId,
  onPaymentSuccess,
  onPaymentError,
  loading = false,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const [processing, setProcessing] = useState(false)

  const handlePaymentSuccess = (paymentId: string) => {
    setProcessing(false)
    onPaymentSuccess?.(paymentId, selectedMethod)
  }

  const handlePaymentError = (error: string) => {
    setProcessing(false)
    onPaymentError?.(error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pagamento</CardTitle>
        <CardDescription>
          Selecione como deseja pagar (Total: R$ {(total / 100).toFixed(2)})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
          <div className="space-y-3">
            {/* Credit Card Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setSelectedMethod('card')}>
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                <div>
                  <div className="font-medium">Cartão de Crédito</div>
                  <div className="text-sm text-gray-500">Parcelado até 12x sem juros</div>
                </div>
              </Label>
            </div>

            {/* PIX Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setSelectedMethod('pix')}>
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix" className="flex-1 cursor-pointer flex items-center gap-3">
                <QrCode className="w-5 h-5" />
                <div>
                  <div className="font-medium">PIX</div>
                  <div className="text-sm text-gray-500">Pagamento instantâneo com desconto de 2%</div>
                </div>
              </Label>
            </div>

            {/* Boleto Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setSelectedMethod('boleto')}>
              <RadioGroupItem value="boleto" id="boleto" />
              <Label htmlFor="boleto" className="flex-1 cursor-pointer flex items-center gap-3">
                <Banknote className="w-5 h-5" />
                <div>
                  <div className="font-medium">Boleto Bancário</div>
                  <div className="text-sm text-gray-500">Vencimento em 3 dias úteis</div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>

        {/* Payment Form Based on Selected Method */}
        <div className="mt-6 pt-6 border-t">
          {selectedMethod === 'card' && (
            <CreditCardForm
              total={total}
              orderId={orderId}
              customerId={customerId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              loading={loading || processing}
            />
          )}

          {selectedMethod === 'pix' && (
            <PIXForm
              total={total}
              orderId={orderId}
              customerId={customerId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              loading={loading || processing}
            />
          )}

          {selectedMethod === 'boleto' && (
            <BoletoForm
              total={total}
              orderId={orderId}
              customerId={customerId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              loading={loading || processing}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
