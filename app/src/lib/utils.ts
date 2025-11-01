import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Schema.org data type definitions and UI rule engine
export interface SchemaField {
  name: string
  type: string // Permitir qualquer string para maior flexibilidade
  required?: boolean
  description?: string
}

export interface SchemaEntity {
  name: string
  type: string // Permitir qualquer string para maior flexibilidade
  fields: SchemaField[]
  examples?: any[]
}

// MagicUI component mapping based on data characteristics
export interface UIRecommendation {
  component: 'bento-grid' | 'animated-list' | 'blur-fade' | 'marquee' | 'flickering-grid' | 'typing-animation' | 'animated-circular-progress' | 'tree'
  reason: string
  confidence: number
}

export class LayoutGenerator {
  private static readonly COMPONENT_RULES = [
    {
      condition: (entity: SchemaEntity) => entity.fields.some(f => f.type === 'array' && f.name.includes('List')),
      component: 'animated-list' as const,
      reason: 'Lists and collections work great with animated lists',
      confidence: 95
    },
    {
      condition: (entity: SchemaEntity) => entity.fields.length > 10,
      component: 'bento-grid' as const,
      reason: 'Many fields benefit from bento grid layout',
      confidence: 90
    },
    {
      condition: (entity: SchemaEntity) => entity.fields.some(f => f.name.includes('address') || f.name.includes('location')),
      component: 'flickering-grid' as const,
      reason: 'Location-based data looks dynamic in flickering grids',
      confidence: 85
    },
    {
      condition: (entity: SchemaEntity) => entity.fields.some(f => f.name.includes('description') || f.name.includes('content')),
      component: 'typing-animation' as const,
      reason: 'Text content benefits from typing animations',
      confidence: 80
    },
    {
      condition: (entity: SchemaEntity) => entity.fields.some(f => f.type === 'number' && f.name.includes('progress')),
      component: 'animated-circular-progress' as const,
      reason: 'Numeric progress data works well in circular progress bars',
      confidence: 88
    },
    {
      condition: (entity: SchemaEntity) => entity.type === 'CreativeWork',
      component: 'blur-fade' as const,
      reason: 'Creative works benefit from smooth blur fade entrances',
      confidence: 75
    },
    {
      condition: (entity: SchemaEntity) => entity.fields.some(f => f.type === 'array' && f.name.includes('tag')),
      component: 'marquee' as const,
      reason: 'Tags look great in marquee scrollers',
      confidence: 82
    },
    {
      condition: () => true, // Fallback
      component: 'blur-fade' as const,
      reason: 'Default animated component for most entities',
      confidence: 60
    }
  ]

  static recommendUI(entity: SchemaEntity): UIRecommendation[] {
    const recommendations = this.COMPONENT_RULES
      .filter(rule => rule.condition(entity))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)

    return recommendations
  }

  static generateLayout(entity: SchemaEntity, data?: any) {
    const recommendations = this.recommendUI(entity)
    const bestRecommendation = recommendations[0] || {
      component: 'blur-fade' as const,
      reason: 'Default component',
      confidence: 50
    }

    return {
      entity,
      recommendedComponents: recommendations,
      primaryComponent: bestRecommendation,
      layoutConfig: this.getLayoutConfig(bestRecommendation, entity, data),
      data
    }
  }

  private static getLayoutConfig(
    recommendation: UIRecommendation,
    entity: SchemaEntity,
    data?: any
  ): any {
    switch (recommendation.component) {
      case 'animated-list':
        return {
          component: 'animated-list',
          props: {
            delay: 1000,
            className: 'space-y-4'
          },
          dataConfig: {
            items: data?.[entity.fields.find(f => f.type === 'array')?.name || 'items'] || []
          }
        }

      case 'bento-grid':
        const bentoItems = entity.fields.map((field, index) => ({
          name: field.name,
          className: this.getBentoClass(index),
          description: field.description || `${field.type} field`,
          href: `/entity/${entity.name}/field/${field.name}`,
          cta: "Explore"
        }))
        return {
          component: 'bento-grid',
          props: {},
          dataConfig: { items: bentoItems }
        }

      case 'blur-fade':
        return {
          component: 'blur-fade',
          props: {
            delay: 0.2,
            className: 'max-w-2xl mx-auto'
          },
          dataConfig: {
            title: entity.name,
            subtitle: `${entity.type} entity with ${entity.fields.length} fields`
          }
        }

      case 'typing-animation':
        const textField = entity.fields.find(f => f.name.includes('description') || f.name.includes('content'))
        return {
          component: 'typing-animation',
          props: {
            duration: 30,
            className: "text-lg max-w-md mx-auto text-center"
          },
          dataConfig: {
            text: data?.[textField?.name || ''] || `Sample content for ${entity.name}`
          }
        }

      case 'animated-circular-progress':
        const numberField = entity.fields.find(f => f.type === 'number')
        return {
          component: 'animated-circular-progress',
          props: {
            max: 100,
            gaugePrimaryColor: "#3b82f6",
            gaugeSecondaryColor: "#e5e7eb"
          },
          dataConfig: {
            value: data?.[numberField?.name || ''] || 75
          }
        }

      case 'marquee':
        const arrayField = entity.fields.find(f => f.type === 'array')
        const tags = data?.[arrayField?.name || ''] || ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5']
        return {
          component: 'marquee',
          props: {
            className: "py-12",
            pauseOnHover: true
          },
          dataConfig: { tags }
        }

      case 'flickering-grid':
        return {
          component: 'flickering-grid',
          props: {
            className: "min-h-[400px] w-full",
            squareSize: 100,
            flickerChance: 0.3,
            color: "#3b82f6"
          }
        }

      default:
        return {
          component: 'blur-fade',
          props: { delay: 0.3 },
          dataConfig: {}
        }
    }
  }

  private static getBentoClass(index: number): string {
    const classes = [
      "md:row-span-2",
      "md:col-span-2",
      "md:row-span-1 md:col-span-1",
      "md:row-span-1 md:col-span-1",
      "md:row-span-1 md:col-span-1",
      "md:row-span-1 md:col-span-1",
    ]
    return classes[index % classes.length] || "md:row-span-1 md:col-span-1"
  }
}
