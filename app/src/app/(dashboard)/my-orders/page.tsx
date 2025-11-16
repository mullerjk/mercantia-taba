'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/components/pages/orders/OrderStatus'
import { useAuth } from '@/contexts/AuthContext'
import { Package, Loader2, ShoppingCart } from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  pricePerUnit: number
  total: number
  productName?: string
  productSlug?: string
}

interface Order {
  id: string
  userId: string
  storeId: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
  notes?: string | null
  createdAt: string
  updatedAt: string
  confirmedAt?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
}

export default function MyOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Load orders
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders?limit=50&offset=0', {
          headers: { 'x-user-id': user.id },
        })

        if (response.ok) {
          const result = await response.json()
          setOrders(result.data || [])
        }
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to place your first order</p>

          <Link href="/dashboard/marketplace">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedOrder = selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-600 mt-1">Track and manage your orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-lg mb-4">Orders ({orders.length})</h2>

          {orders.map((order) => (
            <Card
              key={order.id}
              className={`cursor-pointer transition-all ${
                selectedOrderId === order.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedOrderId(order.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <Badge className="text-xs">{order.status}</Badge>
                  </div>

                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p className="font-bold text-lg">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Status Timeline */}
              <OrderStatus
                status={selectedOrder.status}
                createdAt={selectedOrder.createdAt}
                confirmedAt={selectedOrder.confirmedAt}
                shippedAt={selectedOrder.shippedAt}
                deliveredAt={selectedOrder.deliveredAt}
                orderId={selectedOrder.id}
              />

              {/* Order Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono text-sm">{selectedOrder.id.slice(0, 12)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="text-sm">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${(selectedOrder.subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span>${(selectedOrder.tax / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>${(selectedOrder.shippingCost / 100).toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${(selectedOrder.discount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${(selectedOrder.total / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 grid grid-cols-2 gap-2">
                    <Link href={`/dashboard/my-orders/${selectedOrder.id}`}>
                      <Button variant="outline" className="w-full text-sm">
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full text-sm">
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="flex items-center justify-center min-h-96">
              <CardContent className="text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select an order to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
