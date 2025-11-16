'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateStoreForm } from '@/components/pages/store/CreateStoreForm'
import { CreateProductForm } from '@/components/pages/store/CreateProductForm'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Plus, Settings } from 'lucide-react'

interface Store {
  id: string
  userId: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  email?: string
  phone?: string
  website?: string
  rating: number
  reviewCount: number
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  storeId: string
  name: string
  slug: string
  price: number
  inventory: number
  isActive: boolean
  rating: number
  reviewCount: number
}

export default function StorePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingProduct, setCreatingProduct] = useState(false)

  // Load store and products
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const loadStore = async () => {
      try {
        // Try to find user's store
        const response = await fetch(`/api/stores?limit=1`)

        if (response.ok) {
          const result = await response.json()
          const userStore = result.data?.find((s: Store) => s.userId === user.id)
          if (userStore) {
            setStore(userStore)

            // Load products for this store
            const productsResponse = await fetch(
              `/api/products?limit=100&offset=0`,
              {
                headers: { 'x-user-id': user.id },
              }
            )

            if (productsResponse.ok) {
              const productsData = await productsResponse.json()
              setProducts(
                productsData.data?.filter((p: Product) => p.storeId === userStore.id) || []
              )
            }
          }
        }
      } catch (error) {
        console.error('Error loading store:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStore()
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // No store yet - show creation form
  if (!store) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Your Store</h1>
          <p className="text-gray-600 mt-1">Start selling products and services on Mercantia</p>
        </div>

        <CreateStoreForm />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Store Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <p className="text-gray-600 mt-1">
            {store.description || 'No description added yet'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {store.isVerified && <Badge> Verified</Badge>}
            {!store.isActive && <Badge variant="destructive">Inactive</Badge>}
            <Badge variant="outline">{store.rating} P</Badge>
          </div>
        </div>

        <Link href={`/dashboard/store/settings`}>
          <Button variant="outline" size="lg">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <Button
              onClick={() => setCreatingProduct(!creatingProduct)}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Create Product Form */}
          {creatingProduct && (
            <div className="mb-6">
              <CreateProductForm
                storeId={store.id}
                onSuccess={() => {
                  setCreatingProduct(false)
                  // Reload products
                  window.location.reload()
                }}
              />
            </div>
          )}

          {/* Products List */}
          {products.length === 0 ? (
            <Card className="flex items-center justify-center min-h-96">
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">No products yet</p>
                <Button onClick={() => setCreatingProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-2xl font-bold">
                            ${(product.price / 100).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-600">
                            Stock: {product.inventory}
                          </span>
                          <span className="text-sm text-gray-600">
                            {product.rating} P ({product.reviewCount} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/dashboard/store/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders from Your Store</CardTitle>
              <CardDescription>Manage orders and update statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$0</p>
                <p className="text-xs text-gray-600 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-gray-600 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{store.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">From {store.reviewCount} reviews</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
