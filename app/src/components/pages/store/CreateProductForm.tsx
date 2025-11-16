'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createProductSchema, type CreateProductInput } from '@/lib/validations'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, X } from 'lucide-react'

interface CreateProductFormProps {
  storeId: string
  onSuccess?: () => void
}

export function CreateProductForm({ storeId, onSuccess }: CreateProductFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Array<{ url: string; alt?: string }>>([])
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      storeId,
      price: 0,
      inventory: 0,
      images: [],
    },
  })

  const addImage = () => {
    if (!imageUrl.trim()) return

    setImages([...images, { url: imageUrl, alt: imageAlt || undefined }])
    setImageUrl('')
    setImageAlt('')
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreateProductInput) => {
    if (!user) {
      setError('You must be logged in to create a product')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...data,
        images: images.length > 0 ? images : data.images,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Failed to create product')
        return
      }

      reset()
      setImages([])
      onSuccess?.()
    } catch (err) {
      setError('An error occurred while creating your product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Amazing Product"
              disabled={loading}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Product Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="amazing-product"
              disabled={loading}
            />
            {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your product..."
              rows={4}
              disabled={loading}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (in cents) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="9999 ($99.99)"
                disabled={loading}
              />
              {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost (in cents)</Label>
              <Input
                id="cost"
                type="number"
                {...register('cost', { valueAsNumber: true })}
                placeholder="5000"
                disabled={loading}
              />
              {errors.cost && <p className="text-sm text-red-600">{errors.cost.message}</p>}
            </div>
          </div>

          {/* SKU & Inventory */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="SKU-001"
                disabled={loading}
              />
              {errors.sku && <p className="text-sm text-red-600">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory *</Label>
              <Input
                id="inventory"
                type="number"
                {...register('inventory', { valueAsNumber: true })}
                placeholder="0"
                disabled={loading}
              />
              {errors.inventory && <p className="text-sm text-red-600">{errors.inventory.message}</p>}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <Label>Product Images</Label>

            {/* Existing Images */}
            {images.length > 0 && (
              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{img.url}</p>
                      {img.alt && <p className="text-xs text-gray-500">{img.alt}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image */}
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Alt text (optional)"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                onClick={addImage}
                variant="outline"
                className="w-full"
                disabled={loading || !imageUrl}
              >
                Add Image
              </Button>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="Electronics"
              disabled={loading}
            />
            {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Product...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
