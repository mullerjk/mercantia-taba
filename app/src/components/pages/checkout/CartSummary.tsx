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
  name?: string
  image?: string
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
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>{items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'itens'} no carrinho</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => {
            const productName = item.product?.name || item.name || 'Product'
            const productImage = item.product?.images?.[0]?.url || item.image

            return (
              <div key={item.id} className="pb-4 border-b last:border-b-0">
                <div className="flex gap-3 items-start">
                  {/* Product Image */}
                  {productImage && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={productImage}
                        alt={productName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1">{productName}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × R$ {(item.pricePerUnit / 100).toFixed(2)}
                    </p>

                    {showActions && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemoveItem?.(item.id)}
                          className="ml-auto px-3 py-1 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-right font-semibold whitespace-nowrap self-start">
                    R$ {((item.pricePerUnit * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>R$ {(subtotal / 100).toFixed(2)}</span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Impostos</span>
              <span>R$ {(tax / 100).toFixed(2)}</span>
            </div>
          )}

          {shipping > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frete</span>
              <span>R$ {(shipping / 100).toFixed(2)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto</span>
              <span>-R$ {(discount / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>R$ {(total / 100).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
