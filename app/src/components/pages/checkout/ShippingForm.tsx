'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { AddressSelector } from './AddressSelector'
import { Loader2 } from 'lucide-react'

interface ShippingFormProps {
  onSubmit: (addressId: string) => void | Promise<void>
  loading?: boolean
}

export function ShippingForm({ onSubmit, loading = false }: ShippingFormProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAddressSelect = useCallback((addressId: string) => {
    setSelectedAddressId(addressId)
  }, [])

  const handleContinue = async () => {
    if (!selectedAddressId) return

    setSubmitting(true)
    try {
      await onSubmit(selectedAddressId)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Address Selector Component */}
      <AddressSelector
        onAddressSelect={handleAddressSelect}
        disabled={loading || submitting}
      />

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        className="w-full"
        size="lg"
        disabled={!selectedAddressId || submitting || loading}
      >
        {submitting || loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          'Continuar para Pagamento'
        )}
      </Button>
    </div>
  )
}
