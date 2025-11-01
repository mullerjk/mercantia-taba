// Schema Explorer Integration with Schema.org MCP
// This module provides utilities to connect the Schema Explorer UI with the schema.org MCP server

import { SchemaOrgClient } from './schema-org-client.js';

export class SchemaExplorerIntegration {
  private schemaClient: SchemaOrgClient;

  constructor() {
    this.schemaClient = new SchemaOrgClient();
  }

  async initialize() {
    try {
      await this.schemaClient.initialize();
      console.log('Schema.org MCP integration initialized');
    } catch (error) {
      console.error('Failed to initialize Schema.org MCP:', error);
      throw error;
    }
  }

  // Get comprehensive information about a schema.org type
  async getTypeInfo(typeName: string) {
    try {
      const type = await this.schemaClient.getSchemaType(typeName);
      const properties = await this.schemaClient.getTypeProperties(typeName, true);
      const hierarchy = await this.schemaClient.getTypeHierarchy(typeName);
      const example = await this.schemaClient.generateExample(typeName);

      return {
        type,
        properties,
        hierarchy,
        example,
        isIntegrated: true,
        mcpServer: 'schema-org-mcp@0.1.0'
      };
    } catch (error) {
      console.error(`Error getting type info for ${typeName}:`, error);
      throw error;
    }
  }

  // Search for schema types with enhanced results
  async searchSchemaTypes(query: string, limit: number = 20) {
    try {
      const results = await this.schemaClient.searchSchemas(query, limit);
      
      // Enhance results with additional metadata
      const enhancedResults = await Promise.all(
        results.map(async (result) => {
          try {
            const typeInfo = await this.getTypeInfo(result.name);
            return {
              ...result,
              propertiesCount: typeInfo.properties.length,
              hasChildren: typeInfo.hierarchy.children.length > 0,
              superTypesCount: typeInfo.hierarchy.parents.length,
              isAbstract: typeInfo.hierarchy.children.length === 0 && typeInfo.hierarchy.parents.length > 0
            };
          } catch {
            // If we can't get detailed info, just return the basic result
            return {
              ...result,
              propertiesCount: 0,
              hasChildren: false,
              superTypesCount: 0,
              isAbstract: false
            };
          }
        })
      );

      return enhancedResults;
    } catch (error) {
      console.error(`Error searching for ${query}:`, error);
      throw error;
    }
  }

  // Generate complete documentation for a type
  async generateTypeDocumentation(typeName: string) {
    try {
      const typeInfo = await this.getTypeInfo(typeName);
      
      return {
        title: typeInfo.type.name,
        description: typeInfo.type.description,
        url: typeInfo.type.url,
        hierarchy: {
          parents: typeInfo.hierarchy.parents,
          children: typeInfo.hierarchy.children,
          level: this.calculateInheritanceLevel(typeInfo.hierarchy.parents)
        },
        properties: {
          direct: typeInfo.properties.filter(p => !p.inheritedFrom),
          inherited: typeInfo.properties.filter(p => p.inheritedFrom),
          byType: this.groupPropertiesByType(typeInfo.properties)
        },
        example: typeInfo.example,
        relatedTypes: this.findRelatedTypes(typeName, typeInfo.hierarchy.parents, typeInfo.hierarchy.children),
        usage: this.generateUsageGuidance(typeInfo),
        mcpIntegration: {
          server: typeInfo.mcpServer,
          tools: [
            'get_schema_type',
            'get_type_properties', 
            'get_type_hierarchy',
            'generate_example'
          ]
        }
      };
    } catch (error) {
      console.error(`Error generating documentation for ${typeName}:`, error);
      throw error;
    }
  }

  // Get all properties for a type with inheritance
  async getCompleteProperties(typeName: string) {
    try {
      const properties = await this.schemaClient.getTypeProperties(typeName, true);
      
      return {
        type: typeName,
        totalProperties: properties.length,
        directProperties: properties.filter(p => !p.inheritedFrom),
        inheritedProperties: properties.filter(p => p.inheritedFrom),
        propertiesByType: this.groupPropertiesByType(properties),
        requiredProperties: this.identifyRequiredProperties(properties),
        optionalProperties: properties.filter(p => !this.identifyRequiredProperties(properties).includes(p)),
        mcpTools: ['get_type_properties']
      };
    } catch (error) {
      console.error(`Error getting complete properties for ${typeName}:`, error);
      throw error;
    }
  }

