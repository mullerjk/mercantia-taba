/**
 * Mock Generator: Cria dados realistas para entidades Schema.org
 * Integra Faker.js com tipos do Schema.org MCP
 */

import { faker } from '@faker-js/faker'
import type { SchemaOrgType } from '@/types/schema-org'

export interface MockEntity {
  type: string
  properties: Record<string, unknown>
  trustScore: number
}

export class MockGenerator {
  /**
   * Gera uma entidade mock baseada no tipo Schema.org
   */
  generateEntity(type: SchemaOrgType): MockEntity {
    const properties = this.generateProperties(type)
    
    return {
      type,
      properties,
      trustScore: faker.number.int({ min: 70, max: 100 }),
    }
  }

  /**
   * Gera múltiplas entidades do mesmo tipo
   */
  generateEntities(type: SchemaOrgType, count: number): MockEntity[] {
    return Array.from({ length: count }, () => this.generateEntity(type))
  }

  /**
   * Gera propriedades baseadas no tipo Schema.org
   */
  private generateProperties(type: SchemaOrgType): Record<string, unknown> {
    switch (type) {
      case 'Person':
        return this.generatePerson()
      case 'Organization':
        return this.generateOrganization()
      case 'Product':
        return this.generateProduct()
      case 'Place':
        return this.generatePlace()
      case 'Event':
        return this.generateEvent()
      case 'CreativeWork':
        return this.generateCreativeWork()
      case 'LocalBusiness':
        return this.generateLocalBusiness()
      case 'Restaurant':
        return this.generateRestaurant()
      case 'Store':
        return this.generateStore()
      case 'FoodEstablishment':
        return this.generateFoodEstablishment()
      case 'Offer':
        return this.generateOffer()
      case 'Review':
        return this.generateReview()
      case 'Rating':
        return this.generateRating()
      case 'PostalAddress':
        return this.generatePostalAddress()
      default:
        return this.generateGeneric(type)
    }
  }

  // ============================================
  // GENERATORS POR TIPO
  // ============================================

  private generatePerson(): Record<string, unknown> {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    
    return {
      '@type': 'Person',
      name: `${firstName} ${lastName}`,
      givenName: firstName,
      familyName: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      telephone: faker.phone.number(),
      birthDate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString(),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      jobTitle: faker.person.jobTitle(),
      address: this.generatePostalAddress(),
      url: faker.internet.url(),
      image: faker.image.avatar(),
    }
  }

  private generateOrganization(): Record<string, unknown> {
    const name = faker.company.name()
    
    return {
      '@type': 'Organization',
      name,
      legalName: `${name} ${faker.helpers.arrayElement(['Inc', 'LLC', 'Corp', 'Ltd'])}`,
      description: faker.company.catchPhrase(),
      foundingDate: faker.date.past({ years: 20 }).toISOString(),
      url: faker.internet.url(),
      email: faker.internet.email({ firstName: name.split(' ')[0] }).toLowerCase(),
      telephone: faker.phone.number(),
      address: this.generatePostalAddress(),
      logo: faker.image.url(),
      numberOfEmployees: faker.number.int({ min: 5, max: 5000 }),
    }
  }

