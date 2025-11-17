'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

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
  items: CartItem[]
  total: number
  itemCount: number
}

export function useCartAPI() {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartData>({ items: [], total: 0, itemCount: 0 })
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0, itemCount: 0 })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/cart', {
        headers: { 'x-user-id': user.id },
      })

      if (response.ok) {
        const data = await response.json()
        const totalQuantity = data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
        const totalPrice = data.items?.reduce((sum: number, item: CartItem) => sum + (item.pricePerUnit * item.quantity), 0) || 0

        setCart({
          items: data.items || [],
          total: totalPrice,
          itemCount: totalQuantity,
        })
      } else {
        setCart({ items: [], total: 0, itemCount: 0 })
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart({ items: [], total: 0, itemCount: 0 })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdated)
    return () => window.removeEventListener('cartUpdated', handleCartUpdated)
  }, [fetchCart])

  const addItem = async (productId: string, quantity: number = 1) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        await fetchCart()
        window.dispatchEvent(new Event('cartUpdated'))
        return { error: null }
      }
      return { error: 'Failed to add item' }
    } catch (error) {
      console.error('Error adding item:', error)
      return { error: 'Failed to add item' }
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return { error: 'Invalid request' }

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
        await fetchCart()
        window.dispatchEvent(new Event('cartUpdated'))
        return { error: null }
      }
      return { error: 'Failed to update quantity' }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return { error: 'Failed to update quantity' }
    }
  }

  const removeItem = async (itemId: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const response = await fetch(`/api/cart/items?itemId=${itemId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id },
      })

      if (response.ok) {
        await fetchCart()
        window.dispatchEvent(new Event('cartUpdated'))
        return { error: null }
      }
      return { error: 'Failed to remove item' }
    } catch (error) {
      console.error('Error removing item:', error)
      return { error: 'Failed to remove item' }
    }
  }

  const clearCart = async () => {
    if (!user) return { error: 'User not authenticated' }

    try {
      // Remove all items one by one
      for (const item of cart.items) {
        await removeItem(item.id)
      }
      return { error: null }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { error: 'Failed to clear cart' }
    }
  }

  return {
    cart,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refresh: fetchCart,
  }
}
