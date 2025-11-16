'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from './marketplace/ProductGrid'
import { Search, Loader2, Building2, Tag } from 'lucide-react'
import Link from 'next/link'

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
  category?: string | null
  storeName?: string
  storeLogoUrl?: string
}

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  rating: number
  reviewCount: number
  isVerified: boolean
}

function MarketplacePageContent({ defaultSection }: { defaultSection?: 'organizations' | 'departments' | 'products' }) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>(
    (searchParams.get('sort') as any) || 'newest'
  )

  // Fetch products and stores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          limit: '100',
          offset: '0',
          ...(search && { search }),
          ...(category && { category }),
          sortBy,
        })

        const response = await fetch(`/api/products?${params}`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        const productsList = data.data || []
        setProducts(productsList)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          productsList
            .map((p: Product) => p.category)
            .filter((c): c is string => !!c)
        )).sort() as string[]
        setCategories(uniqueCategories)

        // Fetch active stores
        const storesResponse = await fetch(`/api/stores/active`)
        if (storesResponse.ok) {
          const storesData = await storesResponse.json()
          setStores(storesData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, category, sortBy])

  // Determine header title based on section
  const getHeaderTitle = () => {
    switch (defaultSection) {
      case 'organizations':
        return 'Organizações'
      case 'departments':
        return 'Departamentos'
      case 'products':
        return 'Produtos'
      default:
        return 'Marketplace'
    }
  }

  const getHeaderDescription = () => {
    switch (defaultSection) {
      case 'organizations':
        return 'Explore todas as organizações disponíveis'
      case 'departments':
        return 'Explore todos os departamentos e categorias'
      case 'products':
        return 'Explore todos os produtos disponíveis'
      default:
        return 'Descubra produtos e serviços incríveis'
    }
  }

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{getHeaderTitle()}</h1>
        <p className="text-gray-600 mt-1">{getHeaderDescription()}</p>
      </div>

      {/* Filters */}
      {(defaultSection === 'products' || !defaultSection) && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais Novo</SelectItem>
                  <SelectItem value="price-asc">Preco: Menor para Maior</SelectItem>
                  <SelectItem value="price-desc">Preco: Maior para Menor</SelectItem>
                  <SelectItem value="rating">Mais Avaliado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Input
                placeholder="Ex: Eletronicos"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {(search || category) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button
                  onClick={() => {
                    setSearch('')
                    setCategory('')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Organizations Section */}
      {(defaultSection === 'organizations' || !defaultSection) && stores.length > 0 && (
        <div className="space-y-4">
          {!defaultSection && (
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Organizacoes
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stores.map((store) => (
              <Link key={store.id} href={`/organization/${store.id}`}>
                <div className="bg-background border border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {store.logoUrl ? (
                    <div className="w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-20 mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm mb-1 truncate">{store.name}</h3>
                  {store.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {store.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-primary font-medium">{store.rating.toFixed(1)} ⭐</span>
                    {store.isVerified && (
                      <Badge className="bg-green-600 text-xs">Verificado</Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {(defaultSection === 'departments' || !defaultSection) && categories.length > 0 && (
        <div className="space-y-4">
          {!defaultSection && (
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Tag className="w-6 h-6" />
              Departamentos
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat} href={`/department/${encodeURIComponent(cat)}`}>
                <button
                  onClick={() => setCategory(cat)}
                  className="w-full bg-background border border-border rounded-lg p-4 hover:bg-muted transition-colors text-left font-medium text-sm hover:border-primary"
                >
                  {cat}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      {(defaultSection === 'products' || !defaultSection) && (
        <div className="text-sm text-gray-600">
          {loading ? 'Carregando...' : `${products.length} produtos encontrados`}
        </div>
      )}

      {/* Products Grid */}
      {(defaultSection === 'products' || !defaultSection) && (
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          itemsPerPage={100}
        />
      )}
    </div>
  )
}

export default function MarketplacePage({ defaultSection }: { defaultSection?: 'organizations' | 'departments' | 'products' }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <MarketplacePageContent defaultSection={defaultSection} />
    </Suspense>
  )
}