  private generateProduct(): Record<string, unknown> {
    const productName = faker.commerce.productName()
    
    return {
      '@type': 'Product',
      name: productName,
      description: faker.commerce.productDescription(),
      brand: faker.company.name(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      gtin: faker.string.numeric(13),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      priceCurrency: 'BRL',
      image: faker.image.url(),
      category: faker.commerce.department(),
      manufacturer: faker.company.name(),
      weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
      color: faker.color.human(),
    }
  }

  private generatePlace(): Record<string, unknown> {
    return {
      '@type': 'Place',
      name: faker.location.streetAddress(false),
      description: faker.lorem.sentence(),
      address: this.generatePostalAddress(),
      geo: {
        '@type': 'GeoCoordinates',
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      telephone: faker.phone.number(),
      url: faker.internet.url(),
      image: faker.image.url(),
    }
  }

  private generateEvent(): Record<string, unknown> {
    const startDate = faker.date.future()
    const endDate = new Date(startDate.getTime() + 3600000 * faker.number.int({ min: 1, max: 8 }))
    
    return {
      '@type': 'Event',
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: this.generatePlace(),
      organizer: {
        '@type': 'Organization',
        name: faker.company.name(),
      },
      url: faker.internet.url(),
      image: faker.image.url(),
      eventStatus: faker.helpers.arrayElement(['EventScheduled', 'EventPostponed', 'EventCancelled']),
    }
  }

  private generateCreativeWork(): Record<string, unknown> {
    return {
      '@type': 'CreativeWork',
      name: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
      author: {
        '@type': 'Person',
        name: faker.person.fullName(),
      },
      datePublished: faker.date.past().toISOString(),
      url: faker.internet.url(),
      image: faker.image.url(),
      inLanguage: 'pt-BR',
    }
  }

  private generateLocalBusiness(): Record<string, unknown> {
    return {
      '@type': 'LocalBusiness',
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      address: this.generatePostalAddress(),
      telephone: faker.phone.number(),
      email: faker.internet.email().toLowerCase(),
      url: faker.internet.url(),
      image: faker.image.url(),
      openingHours: 'Mo-Fr 09:00-18:00',
      priceRange: faker.helpers.arrayElement(['$', '$$', '$$$', '$$$$']),
      paymentAccepted: 'Cash, Credit Card, Debit Card, Pix',
    }
  }

  private generateRestaurant(): Record<string, unknown> {
    return {
      ...this.generateLocalBusiness(),
      '@type': 'Restaurant',
      servesCuisine: faker.helpers.arrayElement([
        'Brazilian',
        'Italian',
        'Japanese',
        'Mexican',
        'Chinese',
        'French',
        'American',
      ]),
      menu: faker.internet.url(),
      acceptsReservations: faker.datatype.boolean(),
    }
  }

  private generateStore(): Record<string, unknown> {
    return {
      ...this.generateLocalBusiness(),
      '@type': 'Store',
      currenciesAccepted: 'BRL',
      paymentAccepted: 'Cash, Credit Card, Debit Card, Pix',
    }
  }

  private generateFoodEstablishment(): Record<string, unknown> {
    return {
      ...this.generateLocalBusiness(),
      '@type': 'FoodEstablishment',
      servesCuisine: faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'Snacks']),
      menu: faker.internet.url(),
    }
  }

  private generateOffer(): Record<string, unknown> {
    const validFrom = faker.date.recent()
    const validThrough = faker.date.future({ years: 1 })
    
    return {
      '@type': 'Offer',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      priceCurrency: 'BRL',
      availability: faker.helpers.arrayElement([
        'InStock',
        'OutOfStock',
        'PreOrder',
        'Discontinued',
      ]),
      validFrom: validFrom.toISOString(),
      validThrough: validThrough.toISOString(),
      url: faker.internet.url(),
    }
  }

  private generateReview(): Record<string, unknown> {
    return {
      '@type': 'Review',
      reviewBody: faker.lorem.paragraph(),
      reviewRating: this.generateRating(),
      author: {
        '@type': 'Person',
        name: faker.person.fullName(),
      },
      datePublished: faker.date.past().toISOString(),
    }
  }

  private generateRating(): Record<string, unknown> {
    return {
      '@type': 'Rating',
      ratingValue: faker.number.int({ min: 1, max: 5 }),
      bestRating: 5,
      worstRating: 1,
    }
  }

  private generatePostalAddress(): Record<string, unknown> {
    return {
      '@type': 'PostalAddress',
      streetAddress: faker.location.streetAddress(),
      addressLocality: faker.location.city(),
      addressRegion: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode('#####-###'),
      addressCountry: 'BR',
    }
  }

  private generateGeneric(type: string): Record<string, unknown> {
    return {
      '@type': type,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      url: faker.internet.url(),
      identifier: faker.string.uuid(),
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Gera um mix diversificado de entidades
   */
  generateMixedBatch(totalCount: number): MockEntity[] {
    const types: SchemaOrgType[] = [
      'Person',
      'Organization',
      'Product',
      'Place',
      'Event',
      'LocalBusiness',
      'Restaurant',
      'Store',
    ]

    const countPerType = Math.floor(totalCount / types.length)
    const entities: MockEntity[] = []

    for (const type of types) {
      entities.push(...this.generateEntities(type, countPerType))
    }

    // Adicionar restante como Person
    const remaining = totalCount - entities.length
    if (remaining > 0) {
      entities.push(...this.generateEntities('Person', remaining))
    }

    // Shuffle
    return faker.helpers.shuffle(entities)
  }

  /**
   * Gera dados específicos para o contexto brasileiro
   */
  generateBrazilianContext() {
    return {
      cpf: this.generateCPF(),
      cnpj: this.generateCNPJ(),
      cep: faker.location.zipCode('#####-###'),
      state: faker.location.state({ abbreviated: true }),
      city: faker.location.city(),
      phone: faker.phone.number(),
    }
  }

  private generateCPF(): string {
    return faker.string.numeric(11)
  }

  private generateCNPJ(): string {
    return faker.string.numeric(14)
  }
}

// Singleton instance
export const mockGenerator = new MockGenerator()
