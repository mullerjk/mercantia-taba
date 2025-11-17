'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useCartAPI } from '@/hooks/useCartAPI'
import { ShoppingCart, Star, Package } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number // in cents
  images?: Array<{ url: string; alt?: string }>
  rating?: number
  reviewCount?: number
  inventory: number
  storeId: string
  storeName?: string
  storeSlug?: string
  storeLogoUrl?: string
  storeRating?: number
}

export function ProductCard({
  id,
  name,
  slug,
  description,
  price,
  images,
  rating = 0,
  reviewCount = 0,
  inventory,
  storeId,
  storeName,
  storeSlug,
  storeLogoUrl,
  storeRating = 0,
}: ProductCardProps) {
  const { user } = useAuth()
  const { addItem } = useCartAPI()
  const [loading, setLoading] = React.useState(false)

  const priceInDollars = (price / 100).toFixed(2)
  const imageUrl = images?.[0]?.url
  const isOutOfStock = inventory === 0

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    setLoading(true)
    try {
      await addItem(id, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${slug}`}>
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
            />
          ) : (
            <Package className="w-16 h-16 text-gray-400" />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <CardHeader>
        <Link href={`/product/${slug}`} className="hover:underline">
          <CardTitle className="text-lg truncate">{name}</CardTitle>
        </Link>
        {description && (
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${priceInDollars}</span>
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}
        </div>

        {inventory > 0 && (
          <p className="text-xs text-gray-500">{inventory} in stock</p>
        )}

        {/* Store Info */}
        {storeName && (
          <Link href={`/organization/${storeId}`}>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
              {storeLogoUrl && (
                <img
                  src={storeLogoUrl}
                  alt={storeName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{storeName}</p>
                {storeRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">{storeRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
