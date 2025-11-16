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
import { createStoreSchema, type CreateStoreInput } from '@/lib/validations'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function CreateStoreForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
  })

  const onSubmit = async (data: CreateStoreInput) => {
    if (!user) {
      setError('You must be logged in to create a store')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Failed to create store')
        return
      }

      const store = await response.json()
      router.push(`/dashboard/store`)
    } catch (err) {
      setError('An error occurred while creating your store')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Store</CardTitle>
        <CardDescription>Set up your business and start selling</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="My Awesome Store"
              disabled={loading}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Store URL Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">mercantia.com/store/</span>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="my-awesome-store"
                className="flex-1"
                disabled={loading}
              />
            </div>
            {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Tell customers about your store..."
              rows={4}
              disabled={loading}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Store Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="contact@store.com"
                disabled={loading}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                disabled={loading}
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              {...register('website')}
              placeholder="https://mystore.com"
              disabled={loading}
            />
            {errors.website && <p className="text-sm text-red-600">{errors.website.message}</p>}
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              {...register('logoUrl')}
              placeholder="https://example.com/logo.png"
              disabled={loading}
            />
            {errors.logoUrl && <p className="text-sm text-red-600">{errors.logoUrl.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Store...
              </>
            ) : (
              'Create Store'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
