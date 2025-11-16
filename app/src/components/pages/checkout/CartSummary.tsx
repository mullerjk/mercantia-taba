'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

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

interface CartSummaryProps {
  items: CartItem[]
  subtotal: number
  tax?: number
  shipping?: number
  discount?: number
  onRemoveItem?: (itemId: string) => void
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  showActions?: boolean
}

export function CartSummary({
  items,
  subtotal,
  tax = 0,
  shipping = 0,
  discount = 0,
  onRemoveItem,
  onUpdateQuantity,
  showActions = true,
}: CartSummaryProps) {
  const total = subtotal + tax + shipping - discount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>{items.length} items in cart</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 pb-3 border-b last:border-b-0">
              {/* Product Image */}
              {item.product?.images?.[0] && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product?.name || 'Product'}</p>
                <p className="text-sm text-gray-500">${(item.pricePerUnit / 100).toFixed(2)}</p>

                {showActions && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem?.(item.id)}
                      className="ml-auto p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-right font-medium">
                ${((item.pricePerUnit * item.quantity) / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>${(tax / 100).toFixed(2)}</span>
            </div>
          )}

          {shipping > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>${(shipping / 100).toFixed(2)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${(discount / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
