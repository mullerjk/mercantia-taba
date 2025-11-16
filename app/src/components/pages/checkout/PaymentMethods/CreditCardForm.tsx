'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'

interface CreditCardFormProps {
  total: number
  orderId?: string
  customerId?: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  loading?: boolean
}

interface CardFormData {
  cardNumber: string
  cardholderName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  installments: string
}

export function CreditCardForm({
  total,
  orderId,
  customerId,
  onSuccess,
  onError,
  loading = false,
}: CreditCardFormProps) {
  const { user } = useAuth()
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<CardFormData>({
    defaultValues: {
      installments: '1',
      cardholderName: user?.fullName || '',
    },
  })
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const installments = watch('installments')

  // Pre-fill cardholder name with user's full name
  useEffect(() => {
    if (user?.fullName) {
      setValue('cardholderName', user.fullName)
    }
  }, [user, setValue])

  const onSubmit = async (data: CardFormData) => {
    setProcessing(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/payments/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: data.cardNumber.replace(/\s/g, ''),
          cardholderName: data.cardholderName,
          expiryMonth: parseInt(data.expiryMonth),
          expiryYear: parseInt(data.expiryYear),
          cvv: data.cvv,
          installments: parseInt(data.installments),
          amount: total,
          orderId,
          customerId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setSubmitError(error.message || 'Erro ao processar pagamento')
        onError(error.message || 'Erro ao processar pagamento')
        return
      }

      const result = await response.json()
      onSuccess(result.transactionId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setSubmitError(errorMessage)
      onError(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  // Format card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    value = value.replace(/(.{4})/g, '$1 ').trim()
    setValue('cardNumber', value)
  }

  // Format expiry input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    e.target.value = value
  }

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i))
  const installmentOptions = Array.from({ length: 12 }, (_, i) => String(i + 1))

  const monthlyAmount = total / parseInt(installments)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Cardholder Name */}
      <div>
        <Label htmlFor="cardholderName">Nome do Titular</Label>
        <Input
          id="cardholderName"
          placeholder="João Silva"
          {...register('cardholderName', { required: 'Nome é obrigatório' })}
          className={errors.cardholderName ? 'border-red-500' : ''}
          disabled={processing || loading}
        />
        {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName.message}</p>}
      </div>

      {/* Card Number */}
      <div>
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          {...register('cardNumber', {
            required: 'Número do cartão é obrigatório',
            minLength: { value: 19, message: 'Cartão inválido' },
          })}
          onChange={handleCardNumberChange}
          className={errors.cardNumber ? 'border-red-500' : ''}
          disabled={processing || loading}
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Validade</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            maxLength={5}
            onChange={(e) => {
              handleExpiryChange(e)
              const value = e.target.value.split('/')
              if (value[0]) setValue('expiryMonth', value[0])
              if (value[1]) setValue('expiryYear', '20' + value[1])
            }}
            disabled={processing || loading}
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            maxLength={4}
            type="password"
            {...register('cvv', {
              required: 'CVV é obrigatório',
              minLength: { value: 3, message: 'CVV deve ter 3 ou 4 dígitos' },
            })}
            className={errors.cvv ? 'border-red-500' : ''}
            disabled={processing || loading}
          />
          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
        </div>
      </div>

      {/* Installments */}
      <div>
        <Label htmlFor="installments">Parcelamento</Label>
        <Select
          value={installments}
          onValueChange={(value) => setValue('installments', value)}
          disabled={processing || loading}
        >
          <SelectTrigger id="installments">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {installmentOptions.map((inst) => (
              <SelectItem key={inst} value={inst}>
                {inst}x de R$ {(monthlyAmount / 100).toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={processing || loading}
      >
        {processing || loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          `Pagar R$ ${(total / 100).toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Seus dados são criptografados e seguros
      </p>
    </form>
  )
}
