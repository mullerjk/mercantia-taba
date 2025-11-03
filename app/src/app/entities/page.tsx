"use client"

import { useState } from "react"
import { useEntities } from "@/hooks/use-entity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Package, Building2, MapPin, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

const ENTITY_TYPES = [
  "All",
  "Person",
  "Product",
  "Organization",
  "LocalBusiness",
  "Restaurant",
  "Store",
  "Place",
  "Event",
  "CreativeWork",
  "Review"
]

export default function EntitiesPage() {
  const [selectedType, setSelectedType] = useState<string>("All")
  const [limit, setLimit] = useState(20)

  const { data, loading, error } = useEntities({
    type: selectedType === "All" ? undefined : selectedType,
    limit,
    offset: 0
  })

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "Person": return <User className="size-5" />
      case "Product": return <Package className="size-5" />
      case "Organization": return <Building2 className="size-5" />
      case "Place": return <MapPin className="size-5" />
      default: return <Calendar className="size-5" />
    }
  }

  const getTrustScoreColor = (score?: number) => {
    if (!score) return "text-gray-500"
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explorar Entidades</h1>
        <p className="text-muted-foreground">
          Navegue pelo Knowledge Graph com {data?.meta.count || 0} entidades
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Tipo</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {ENTITY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32">
            <label className="text-sm font-medium mb-2 block">Limite</label>
            <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Entities Grid */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((entity) => (
              <Link
                key={entity.id}
                href={`/entity/${entity.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:border-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(entity.type)}
                        <Badge variant="secondary">{entity.type}</Badge>
                      </div>
                      {entity.trustScore && (
                        <span className={`text-sm font-bold ${getTrustScoreColor(entity.trustScore)}`}>
                          {entity.trustScore}%
                        </span>
                      )}
                    </div>
                    
                    <CardTitle className="line-clamp-1">
                      {(entity.properties.name as string) || 'Unnamed'}
                    </CardTitle>
                    
                    {entity.properties.description && (
                      <CardDescription className="line-clamp-2">
                        {entity.properties.description as string}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {entity.properties.email && (
                        <div className="truncate">
                          📧 {entity.properties.email as string}
                        </div>
                      )}
                      {entity.properties.telephone && (
                        <div>
                          📞 {entity.properties.telephone as string}
                        </div>
                      )}
                      {entity.properties.price && (
                        <div>
                          💰 R$ {entity.properties.price as number}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs pt-2">
                        <Calendar className="size-3" />
                        {new Date(entity.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="w-full mt-4">
                      Ver detalhes <ExternalLink className="ml-2 size-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Mostrando {data.data.length} de {data.meta.count} entidades
          </div>
        </>
      )}
    </div>
  )
}
