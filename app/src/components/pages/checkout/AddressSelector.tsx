'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddressCard } from './AddressCard'
import { AddressForm } from './AddressForm'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export interface SavedAddress {
  id: string
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
  email?: string
}

interface AddressSelectorProps {
  onAddressSelect: (addressId: string) => void
  disabled?: boolean
}

export function AddressSelector({ onAddressSelect, disabled = false }: AddressSelectorProps) {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load addresses
  useEffect(() => {
    if (!user) return

    const loadAddresses = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/shipping-addresses', {
          headers: {
            'x-user-id': user.id,
          },
        })

        if (response.ok) {
          const result = await response.json()
          const addressList = result.data || []
          setAddresses(addressList)

          // Auto-select default address or first address
          const defaultAddress = addressList.find((a) => a.isDefault)
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id)
            onAddressSelect(defaultAddress.id)
          } else if (addressList.length > 0) {
            setSelectedAddressId(addressList[0].id)
            onAddressSelect(addressList[0].id)
          }
        } else {
          setError('Erro ao carregar endereços')
        }
      } catch (err) {
        console.error('Error loading addresses:', err)
        setError('Erro ao carregar endereços')
      } finally {
        setLoading(false)
      }
    }

    loadAddresses()
  }, [user, onAddressSelect])

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id)
    onAddressSelect(id)
  }

  const handleAddressAdded = (newAddress: SavedAddress) => {
    setAddresses([...addresses, newAddress])
    setSelectedAddressId(newAddress.id)
    onAddressSelect(newAddress.id)
    setShowForm(false)
  }

  const handleAddressUpdated = (updatedAddress: SavedAddress) => {
    setAddresses(addresses.map((a) => (a.id === updatedAddress.id ? updatedAddress : a)))
    setEditingId(null)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!user || !confirm('Tem certeza que deseja remover este endereço?')) return

    try {
      const response = await fetch(`/api/shipping-addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
        },
      })

      if (response.ok) {
        const updatedAddresses = addresses.filter((a) => a.id !== id)
        setAddresses(updatedAddresses)

        if (selectedAddressId === id) {
          const newSelection = updatedAddresses[0]?.id || null
          setSelectedAddressId(newSelection)
          if (newSelection) {
            onAddressSelect(newSelection)
          }
        }
      }
    } catch (err) {
      console.error('Error deleting address:', err)
      setError('Erro ao remover endereço')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  // Show form for new address or editing
  if (showForm || editingId) {
    return (
      <AddressForm
        address={editingId ? addresses.find((a) => a.id === editingId) : undefined}
        onSuccess={editingId ? handleAddressUpdated : handleAddressAdded}
        onCancel={() => {
          setShowForm(false)
          setEditingId(null)
        }}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço de Entrega</CardTitle>
        <CardDescription>
          {addresses.length > 0
            ? 'Selecione um endereço salvo ou adicione um novo'
            : 'Adicione um endereço para continuar'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Saved Addresses Grid */}
        {addresses.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-3">Meus Endereços</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  {...address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={handleAddressSelect}
                  onEdit={() => setEditingId(address.id)}
                  onDelete={() => handleDeleteAddress(address.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add New Address Button */}
        <Button
          onClick={() => setShowForm(true)}
          variant={addresses.length === 0 ? 'default' : 'outline'}
          className="w-full"
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          {addresses.length === 0 ? 'Adicionar Primeiro Endereço' : 'Adicionar Novo Endereço'}
        </Button>
      </CardContent>
    </Card>
  )
}