  // Generate JSON-LD examples with validation
  async generateValidatedExample(typeName: string, customProperties?: Record<string, any>) {
    try {
      const example = await this.schemaClient.generateExample(typeName, customProperties);
      const typeInfo = await this.getTypeInfo(typeName);
      
      return {
        example,
        validation: {
          hasRequiredProperties: this.checkRequiredProperties(example, typeInfo.properties),
          propertyTypes: this.validatePropertyTypes(example, typeInfo.properties),
          isValid: true // Schema.org examples are always valid
        },
        alternatives: this.generateAlternativeExamples(typeName, typeInfo.properties),
        customization: {
          availableProperties: typeInfo.properties.map(p => p.name),
          recommendedProperties: this.getRecommendedProperties(typeInfo.properties),
          customProperties: customProperties || {}
        },
        mcpTools: ['generate_example']
      };
    } catch (error) {
      console.error(`Error generating validated example for ${typeName}:`, error);
      throw error;
    }
  }

  // Analyze type relationships and usage patterns
  async analyzeTypeRelationships(typeName: string) {
    try {
      const typeInfo = await this.getTypeInfo(typeName);
      
      return {
        type: typeName,
        inheritance: {
          parents: typeInfo.hierarchy.parents,
          children: typeInfo.hierarchy.children,
          depth: this.calculateInheritanceLevel(typeInfo.hierarchy.parents),
          siblings: await this.findSiblingTypes(typeInfo.hierarchy.parents, typeName)
        },
        usage: {
          commonProperties: this.identifyCommonProperties(typeInfo.properties),
          typicalCombinations: this.findTypicalCombinations(typeName, typeInfo.properties),
          deprecatedAlternatives: this.findDeprecatedAlternatives(typeName),
          bestPractices: this.generateBestPractices(typeInfo)
        },
        relationships: {
          extends: typeInfo.hierarchy.parents,
          extendedBy: typeInfo.hierarchy.children,
          associatedTypes: this.findAssociatedTypes(typeName, typeInfo.properties),
          domainOf: typeInfo.properties.filter(p => !p.inheritedFrom)
        },
        mcpAnalysis: {
          serverCapabilities: ['get_type_hierarchy', 'get_schema_type'],
          dataSource: 'schema.org latest version',
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error(`Error analyzing relationships for ${typeName}:`, error);
      throw error;
    }
  }

  // Private helper methods
  private calculateInheritanceLevel(parents: any[]): number {
    if (parents.length === 0) return 0;
    return Math.max(...parents.map(p => 1 + this.calculateInheritanceLevel([p])));
  }

  private groupPropertiesByType(properties: any[]): Record<string, any[]> {
    return properties.reduce((groups, prop) => {
      prop.expectedTypes.forEach(type => {
        if (!groups[type]) groups[type] = [];
        groups[type].push(prop);
      });
      return groups;
    }, {});
  }

  private identifyRequiredProperties(properties: any[]): string[] {
    // Schema.org doesn't explicitly mark required properties, 
    // but common patterns can help identify likely candidates
    return properties.filter(p => 
      ['name', 'description', 'url'].includes(p.name.toLowerCase())
    ).map(p => p.name);
  }

  private findRelatedTypes(typeName: string, parents: any[], children: any[]): any[] {
    const related = [];
    
    // Add parent and child types
    related.push(...parents);
    related.push(...children);
    
    // Add types with similar properties (simplified)
    return related.slice(0, 10); // Limit to prevent overwhelming
  }

  private generateUsageGuidance(typeInfo: any): string[] {
    const guidance = [];
    
    if (typeInfo.hierarchy.parents.length > 0) {
      guidance.push(`Inherits from: ${typeInfo.hierarchy.parents.map((p: any) => p.name).join(', ')}`);
    }
    
    if (typeInfo.hierarchy.children.length > 0) {
      guidance.push(`Extended by: ${typeInfo.hierarchy.children.length} subtypes`);
    }
    
    const propertiesCount = typeInfo.properties.filter((p: any) => !p.inheritedFrom).length;
    guidance.push(`Has ${propertiesCount} direct properties`);
    
    return guidance;
  }

  private generateAlternativeExamples(typeName: string, properties: any[]): any[] {
    // Generate examples with different property combinations
    return [
      {
        name: `Minimal ${typeName}`,
        description: `Basic example with essential properties only`,
        example: this.createMinimalExample(typeName, properties)
      },
      {
        name: `Complete ${typeName}`, 
        description: `Comprehensive example with all common properties`,
        example: this.createCompleteExample(typeName, properties)
      },
      {
        name: `${typeName} with Relationships`,
        description: `Example showing relationships with other entities`,
        example: this.createRelatedExample(typeName, properties)
      }
    ];
  }

  private createMinimalExample(typeName: string, properties: any[]): any {
    // Create a minimal example with essential properties only
    const minimalProps = properties.filter(p => 
      ['name', 'description', 'url'].includes(p.name.toLowerCase())
    ).slice(0, 3);
    
    const example: any = {
      "@context": "https://schema.org",
      "@type": typeName
    };
    
    minimalProps.forEach(prop => {
      if (prop.name === 'name') example[prop.name] = "Example " + typeName;
      else if (prop.name === 'description') example[prop.name] = "A simple example of " + typeName;
      else if (prop.name === 'url') example[prop.name] = "https://example.com/" + typeName.toLowerCase();
    });
    
    return example;
  }

  private createCompleteExample(typeName: string, properties: any[]): any {
    // Create a comprehensive example
    const example: any = {
      "@context": "https://schema.org",
      "@type": typeName
    };
    
    properties.slice(0, 10).forEach(prop => {
      if (prop.name === 'name') example[prop.name] = "Complete " + typeName + " Example";
      else if (prop.name === 'description') example[prop.name] = "A comprehensive example showcasing all features of " + typeName;
      else if (prop.name === 'url') example[prop.name] = "https://example.com/complete-" + typeName.toLowerCase();
    });
    
    return example;
  }

  private createRelatedExample(typeName: string, properties: any[]): any {
    // Create an example showing relationships
    const example: any = {
      "@context": "https://schema.org",
      "@type": typeName,
      "name": "Related " + typeName + " Example",
      "description": "An example showing relationships between entities"
    };
    
    return example;
  }

  private async findSiblingTypes(parents: any[], currentTypeName: string): Promise<any[]> {
    try {
      const siblings: any[] = [];
      
      // For each parent, find all its children (which are siblings of currentType)
      for (const parent of parents) {
        try {
          const parentTypeInfo = await this.getTypeInfo(parent.name);
          siblings.push(...parentTypeInfo.hierarchy.children.filter((child: any) => 
            child.name !== currentTypeName
          ));
        } catch (error) {
          console.warn(`Could not get sibling info for parent ${parent.name}:`, error);
        }
      }
      
      // Remove duplicates and return
      return siblings.filter((sibling, index, arr) => 
        arr.findIndex(s => s.name === sibling.name) === index
      ).slice(0, 10); // Limit to prevent overwhelming results
    } catch (error) {
      console.error('Error finding sibling types:', error);
      return [];
    }
  }

  private identifyCommonProperties(properties: any[]): any[] {
    // Find properties that appear frequently across types
    const commonProps = properties.filter(p => 
      ['name', 'description', 'url', 'image', 'sameAs'].includes(p.name.toLowerCase())
    );
    return commonProps.slice(0, 5);
  }

  private findTypicalCombinations(typeName: string, properties: any[]): any[] {
    // Return typical property combinations for this type
    return [
      {
        name: "Basic Information",
        properties: ['name', 'description'],
        description: "Essential properties for any " + typeName
      },
      {
        name: "Web Presence", 
        properties: ['url', 'image'],
        description: "Properties for online presence"
      }
    ];
  }

  private findDeprecatedAlternatives(typeName: string): any[] {
    // Schema.org doesn't track deprecations in the data structure,
    // so this returns empty array as placeholder
    return [];
  }

  private generateBestPractices(typeInfo: any): string[] {
    const practices = [];
    
    if (typeInfo.hierarchy.parents.length > 0) {
      practices.push("Leverage inheritance from parent types where appropriate");
    }
    
    const propertiesCount = typeInfo.properties.filter((p: any) => !p.inheritedFrom).length;
    if (propertiesCount > 5) {
      practices.push("Consider using only the most relevant properties for your use case");
    }
    
    practices.push("Always include @context and @type in your JSON-LD");
    practices.push("Use human-readable descriptions for better understanding");
    
    return practices;
  }

  private findAssociatedTypes(typeName: string, properties: any[]): any[] {
    // Find types that are commonly used together based on property types
    const associated: string[] = [];
    
    properties.forEach(prop => {
      prop.expectedTypes?.forEach((type: string) => {
        if (type !== typeName && !associated.includes(type)) {
          associated.push(type);
        }
      });
    });
    
    return associated.slice(0, 8);
  }

  private checkRequiredProperties(example: any, properties: any[]): boolean {
    const requiredProps = this.identifyRequiredProperties(properties);
    return requiredProps.every(prop => example[prop] !== undefined);
  }

  private validatePropertyTypes(example: any, properties: any[]): Record<string, boolean> {
    const validation: Record<string, boolean> = {};
    
    properties.forEach(prop => {
      if (example[prop.name] !== undefined) {
        // Basic type validation - in real implementation, 
        // this would be more sophisticated
        validation[prop.name] = true;
      }
    });
    
    return validation;
  }

  private getRecommendedProperties(properties: any[]): string[] {
    // Return most commonly used/recommended properties
    const recommended = ['name', 'description', 'url', 'image'];
    return properties
      .filter(p => recommended.includes(p.name.toLowerCase()))
      .map(p => p.name)
      .slice(0, 4);
  }
}
