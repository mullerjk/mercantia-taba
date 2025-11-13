/**
 * Hook: useEntity
 * Busca entidade da API real com relations, verifications e proofs
 */

import { useState, useEffect } from 'react'

export interface ApiEntity {
  id: string
  type: string
  properties: Record<string, unknown>
  trustScore?: number
  createdAt: string
  createdBy: string | null
  updatedAt: string | null
}

export interface ApiRelation {
  id: string
  type: string
  agentId: string
  objectId: string
  startTime: string | null
  endTime: string | null
  locationId: string | null
  context: Record<string, unknown> | null
  trustScore: number | null
  createdAt: string
  agent?: ApiEntity
  object?: ApiEntity
  location?: ApiEntity | null
}

export interface ApiEntityDetail {
  entity: ApiEntity
  verifications: Array<{
    id: string
    entityId: string
    method: string
    verifiedBy: string
    timestamp: string
    expiresAt: string | null
    proof: Record<string, unknown> | null
  }>
  relations: {
    asAgent: ApiRelation[]
    asObject: ApiRelation[]
  }
}

export function useEntity(entityId: string | null) {
  const [data, setData] = useState<ApiEntityDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!entityId) {
      setData(null)
      return
    }

    const fetchEntity = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/entities/${entityId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch entity: ${response.statusText}`)
        }

        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchEntity()
  }, [entityId])

  return { data, loading, error }
}

export function useEntities(params: {
  type?: string
  limit?: number
  offset?: number
} = {}) {
  const [data, setData] = useState<{
    data: ApiEntity[]
    meta: { limit: number; offset: number; count: number }
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        if (params.type) searchParams.set('type', params.type)
        if (params.limit) searchParams.set('limit', String(params.limit))
        if (params.offset) searchParams.set('offset', String(params.offset))

        const response = await fetch(`/api/entities?${searchParams}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch entities: ${response.statusText}`)
        }

        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchEntities()
  }, [params.type, params.limit, params.offset])

  return { data, loading, error, refetch: () => {} }
}

export function useRelations(params: {
  type?: string
  agentId?: string
  objectId?: string
  entityId?: string
  limit?: number
  offset?: number
} = {}) {
  const [data, setData] = useState<{
    data: ApiRelation[]
    meta: { limit: number; offset: number; count: number }
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRelations = async () => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        if (params.type) searchParams.set('type', params.type)
        if (params.agentId) searchParams.set('agentId', params.agentId)
        if (params.objectId) searchParams.set('objectId', params.objectId)
        if (params.entityId) searchParams.set('entityId', params.entityId)
        if (params.limit) searchParams.set('limit', String(params.limit))
        if (params.offset) searchParams.set('offset', String(params.offset))

        const response = await fetch(`/api/relations?${searchParams}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch relations: ${response.statusText}`)
        }

        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchRelations()
  }, [params.type, params.agentId, params.objectId, params.entityId, params.limit, params.offset])

  return { data, loading, error }
}
