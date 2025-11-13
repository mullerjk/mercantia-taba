import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import BlurFade from "./blur-fade"
import { FlickeringGrid } from "./flickering-grid"
import { type SchemaEntity } from "../../lib/utils"

// MockEntity type for backward compatibility
interface MockEntity {
  id: string
  name: string
  type: string
  description: string
  fields: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  example?: unknown
}

interface AutoRendererProps {
  entity: SchemaEntity
  mockEntity?: MockEntity
}

interface FieldRendererProps {
  field: {
    name: string
    type: string
    required: boolean
    description: string
  }
  value: unknown
  fieldIndex: number
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, fieldIndex }) => {
  const getFieldIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'string':
      case 'text':
        return '📝'
      case 'number':
      case 'integer':
        return '🔢'
      case 'date':
        return '📅'
      case 'url':
        return '🔗'
      case 'boolean':
        return '✅'
      case 'array':
        return '📋'
      case 'object':
        return '📦'
      case 'image':
      case 'url':
        return '🖼️'
      default:
        return '📄'
    }
  }

  const renderFieldValue = (val: unknown, type: string) => {
    if (val === null || val === undefined) {
      return <span className="text-muted-foreground italic">Not provided</span>
    }

    if (type.toLowerCase() === 'date') {
      try {
        const date = new Date(val as string | number)
        return (
          <span className="font-mono text-sm">
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        )
      } catch {
        return <span className="font-mono text-sm">{String(val)}</span>
      }
    }

    if (type.toLowerCase() === 'url') {
      return (
        <a
          href={String(val)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {String(val)}
        </a>
      )
    }

    if (type.toLowerCase() === 'array') {
      if (Array.isArray(val)) {
        return (
          <div className="flex flex-wrap gap-1">
            {val.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {String(item)}
              </Badge>
            ))}
          </div>
        )
      }
    }

    if (type.toLowerCase() === 'object') {
      if (typeof val === 'object' && val !== null) {
        return (
          <div className="text-sm space-y-1">
            {Object.entries(val).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize">{key}:</span>
                <span className="text-muted-foreground">{String(value)}</span>
              </div>
            ))}
          </div>
        )
      }
    }

    if (type.toLowerCase().includes('email')) {
      return (
        <a
          href={`mailto:${String(val)}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {String(val)}
        </a>
      )
    }

    if (type.toLowerCase().includes('phone')) {
      return (
        <a
          href={`tel:${String(val)}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {String(val)}
        </a>
      )
    }

    // Default rendering
    return <span className="text-sm">{String(val)}</span>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{getFieldIcon(field.type)}</span>
        <span className="font-semibold capitalize">{field.name.replace(/([A-Z])/g, ' $1')}</span>
        {field.required && (
          <Badge variant="destructive" className="text-xs px-1 py-0">
            Required
          </Badge>
        )}
        <Badge variant="outline" className="text-xs px-1 py-0">
          {field.type}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
      <div className="ml-6">
        {renderFieldValue(value, field.type)}
      </div>
      {fieldIndex < 8 && <Separator className="mt-4" />}
    </div>
  )
}

export default function AutoRenderer({ entity, mockEntity }: AutoRendererProps) {
  const getComponentForEntity = (type: string) => {
    const entityType = type.toLowerCase()
    
    if (entityType.includes('article') || entityType.includes('techarticle')) {
      return 'Card'
    } else if (entityType.includes('organization')) {
      return 'Card'
    } else if (entityType.includes('event')) {
      return 'Card'
    } else if (entityType.includes('person')) {
      return 'Card'
    } else if (entityType.includes('product')) {
      return 'Card'
    }
    return 'Card'
  }

  const getDescriptionForEntity = (type: string) => {
    const entityType = type.toLowerCase()
    
    if (entityType.includes('article')) {
      return "A news or blog article about a topic"
    } else if (entityType.includes('organization')) {
      return "A company, institution, or other organization"
    } else if (entityType.includes('event')) {
      return "An event that takes place at a specific time and location"
    } else if (entityType.includes('person')) {
      return "A person, living or dead"
    } else if (entityType.includes('product')) {
      return "A product or service offered for sale"
    }
    return "A Schema.org entity"
  }

  const component = getComponentForEntity(entity.type)
  const description = getDescriptionForEntity(entity.type)

  // Find mock data for this entity type
  const mockData = mockEntity || undefined // No more static mock data - use MCP

  return (
    <BlurFade delay={0.1}>
      <div className="w-full max-w-4xl">
        {component === 'Card' && (
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto">
                <FlickeringGrid className="size-64" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {entity.name}
              </CardTitle>
              <CardDescription className="text-lg">
                {description}
              </CardDescription>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  {entity.type}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {entity.fields.length} fields
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Render fields with mock data */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Entity Details</h3>
                {mockData?.fields.map((field, index) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    value={mockData.example?.[field.name as keyof typeof mockData.example]}
                    fieldIndex={index}
                  />
                ))}
              </div>
              
              <Separator className="my-6" />
              
              {/* Schema Info */}
              <div className="space-y-4">
                <h4 className="font-semibold">Schema Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Entity Info</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{entity.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fields:</span>
                        <span className="font-medium">{entity.fields.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Required:</span>
                        <span className="font-medium">
                          {entity.fields.filter(f => f.required).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Field Types</h5>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(entity.fields.map(f => f.type))).map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BlurFade>
  )
}
