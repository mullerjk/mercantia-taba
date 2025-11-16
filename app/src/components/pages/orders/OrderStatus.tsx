'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Package, Truck, Home, AlertCircle, RotateCcw } from 'lucide-react'

type OrderStatusType = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

interface OrderStatusProps {
  status: OrderStatusType
  createdAt: Date | string
  confirmedAt?: Date | string | null
  shippedAt?: Date | string | null
  deliveredAt?: Date | string | null
  orderId: string
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Awaiting confirmation',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle2,
    description: 'Order confirmed',
  },
  processing: {
    label: 'Processing',
    color: 'bg-purple-100 text-purple-800',
    icon: Package,
    description: 'Being prepared',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-cyan-100 text-cyan-800',
    icon: Truck,
    description: 'On the way',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: Home,
    description: 'Delivered',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle,
    description: 'Order cancelled',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800',
    icon: RotateCcw,
    description: 'Refund issued',
  },
}

const timeline = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

export function OrderStatus({
  status,
  createdAt,
  confirmedAt,
  shippedAt,
  deliveredAt,
  orderId,
}: OrderStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  const isCompleted = (statusKey: string) => {
    const completed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
    return completed.indexOf(statusKey) <= completed.indexOf(status)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Order #{orderId.slice(0, 8).toUpperCase()}</CardDescription>
          </div>
          <Badge className={config.color}>
            <Icon className="w-4 h-4 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="space-y-4">
          {timeline.map((item, idx) => {
            const completed = isCompleted(item.key)
            const TimelineIcon = item.icon

            return (
              <div key={item.key} className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <TimelineIcon className={`w-5 h-5 ${completed ? 'text-green-600' : 'text-gray-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.label}
                  </p>

                  {/* Timestamp */}
                  {item.key === 'pending' && createdAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(createdAt).toLocaleDateString()} at{' '}
                      {new Date(createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {item.key === 'confirmed' && confirmedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(confirmedAt).toLocaleDateString()}
                    </p>
                  )}
                  {item.key === 'shipped' && shippedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(shippedAt).toLocaleDateString()}
                    </p>
                  )}
                  {item.key === 'delivered' && deliveredAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(deliveredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Connector */}
                {idx < timeline.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-12 ${completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Status Description */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">{config.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
