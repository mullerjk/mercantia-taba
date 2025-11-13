"use client"

import React, { useState, useEffect } from "react"
import { Tree, Folder, File, type TreeViewElement, CollapseButton } from "@/components/magicui/file-tree"
import { Search, ChevronDown, ChevronRight, Database, FolderTree } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/contexts/TranslationContext"

interface SchemaEntityNode {
  id: string
  name: string
  entityType: string
  description?: string
  propertiesCount?: number
  parentTypes?: string[]
  isAbstract?: boolean
  isExpanded?: boolean
  children?: SchemaEntityNode[]
}

interface SchemaExplorerTreeProps {
  onEntitySelect?: (entityName: string) => void
  className?: string
}

export function SchemaExplorerTree({ onEntitySelect, className }: SchemaExplorerTreeProps) {
  const [entities, setEntities] = useState<SchemaEntityNode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  // Initialize and load entities
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        await loadSchemaEntities()
      } catch (err) {
        console.error("Failed to load schema entities:", err)
        setError("Failed to load schema entities")
        setLoading(false)
      }
    }

    initializeAndLoad()
  }, [])

  const loadSchemaEntities = async () => {
    try {
      setLoading(true)

      // Load expanded state from localStorage
      const savedExpandedState = localStorage.getItem('schema-tree-expanded-state');
      const expandedState = savedExpandedState ? JSON.parse(savedExpandedState) : {};

      // Fetch schema hierarchy from API
      const response = await fetch('/api/schema-hierarchy');
      if (!response.ok) {
        throw new Error('Failed to fetch schema hierarchy');
      }

      const data = await response.json();

      // Convert API data to tree format and apply expanded state
      const convertToTreeFormat = (apiEntities: any[]): SchemaEntityNode[] => {
        return apiEntities.map(entity => ({
          id: entity.id,
          name: entity.name,
          entityType: entity.name,
          description: entity.description,
          propertiesCount: 0, // We'll get this from API if needed
          parentTypes: [],
          isAbstract: false,
          isExpanded: expandedState[entity.id] ?? false,
          children: entity.children ? convertToTreeFormat(entity.children) : []
        }));
      };

      const treeEntities = convertToTreeFormat(data);
      setEntities(treeEntities);

    } catch (err) {
      console.error("Failed to load schema entities:", err)
      setError("Failed to load schema entities")
    } finally {
      setLoading(false)
    }
  }

  // Save expanded state to localStorage whenever it changes
  const saveExpandedState = (entities: SchemaEntityNode[]) => {
    const expandedState: Record<string, boolean> = {};
    const collectExpandedState = (entityList: SchemaEntityNode[]) => {
      entityList.forEach(entity => {
        expandedState[entity.id] = entity.isExpanded ?? false;
        if (entity.children && entity.children.length > 0) {
          collectExpandedState(entity.children);
        }
      });
    };
    collectExpandedState(entities);
    localStorage.setItem('schema-tree-expanded-state', JSON.stringify(expandedState));
  };

  const toggleEntityExpansion = (entityId: string) => {
    const updateEntityExpansion = (entities: SchemaEntityNode[]): SchemaEntityNode[] => {
      return entities.map(entity => {
        if (entity.id === entityId) {
          return { ...entity, isExpanded: !entity.isExpanded };
        }
        if (entity.children && entity.children.length > 0) {
          return { ...entity, children: updateEntityExpansion(entity.children) };
        }
        return entity;
      });
    };

    const updatedEntities = updateEntityExpansion(entities);
    setEntities(updatedEntities);
    saveExpandedState(updatedEntities);
  };

  const handleEntitySelect = (entityId: string) => {
    console.log("SchemaExplorerTree: Entity selected:", entityId);
    setSelectedEntity(entityId)
    if (onEntitySelect) {
      console.log("SchemaExplorerTree: Calling onEntitySelect with:", entityId);
      onEntitySelect(entityId);
    } else {
      console.log("SchemaExplorerTree: onEntitySelect is not defined");
    }
  }

  // Recursive function to filter entities and their children
  const filterEntitiesRecursively = (entities: SchemaEntityNode[], query: string): SchemaEntityNode[] => {
    const result: SchemaEntityNode[] = [];

    for (const entity of entities) {
      // Check if current entity matches
      const entityMatches = entity.name.toLowerCase().includes(query.toLowerCase()) ||
                           entity.description?.toLowerCase().includes(query.toLowerCase());

      // Filter children recursively
      const filteredChildren = entity.children ? filterEntitiesRecursively(entity.children, query) : [];

      // Include entity if it matches or has matching children
      if (entityMatches || filteredChildren.length > 0) {
        result.push({
          ...entity,
          children: filteredChildren,
          isExpanded: query ? true : entity.isExpanded // Auto-expand when searching
        });
      }
    }

    return result;
  };

  const filteredEntities = searchQuery
    ? filterEntitiesRecursively(entities, searchQuery)
    : entities

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('sidebar.loadingSchema')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <div className="text-destructive mb-4">{t('sidebar.failedToLoad')}</div>
        <Button onClick={() => loadSchemaEntities()} variant="outline" size="sm">
          {t('sidebar.retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Search and Controls */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t('sidebar.searchEntities')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="size-4" />
          <span>{entities.length} {t('sidebar.entitiesLoaded')}</span>
          {searchQuery && (
            <span>• {filteredEntities.length} {t('sidebar.matching')}</span>
          )}
        </div>
      </div>

      {/* Entity Tree - Scrollable container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-2">
          {filteredEntities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {t('sidebar.noEntitiesFound')} "{searchQuery}"
            </div>
          ) : (
            <Tree
              elements={filteredEntities}
              className="space-y-1"
              initialExpandedItems={searchQuery ? [] : ['Thing', 'Action', 'Place', 'Person', 'Organization']}
            >
              {filteredEntities.map((entity) => (
                <EntityNode
                  key={entity.id}
                  entity={entity}
                  selected={selectedEntity === entity.id}
                  onSelect={handleEntitySelect}
                  onToggleExpansion={toggleEntityExpansion}
                  t={t}
                />
              ))}

              <CollapseButton
                elements={filteredEntities}
                className="mt-4"
              >
                <ChevronDown className="size-4" />
              </CollapseButton>
            </Tree>
          )}
        </div>
      </div>
    </div>
  )
}

interface EntityNodeProps {
  entity: SchemaEntityNode
  selected: boolean
  onSelect: (id: string) => void
}

function EntityNode({ entity, selected, onSelect, onToggleExpansion, t }: EntityNodeProps & { onToggleExpansion?: (id: string) => void, t: (key: string) => string }) {
  const hasChildren = entity.children && entity.children.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        {/* Parent node - Clickable for filtering */}
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer ${
            selected ? 'bg-accent text-accent-foreground' : ''
          }`}
          onClick={() => onSelect(entity.id)}
        >
          {/* Expansion toggle - separate clickable area */}
          <div
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 rounded"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent onClick
              onToggleExpansion?.(entity.id);
            }}
          >
            {entity.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FolderTree className="w-4 h-4 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{entity.name}</span>
              <Badge variant="outline" className="text-xs">
                {entity.children.length} {t('sidebar.subtypes')}
              </Badge>
            </div>
            {entity.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {entity.description}
              </p>
            )}
          </div>
        </div>

        {/* Children */}
        {entity.isExpanded && (
          <div className="ml-6 space-y-1">
            {entity.children.map((child) => (
              <EntityNode
                key={child.id}
                entity={child}
                selected={false} // Children selection is handled by parent
                onSelect={onSelect}
                onToggleExpansion={onToggleExpansion}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer ${
        selected ? 'bg-accent text-accent-foreground' : ''
      }`}
      onClick={() => onSelect(entity.id)}
    >
      <div className="w-4 h-4" /> {/* Spacer for alignment */}

      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Database className="w-4 h-4 text-green-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span>{entity.name}</span>
          <div className="flex items-center gap-1">
            {entity.isAbstract && (
              <Badge variant="secondary" className="text-xs">{t('sidebar.abstract')}</Badge>
            )}
            {entity.propertiesCount !== undefined && entity.propertiesCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {entity.propertiesCount}
              </Badge>
            )}
          </div>
        </div>
        {entity.description && (
          <div className="text-xs text-muted-foreground mt-1">
            {entity.description.slice(0, 80)}{entity.description.length > 80 ? "..." : ""}
          </div>
        )}
      </div>
    </div>
  )
}
