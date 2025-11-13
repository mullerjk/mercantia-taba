interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  )
}

// Utilitários para criar structured data
export function createProductJsonLd(product: {
  id: string
  name: string
  description?: string
  image?: string
  price?: number
  category?: string
  brand?: string
  sku?: string
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand
    } : undefined,
    category: product.category,
    offers: product.price ? {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Mercantia'
      }
    } : undefined
  }
}

export function createOrganizationJsonLd(org: {
  id: string
  name: string
  description?: string
  url?: string
  logo?: string
  address?: string
  foundingDate?: string
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: org.url,
    logo: org.logo,
    address: org.address ? {
      '@type': 'PostalAddress',
      addressLocality: org.address
    } : undefined,
    foundingDate: org.foundingDate
  }
}

export function createPersonJsonLd(person: {
  id: string
  name: string
  email?: string
  telephone?: string
  address?: string
  jobTitle?: string
  worksFor?: string
  image?: string
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    email: person.email,
    telephone: person.telephone,
    address: person.address ? {
      '@type': 'PostalAddress',
      addressLocality: person.address
    } : undefined,
    jobTitle: person.jobTitle,
    worksFor: person.worksFor ? {
      '@type': 'Organization',
      name: person.worksFor
    } : undefined,
    image: person.image
  }
}

export function createWebSiteJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mercantia',
    description: 'Marketplace inteligente com dados Schema.org estruturados',
    url: 'https://mercantia.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mercantia.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mercantia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mercantia.app/logo.png'
      }
    }
  }
}
