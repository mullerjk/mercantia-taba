'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AddressCardProps {
  id: string
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
  isSelected?: boolean
  onSelect: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function AddressCard({
  id,
  fullName,
  street,
  city,
  state,
  zipCode,
  country,
  phone,
  isDefault = false,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'hover:border-gray-400 hover:shadow-sm'
      }`}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with default badge and selection indicator */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {isDefault && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Padrão
                </Badge>
              )}
            </div>
            {isSelected && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-primary">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Address Information */}
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{fullName}</p>
                <p className="text-sm text-gray-600">{street}</p>
                <p className="text-sm text-gray-600">
                  {city}, {state} {zipCode}
                </p>
                {country && <p className="text-xs text-gray-500">{country}</p>}
                {phone && <p className="text-xs text-gray-500 mt-1">{phone}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex gap-2 pt-2 border-t">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(id)
                  }}
                >
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(id)
                  }}
                >
                  Remover
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
