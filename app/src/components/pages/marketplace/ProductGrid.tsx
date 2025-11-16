'use client'

import React, { useMemo } from 'react'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  images?: Array<{ url: string; alt?: string }>
  rating?: number
  reviewCount?: number
  inventory: number
  storeId: string
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string | null
  itemsPerPage?: number
}

export function ProductGrid({
  products,
  loading = false,
  error = null,
  itemsPerPage = 12,
}: ProductGridProps) {
  const displayedProducts = useMemo(() => {
    return products.slice(0, itemsPerPage)
  }, [products, itemsPerPage])

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full h-48" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-full h-8" />
          </div>
        ))}
      </div>
    )
  }

  if (displayedProducts.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-600">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
