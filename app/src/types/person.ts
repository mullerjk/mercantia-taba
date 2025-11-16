/**
 * Schema.org Person type with all available properties
 * Reference: https://schema.org/Person
 */

export interface PersonSchema {
  // Core Properties
  '@type': 'Person'
  name: string
  givenName?: string
  familyName?: string
  additionalName?: string
  honorificPrefix?: string // Dr., Mr., Mrs., etc.
  honorificSuffix?: string // Jr., Sr., PhD, etc.

  // Contact Information
  email?: string
  telephone?: string
  faxNumber?: string

  // Addresses
  address?: PostalAddress
  homeLocation?: Place
  workLocation?: Place

  // Personal Details
  birthDate?: string // ISO 8601 date
  birthPlace?: Place
  deathDate?: string
  deathPlace?: Place
  gender?: string // Male, Female, Other
  nationality?: Country

  // Professional
  jobTitle?: string
  worksFor?: Organization
  affiliation?: Organization[]
  alumniOf?: EducationalOrganization[]
  award?: string[]
  colleague?: PersonSchema[]

  // Social & Web
  url?: string
  sameAs?: string[] // Social media profiles
  image?: string | ImageObject

  // Physical Characteristics
  height?: string | QuantitativeValue
  weight?: string | QuantitativeValue

  // Relationships
  spouse?: PersonSchema
  children?: PersonSchema[]
  parent?: PersonSchema[]
  sibling?: PersonSchema[]
  follows?: PersonSchema[]
  knows?: PersonSchema[]

  // Communication
  contactPoint?: ContactPoint[]

  // Financial
  netWorth?: PriceSpecification
  owns?: OwnershipInfo[]

  // Additional
  description?: string
  identifier?: string
  alternateName?: string
  disambiguatingDescription?: string

  // Performance & Achievements
  performerIn?: Event[]
  publishingPrinciples?: string
  seeks?: Demand

  // Brand & Sponsor
  brand?: Brand
  sponsor?: Organization | PersonSchema

  // Tax & Legal
  taxID?: string
  vatID?: string

  // Other properties
  callSign?: string
  duns?: string
  globalLocationNumber?: string
  isicV4?: string
  naics?: string
}

export interface PostalAddress {
  '@type': 'PostalAddress'
  streetAddress?: string
  addressLocality?: string // City
  addressRegion?: string // State/Province
  postalCode?: string
  addressCountry?: string
  postOfficeBoxNumber?: string
}

export interface Place {
  '@type': 'Place'
  name?: string
  address?: PostalAddress
  geo?: GeoCoordinates
}

export interface GeoCoordinates {
  '@type': 'GeoCoordinates'
  latitude: number
  longitude: number
  elevation?: number
}

export interface Country {
  '@type': 'Country'
  name: string
}

export interface Organization {
  '@type': 'Organization'
  name: string
  url?: string
}

export interface EducationalOrganization {
  '@type': 'EducationalOrganization'
  name: string
  url?: string
}

export interface ImageObject {
  '@type': 'ImageObject'
  url: string
  contentUrl?: string
  caption?: string
  width?: number
  height?: number
}

export interface QuantitativeValue {
  '@type': 'QuantitativeValue'
  value: number
  unitCode?: string
  unitText?: string
}

export interface ContactPoint {
  '@type': 'ContactPoint'
  telephone?: string
  email?: string
  contactType?: string // customer service, technical support, etc.
  areaServed?: string
  availableLanguage?: string[]
  hoursAvailable?: string
}

export interface PriceSpecification {
  '@type': 'PriceSpecification'
  price: number
  priceCurrency: string
}

export interface OwnershipInfo {
  '@type': 'OwnershipInfo'
  ownedFrom?: string
  ownedThrough?: string
  typeOfGood?: string
}

export interface Event {
  '@type': 'Event'
  name: string
  startDate?: string
  endDate?: string
}

export interface Demand {
  '@type': 'Demand'
  name: string
}

export interface Brand {
  '@type': 'Brand'
  name: string
  logo?: string
}
