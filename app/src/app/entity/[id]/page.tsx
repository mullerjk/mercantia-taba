"use client"

import { useParams } from "next/navigation"
import { EntityViewer } from "@/components/entity-viewer"
import { useEntity } from "@/hooks/use-entity"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Person, Product, Organization, ConsumeAction, BuyAction, Relation } from "@/types/knowledge-graph"

// Mock data para demonstração (fallback se API falhar)
const mockEntities: Record<string, Person | Product | Organization> = {
  "person:maria": {
    id: "person:550e8400-e29b-41d4-a716-446655440000",
    type: "Person",
    properties: {
      name: "Maria Silva",
      email: "maria@example.com",
      telephone: "+55 11 98765-4321",
      birthDate: "1990-05-15",
      nationality: "Brazilian",
      address: "São Paulo, SP, Brasil",
      image: "https://i.pravatar.cc/150?img=5"
    },
    createdAt: "2024-01-15T10:00:00Z",
    verifications: [
      {
        method: "government_id",
        verifiedBy: "gov:br:cpf",
        timestamp: "2024-01-15T10:00:00Z",
        proof: {
          type: "document",
          hash: "sha256:abc123def456..."
        }
      },
      {
        method: "email",
        verifiedBy: "smtp:verification-service",
        timestamp: "2024-01-15T10:05:00Z"
      },
      {
        method: "phone",
        verifiedBy: "sms:twilio",
        timestamp: "2024-01-15T10:10:00Z",
        expiresAt: "2025-01-15T10:10:00Z"
      }
    ],
    trustScore: 98
  } as Person,

  "product:cafe": {
    id: "product:cafe-organico-500g",
    type: "Product",
    properties: {
      name: "Café Orgânico 500g",
      description: "Café 100% arábica, orgânico e de comércio justo",
      brand: "Fazenda Boa Vista",
      sku: "CAFE-ORG-500",
      category: "Food & Beverage",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300",
      price: {
        value: 35.90,
        currency: "BRL"
      }
    },
    createdAt: "2024-10-01T00:00:00Z",
    verifications: [
      {
        method: "organic_certification",
        verifiedBy: "ibd:brazil",
        timestamp: "2024-10-01T00:00:00Z",
        expiresAt: "2025-10-01T00:00:00Z",
        proof: {
          type: "document",
          url: "ipfs://Qm...certificate",
          hash: "sha256:cert123..."
        }
      },
      {
        method: "fair_trade",
        verifiedBy: "fairtrade:international",
        timestamp: "2024-10-01T00:00:00Z",
        expiresAt: "2025-10-01T00:00:00Z"
      }
    ],
    trustScore: 95
  } as Product,

  "org:fazenda": {
    id: "org:fazenda-boa-vista",
    type: "Organization",
    properties: {
      name: "Fazenda Boa Vista",
      legalName: "Fazenda Boa Vista Agropecuária Ltda",
      description: "Produtora de café orgânico certificado desde 1995",
      email: "contato@fazendaboavista.com.br",
      telephone: "+55 35 3221-9876",
      address: "Sul de Minas Gerais, Brasil",
      logo: "https://via.placeholder.com/150?text=FBV",
      foundingDate: "1995-03-20"
    },
    createdAt: "2024-01-01T00:00:00Z",
    verifications: [
      {
        method: "business_registration",
        verifiedBy: "gov:br:cnpj",
        timestamp: "2024-01-01T00:00:00Z",
        proof: {
          type: "document",
          hash: "sha256:cnpj123..."
        }
      }
    ],
    trustScore: 92
  } as Organization
}

const mockRelations: Record<string, (ConsumeAction | BuyAction)[]> = {
  "person:maria": [
    {
      id: "action:consume:123e4567-e89b-12d3-a456-426614174000",
      type: "ConsumeAction",
      agent: "person:550e8400-e29b-41d4-a716-446655440000",
      object: "product:cafe-organico-500g",
      startTime: "2024-11-20T08:00:00Z",
      location: "place:residencia-maria",
      proofs: [
        {
          type: "photo",
          url: "ipfs://Qm...photo1",
          timestamp: "2024-11-20T08:05:00Z",
          hash: "sha256:photo123..."
        },
        {
          type: "receipt",
          url: "ipfs://Qm...receipt",
          hash: "sha256:receipt456...",
          verifiedBy: "oracle:receipt-validator"
        }
      ],
      witnesses: ["person:joao", "person:ana"],
      createdAt: "2024-11-20T08:10:00Z",
      trustScore: 96
    } as ConsumeAction,
    {
      id: "action:buy:987e6543-a21b-43c1-b654-123456789abc",
      type: "BuyAction",
      agent: "person:550e8400-e29b-41d4-a716-446655440000",
      object: "product:cafe-organico-500g",
      startTime: "2024-11-19T15:30:00Z",
      proofs: [
        {
          type: "receipt",
          url: "ipfs://Qm...receipt2",
          hash: "sha256:buy123...",
          verifiedBy: "payment:mercadopago"
        },
        {
          type: "blockchain",
          hash: "0xabc123def456...",
          verifiedBy: "blockchain:ethereum"
        }
      ],
      createdAt: "2024-11-19T15:35:00Z",
      trustScore: 99
    } as BuyAction
  ]
}

export default function EntityPage() {
  const params = useParams()
  const entityId = params.id as string

  // Fetch from real API
  const { data, loading, error } = useEntity(entityId)

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    // Try fallback to mock data
    const decodedId = decodeURIComponent(entityId)
    const mockEntity = mockEntities[decodedId as keyof typeof mockEntities]
    const entityRelations = mockRelations[decodedId as keyof typeof mockRelations] || []

    if (mockEntity) {
      return (
        <div className="container mx-auto py-8 px-4">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Usando dados mockados</AlertTitle>
            <AlertDescription>
              Não foi possível conectar à API. Exibindo dados de demonstração.
            </AlertDescription>
          </Alert>
          <EntityViewer entity={mockEntity} relations={entityRelations} />
        </div>
      )
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar entidade</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Entidade não encontrada</h1>
          <p className="text-muted-foreground">ID: {entityId}</p>
        </div>
      </div>
    )
  }

  // Convert API data to EntityViewer format
  const allRelations = [
    ...data.relations.asAgent,
    ...data.relations.asObject
  ].map(rel => ({
    id: rel.id,
    type: rel.type,
    agent: rel.agentId,
    object: rel.objectId,
    startTime: rel.startTime || undefined,
    endTime: rel.endTime || undefined,
    location: rel.locationId || undefined,
    proofs: [],
    witnesses: [],
    createdAt: rel.createdAt,
    trustScore: rel.trustScore || undefined
  }))

  // Convert verifications to correct format
  const convertedVerifications = data.verifications.map(v => ({
    ...v,
    proof: v.proof ? {
      type: (v.proof as any).type || 'document',
      url: (v.proof as any).url,
      hash: (v.proof as any).hash
    } : undefined
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <EntityViewer
        entity={{
          ...data.entity,
          verifications: convertedVerifications
        }}
        relations={allRelations}
      />
    </div>
  )
}
