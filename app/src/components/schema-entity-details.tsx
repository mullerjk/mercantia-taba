"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BorderBeam } from "@/components/ui/border-beam"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { 
  ExternalLink, 
  Network, 
  FileCode, 
  Layers, 
  List,
  Loader2,
  AlertCircle
} from "lucide-react"
import { SchemaOrgClient } from "@/lib/schema-org-client.js"

interface SchemaEntityDetailsProps {
  entityId: string
  entityName: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any

interface TypeDetails {
  name: string
  description: string
  id: string
  type: string
  url: string
  superTypes: Array<{ name: string; id: string }>
}

interface Property {
  name: string
  description: string
  id: string
  rangeIncludes?: Array<{ name: string; id: string }>
  domainIncludes?: Array<{ name: string; id: string }>
}

interface HierarchyData {
  parents: Array<{ name: string; id: string }>
  children: Array<{ name: string; id: string }>
}

export function SchemaEntityDetails({ entityId, entityName }: SchemaEntityDetailsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [typeDetails, setTypeDetails] = useState<TypeDetails | null>(null)
  const [hierarchy, setHierarchy] = useState<HierarchyData | null>(null)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    loadDetails()
  }, [entityId, entityName])

  const loadDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const client = new SchemaOrgClient()
      await client.initialize()
      
      const typeName = entityName || entityId.replace('schema:', '')
      
      const [type, hierarchyData, props] = await Promise.all([
        client.getSchemaType(typeName),
        client.getTypeHierarchy(typeName),
        client.getTypeProperties(typeName, false),
      ])

      setTypeDetails(type as TypeDetails)
      setHierarchy(hierarchyData)
      setProperties(props as Property[])
    } catch (err) {
      console.error('Failed to load entity details:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="h-full relative">
        <BorderBeam size={250} duration={12} delay={9} />
        <CardContent className="flex items-center justify-center h-full min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading {entityName}...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!typeDetails) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header Card with Border Beam */}
      <Card className="relative overflow-hidden">
        <BorderBeam size={250} duration={12} delay={9} />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">{typeDetails.name}</CardTitle>
              <CardDescription className="text-base">
                {typeDetails.description}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {typeDetails.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 pt-4">
            <ShimmerButton
              onClick={() => window.open(typeDetails.url, '_blank')}
              className="shadow-2xl"
              shimmerSize="0.1em"
            >
              <ExternalLink className="size-4 mr-2" />
              View on Schema.org
            </ShimmerButton>
            
            {typeDetails.superTypes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Extends:</span>
                {typeDetails.superTypes.map(parent => (
                  <Badge key={parent.id} variant="outline">
                    {parent.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties" className="gap-2">
            <List className="size-4" />
            Properties ({properties.length})
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2">
            <Network className="size-4" />
            Hierarchy
          </TabsTrigger>
          <TabsTrigger value="jsonld" className="gap-2">
            <FileCode className="size-4" />
            JSON-LD
          </TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Properties</CardTitle>
              <CardDescription>
                All properties available for this type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {properties.map((prop, index) => (
                    <div key={prop.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-mono text-sm font-medium text-primary">
                            {prop.name}
                          </h4>
                          {prop.rangeIncludes && prop.rangeIncludes.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {prop.rangeIncludes[0].name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prop.description}
                        </p>
                        {prop.rangeIncludes && prop.rangeIncludes.length > 1 && (
                          <div className="flex flex-wrap gap-1">
                            {prop.rangeIncludes.slice(1).map(range => (
                              <Badge key={range.id} variant="outline" className="text-xs">
                                {range.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hierarchy Tab */}
        <TabsContent value="hierarchy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Parents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="size-4" />
                  Parent Types
                </CardTitle>
                <CardDescription>
                  Types this inherits from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hierarchy?.parents && hierarchy.parents.length > 0 ? (
                  <div className="space-y-2">
                    {hierarchy.parents.map(parent => (
                      <div
                        key={parent.id}
                        className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                      >
                        <Badge variant="secondary">{parent.name}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No parent types</p>
                )}
              </CardContent>
            </Card>

            {/* Children */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Network className="size-4" />
                  Child Types
                </CardTitle>
                <CardDescription>
                  Types that inherit from this
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hierarchy?.children && hierarchy.children.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {hierarchy.children.map(child => (
                        <div
                          key={child.id}
                          className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                        >
                          <Badge variant="outline">{child.name}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No child types</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* JSON-LD Tab */}
        <TabsContent value="jsonld" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">JSON-LD Structure</CardTitle>
              <CardDescription>
                Complete type definition in JSON-LD format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{JSON.stringify(typeDetails, null, 2)}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
