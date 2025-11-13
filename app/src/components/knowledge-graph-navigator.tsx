"use client"

import { useState, useEffect } from "react"
import { Tree, TreeViewElement, Folder, File } from "@/components/magicui/file-tree"
import { EntityViewer } from "@/components/entity-viewer"
import { useEntities, useEntity, ApiEntity } from "@/hooks/use-entity"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, User, Package, Building2, MapPin, Calendar, Sparkles } from "lucide-react"

// Tree Item Component
function TreeItem({ element }: { element: TreeViewElement }) {
  if (element.children && element.children.length > 0) {
    return (
      <Folder element={element.name} value={element.id}>
        {element.children.map((child) => (
          <TreeItem key={child.id} element={child} />
        ))}
      </Folder>
    )
  }
  
  return <File value={element.id}>{element.name}</File>
}

const ENTITY_TYPES = [
  { name: "Person", icon: "👤" },
  { name: "Product", icon: "📦" },
  { name: "Organization", icon: "🏢" },
  { name: "LocalBusiness", icon: "🏪" },
  { name: "Restaurant", icon: "🍽️" },
  { name: "Store", icon: "🛒" },
  { name: "Place", icon: "📍" },
  { name: "Event", icon: "📅" },
  { name: "CreativeWork", icon: "🎨" },
  { name: "Review", icon: "⭐" }
]

export function KnowledgeGraphNavigator() {
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [treeElements, setTreeElements] = useState<TreeViewElement[]>([])
  const [entitiesByType, setEntitiesByType] = useState<Record<string, ApiEntity[]>>({})
  const [loading, setLoading] = useState(true)

  // Fetch entities by type
  useEffect(() => {
    const fetchAllEntities = async () => {
      setLoading(true)
      const results: Record<string, ApiEntity[]> = {}

      for (const type of ENTITY_TYPES) {
        try {
          const response = await fetch(`/api/entities?type=${type.name}&limit=100`)
          const data = await response.json()
          results[type.name] = data.data || []
        } catch (error) {
          console.error(`Error fetching ${type.name}:`, error)
          results[type.name] = []
        }
      }

      setEntitiesByType(results)
      setLoading(false)
    }

    fetchAllEntities()
  }, [])

  // Build tree structure
  useEffect(() => {
    if (Object.keys(entitiesByType).length === 0) return

    const tree: TreeViewElement[] = ENTITY_TYPES.map(type => {
      const entities = entitiesByType[type.name] || []
      
      return {
        id: `type:${type.name}`,
        name: `${type.icon} ${type.name} (${entities.length})`,
        isSelectable: false,
        children: entities.slice(0, 20).map(entity => ({
          id: entity.id,
          name: (entity.properties.name as string) || 'Unnamed',
          isSelectable: true,
        }))
      }
    }).filter(type => type.children && type.children.length > 0)

    console.log('Tree elements:', tree.length, 'types with data')
    console.log('First type:', tree[0]?.name, 'with', tree[0]?.children?.length, 'children')
    setTreeElements(tree)
  }, [entitiesByType])

  // Get selected entity details
  const { data: entityData, loading: entityLoading } = useEntity(
    selectedId && !selectedId.startsWith('type:') ? selectedId : null
  )

  const handleSelect = (id: string) => {
    if (!id.startsWith('type:')) {
      setSelectedId(id)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Tree Navigator */}
      <div className="w-80 border-r overflow-y-auto bg-background">
        <div className="p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Knowledge Graph
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {Object.values(entitiesByType).flat().length} entidades
          </p>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : treeElements.length > 0 ? (
          <div className="p-4">
            <Tree
              elements={treeElements}
              initialSelectedId={selectedId}
              onSelectChange={handleSelect}
              className="w-full"
            >
              {treeElements.map((element) => (
                <TreeItem key={element.id} element={element} />
              ))}
            </Tree>
          </div>
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Nenhuma entidade encontrada
          </div>
        )}
      </div>

      {/* Right Content - Entity Viewer */}
      <div className="flex-1 overflow-y-auto">
        {!selectedId || selectedId.startsWith('type:') ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <Sparkles className="size-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">
                Selecione uma entidade
              </h3>
              <p className="text-muted-foreground mb-6">
                Navegue pela árvore à esquerda e clique em qualquer entidade para ver seus detalhes e relações.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-left mt-8">
                {ENTITY_TYPES.slice(0, 6).map(type => {
                  const count = entitiesByType[type.name]?.length || 0
                  return (
                    <div key={type.name} className="p-3 border rounded-lg">
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium">{type.name}</div>
                      <div className="text-xs text-muted-foreground">{count} entidades</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : entityLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : entityData ? (
          <div className="p-8">
            <EntityViewer
              entity={{
                ...entityData.entity,
                verifications: entityData.verifications
              }}
              relations={[
                ...entityData.relations.asAgent,
                ...entityData.relations.asObject
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
              }))}
            />
          </div>
        ) : (
          <div className="p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível carregar a entidade
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
}
