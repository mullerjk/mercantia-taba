'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/contexts/AuthContext'
import { shippingAddressSchema, type ShippingAddressInput } from '@/lib/validations'
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SavedAddress } from './AddressSelector'

interface AddressFormProps {
  address?: SavedAddress
  onSuccess: (address: SavedAddress) => void
  onCancel: () => void
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address ? {
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault || false,
    } : {
      isDefault: false,
      country: 'Brasil',
    },
  })

  const isDefault = watch('isDefault')

  const onSubmit = async (data: ShippingAddressInput) => {
    setSubmitting(true)
    setError(null)

    try {
      const url = address
        ? `/api/shipping-addresses/${address.id}`
        : '/api/shipping-addresses'

      const method = address ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar endereço')
      }

      const result = await response.json()
      const savedAddress: SavedAddress = {
        id: result.id || address?.id || '',
        fullName: data.fullName,
        street: data.street,
        city: data.city,
        state: data.state || undefined,
        zipCode: data.zipCode,
        country: data.country,
        phone: data.phone || undefined,
        email: data.email || undefined,
        isDefault: data.isDefault,
      }

      onSuccess(savedAddress)
      reset()
    } catch (err) {
      console.error('Error saving address:', err)
      setError(err instanceof Error ? err.message : 'Erro ao salvar endereço')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={submitting}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <CardTitle>{address ? 'Editar Endereço' : 'Novo Endereço'}</CardTitle>
            <CardDescription>
              {address ? 'Atualize seu endereço' : 'Preencha os dados do seu endereço'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                placeholder="João Silva"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email (Opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Phone and Street Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone (Opcional)</Label>
              <Input
                id="phone"
                placeholder="(11) 98765-4321"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                placeholder="12345-678"
                {...register('zipCode')}
                className={errors.zipCode ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.zipCode && (
                <p className="text-xs text-red-500 mt-1">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          {/* Street Full Width */}
          <div>
            <Label htmlFor="street">Rua e Número *</Label>
            <Input
              id="street"
              placeholder="Avenida Paulista, 1000"
              {...register('street')}
              className={errors.street ? 'border-red-500' : ''}
              disabled={submitting}
            />
            {errors.street && (
              <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>
            )}
          </div>

          {/* City, State, Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="São Paulo"
                {...register('city')}
                className={errors.city ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">Estado (UF) *</Label>
              <Input
                id="state"
                placeholder="SP"
                maxLength={2}
                {...register('state')}
                className={errors.state ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                placeholder="Brasil"
                {...register('country')}
                className={errors.country ? 'border-red-500' : ''}
                disabled={submitting}
              />
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Checkbox
              id="isDefault"
              {...register('isDefault')}
              disabled={submitting}
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              Definir como endereço padrão
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                address ? 'Atualizar Endereço' : 'Adicionar Endereço'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
