'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CartSummary } from '@/components/pages/checkout/CartSummary'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react'

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

export default function CartPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

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
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [user, router])

  const handleRemoveItem = async (itemId: string) => {
    if (!user || !cart) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/cart/items?itemId=${itemId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id },
      })

      if (response.ok) {
        setCart((prev) => {
          if (!prev) return null
          const updatedItems = prev.items.filter((item) => item.id !== itemId)
          return {
            ...prev,
            items: updatedItems,
            totals: {
              subtotal: updatedItems.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0),
              itemCount: updatedItems.length,
            },
          }
        })
      }
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (!user || !cart || quantity < 1) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/cart/items?itemId=${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        setCart((prev) => {
          if (!prev) return null
          const updatedItems = prev.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
          return {
            ...prev,
            items: updatedItems,
            totals: {
              subtotal: updatedItems.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0),
              itemCount: updatedItems.length,
            },
          }
        })
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdating(false)
    }
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
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>

          <Link href="/dashboard/marketplace">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/marketplace">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartSummary
            items={cart.items}
            subtotal={cart.totals.subtotal}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            showActions={true}
          />
        </div>

        {/* Summary & Actions */}
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-2xl font-bold">${(cart.totals.subtotal / 100).toFixed(2)}</p>
            </div>

            <p className="text-xs text-gray-500">
              Taxes and shipping costs will be calculated at checkout
            </p>

            <Link href="/dashboard/checkout" className="block">
              <Button className="w-full" size="lg" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </Link>

            <Link href="/dashboard/marketplace" className="block">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Free Shipping Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
