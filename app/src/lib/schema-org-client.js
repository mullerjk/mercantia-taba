import axios from 'axios';
export class SchemaOrgClient {
    constructor() {
        this.schemaData = new Map();
        this.initialized = false;
        this.SCHEMA_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld';
    }
    async initialize() {
        if (this.initialized)
            return;
        try {
            console.log('Fetching schema.org data...');
            const response = await axios.get(this.SCHEMA_URL);
            const data = response.data;
            // Index all types and properties by their @id
            if (data['@graph']) {
                for (const item of data['@graph']) {
                    if (item['@id']) {
                        this.schemaData.set(item['@id'], item);
                        // Also index by label for easier lookup
                        if (item['rdfs:label']) {
                            this.schemaData.set(`schema:${item['rdfs:label']}`, item);
                        }
                    }
                }
            }
            this.initialized = true;
            console.log('Schema.org data loaded successfully');
        }
        catch (error) {
            console.error('Error loading schema.org data:', error);
            throw error;
        }
    }
    async getSchemaType(typeName) {
        await this.initialize();
        const typeId = typeName.startsWith('schema:') ? typeName : `schema:${typeName}`;
        const type = this.schemaData.get(typeId);
        if (!type) {
            throw new Error(`Type '${typeName}' not found in schema.org`);
        }
        // Clean up the response
        return {
            name: type['rdfs:label'] || typeName,
            description: type['rdfs:comment'] || 'No description available',
            id: type['@id'],
            type: type['@type'],
            superTypes: this.extractSuperTypes(type),
            url: `https://schema.org/${type['rdfs:label'] || typeName}`,
        };
    }
    async searchSchemas(query, limit = 10) {
        await this.initialize();
        const results = [];
        const queryLower = query.toLowerCase();
        for (const [key, value] of this.schemaData.entries()) {
            if (!value['@type'] || !Array.isArray(value['@type']))
                continue;
            if (!value['@type'].includes('rdfs:Class'))
                continue;
            const label = value['rdfs:label']?.toLowerCase() || '';
            const comment = value['rdfs:comment']?.toLowerCase() || '';
            if (label.includes(queryLower) || comment.includes(queryLower)) {
                results.push({
                    name: value['rdfs:label'],
                    description: value['rdfs:comment'] || 'No description available',
                    id: value['@id'],
                    url: `https://schema.org/${value['rdfs:label']}`,
                    relevance: label.includes(queryLower) ? 2 : 1,
                });
            }
            if (results.length >= limit * 2)
                break; // Get more to sort by relevance
        }
        // Sort by relevance and limit
        return results
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit)
            .map(({ relevance, ...rest }) => rest);
    }
    async getTypeHierarchy(typeName) {
        await this.initialize();
        const typeId = typeName.startsWith('schema:') ? typeName : `schema:${typeName}`;
        const type = this.schemaData.get(typeId);
        if (!type) {
            throw new Error(`Type '${typeName}' not found in schema.org`);
        }
        const hierarchy = {
            name: type['rdfs:label'] || typeName,
            id: type['@id'],
            parents: this.extractSuperTypes(type),
            children: this.findSubTypes(typeId),
        };
        return hierarchy;
    }
    async getTypeProperties(typeName, includeInherited = true) {
        await this.initialize();
        const typeId = typeName.startsWith('schema:') ? typeName : `schema:${typeName}`;
        const properties = [];
        const processedProps = new Set();
        // Get direct properties
        for (const [key, value] of this.schemaData.entries()) {
            if (!value['@type'] || !value['@type'].includes('rdf:Property'))
                continue;
            const domains = this.normalizeToArray(value['schema:domainIncludes']);
            if (domains.some((d) => d['@id'] === typeId)) {
                if (!processedProps.has(value['@id'])) {
                    processedProps.add(value['@id']);
                    properties.push(this.formatProperty(value));
                }
            }
        }
        // Get inherited properties if requested
        if (includeInherited) {
            const type = this.schemaData.get(typeId);
            if (type) {
                const superTypes = this.extractSuperTypes(type);
                for (const superType of superTypes) {
                    const superTypeId = superType.id;
                    for (const [key, value] of this.schemaData.entries()) {
                        if (!value['@type'] || !value['@type'].includes('rdf:Property'))
                            continue;
                        const domains = this.normalizeToArray(value['schema:domainIncludes']);
                        if (domains.some((d) => d['@id'] === superTypeId)) {
                            if (!processedProps.has(value['@id'])) {
                                processedProps.add(value['@id']);
                                properties.push({
                                    ...this.formatProperty(value),
                                    inheritedFrom: superType.name,
                                });
                            }
                        }
                    }
                }
            }
        }
        return properties.sort((a, b) => {
            const nameA = typeof a.name === 'string' ? a.name : String(a.name || '');
            const nameB = typeof b.name === 'string' ? b.name : String(b.name || '');
            return nameA.localeCompare(nameB);
        });
    }
    async generateExample(typeName, customProperties) {
        await this.initialize();
        const type = await this.getSchemaType(typeName);
        const properties = await this.getTypeProperties(typeName, false);
        const example = {
            '@context': 'https://schema.org',
            '@type': type.name,
        };
        // Add common properties
        const commonProps = ['name', 'description', 'url', 'identifier', 'image'];
        for (const prop of properties) {
            if (commonProps.includes(prop.name)) {
                example[prop.name] = this.generateExampleValue(prop);
            }
        }
        // Add custom properties
        if (customProperties) {
            Object.assign(example, customProperties);
        }
        return example;
    }
    extractSuperTypes(type) {
        const superClasses = this.normalizeToArray(type['rdfs:subClassOf']);
        return superClasses.map((sc) => {
            const superType = this.schemaData.get(sc['@id']);
            return {
                name: superType?.['rdfs:label'] || sc['@id'].replace('schema:', ''),
                id: sc['@id'],
            };
        });
    }
    findSubTypes(typeId) {
        const subTypes = [];
        // Normalize the typeId to ensure correct comparison
        const normalizedTypeId = typeId.startsWith('schema:') ? typeId : `schema:${typeId}`;
        for (const [key, value] of this.schemaData.entries()) {
            // Only process rdfs:Class types (handle both string and array)
            const types = value['@type'];
            if (!types)
                continue;
            const isClass = Array.isArray(types) ? types.includes('rdfs:Class') : types === 'rdfs:Class';
            if (!isClass)
                continue;
            // Get the superclasses of this type
            const subClassOf = value['rdfs:subClassOf'];
            if (!subClassOf)
                continue;
            // Handle both object format {@ id: string} and string format "schema:Type"
            const superClasses = this.normalizeToArray(subClassOf);
            // Check if any superclass matches our target typeId
            const isDirectSubtype = superClasses.some((sc) => {
                // sc can be either a string or an object with @id
                const scId = typeof sc === 'string' ? sc : sc['@id'];
                return scId === normalizedTypeId;
            });
            if (isDirectSubtype) {
                subTypes.push({
                    name: value['rdfs:label'],
                    id: value['@id'],
                });
            }
        }
        return subTypes;
    }
    getTypeLabelById(typeId) {
        const type = this.schemaData.get(typeId);
        return type ? type['rdfs:label'] || null : null;
    }
    formatProperty(prop) {
        const ranges = this.normalizeToArray(prop['schema:rangeIncludes']);
        return {
            name: prop['rdfs:label'],
            description: prop['rdfs:comment'] || 'No description available',
            id: prop['@id'],
            expectedTypes: ranges.map((r) => {
                const rangeType = this.schemaData.get(r['@id']);
                return rangeType?.['rdfs:label'] || r['@id'].replace('schema:', '');
            }),
        };
    }
    generateExampleValue(property) {
        const type = property.expectedTypes[0];
        switch (type) {
            case 'Text':
                return `Example ${property.name}`;
            case 'URL':
                return 'https://example.com';
            case 'Date':
                return '2024-01-01';
            case 'DateTime':
                return '2024-01-01T12:00:00Z';
            case 'Number':
            case 'Integer':
                return 42;
            case 'Boolean':
                return true;
            case 'ImageObject':
                return {
                    '@type': 'ImageObject',
                    url: 'https://example.com/image.jpg',
                    contentUrl: 'https://example.com/image.jpg',
                };
            default:
                return `Example ${property.name}`;
        }
    }
    normalizeToArray(value) {
        if (!value)
            return [];
        return Array.isArray(value) ? value : [value];
    }
}
//# sourceMappingURL=schema-org-client.js.map