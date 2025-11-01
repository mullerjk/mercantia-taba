// Mock data for Schema.org entities to populate and test generated designs

export interface MockEntity {
  id: string
  entity: {
    name: string
    type: string
    fields: Array<{
      name: string
      type: string
      required: boolean
      description: string
      mockValue: any
    }>
  }
}

// Real-world Schema.org entities with mock data
export const mockSchemaData: MockEntity[] = [
  {
    id: "article-1",
    entity: {
      name: "TechArticle",
      type: "TechArticle",
      fields: [
        {
          name: "headline",
          type: "string",
          required: true,
          description: "The headline/title of the article",
          mockValue: "Revolutionary AI Chatbot Achieves Human-Level Performance"
        },
        {
          name: "author",
          type: "Person",
          required: true,
          description: "Author of the article",
          mockValue: {
            name: "Dr. Sarah Chen",
            jobTitle: "AI Research Director",
            affiliation: "Stanford AI Lab"
          }
        },
        {
          name: "datePublished",
          type: "date",
          required: true,
          description: "Publication date",
          mockValue: "2025-10-30"
        },
        {
          name: "description",
          type: "string",
          required: false,
          description: "Brief description of the article",
          mockValue: "A groundbreaking study reveals how advanced language models can now perform complex reasoning tasks with accuracy matching human experts."
        },
        {
          name: "image",
          type: "URL",
          required: false,
          description: "Featured image URL",
          mockValue: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
        },
        {
          name: "wordCount",
          type: "number",
          required: false,
          description: "Number of words in article",
          mockValue: 2450
        },
        {
          name: "timeRequired",
          type: "duration",
          required: false,
          description: "Time to read article",
          mockValue: "PT8M"
        }
      ]
    }
  },
  {
    id: "organization-1",
    entity: {
      name: "Organization",
      type: "Organization",
      fields: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Organization name",
          mockValue: "TechInnovate Solutions"
        },
        {
          name: "logo",
          type: "URL",
          required: false,
          description: "Organization logo",
          mockValue: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200"
        },
        {
          name: "url",
          type: "URL",
          required: false,
          description: "Website URL",
          mockValue: "https://techinnovate.com"
        },
        {
          name: "foundingDate",
          type: "date",
          required: false,
          description: "Founded date",
          mockValue: "2020-03-15"
        },
        {
          name: "address",
          type: "PostalAddress",
          required: false,
          description: "Physical address",
          mockValue: {
            streetAddress: "123 Innovation Drive",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            postalCode: "94105",
            addressCountry: "US"
          }
        },
        {
          name: "contactPoint",
          type: "ContactPoint",
          required: false,
          description: "Contact information",
          mockValue: {
            telephone: "+1-555-0123",
            contactType: "customer service",
            email: "contact@techinnovate.com"
          }
        },
        {
          name: "sameAs",
          type: "array",
          required: false,
          description: "Social media profiles",
          mockValue: [
            "https://twitter.com/techinnovate",
            "https://linkedin.com/company/techinnovate",
            "https://github.com/techinnovate"
          ]
        },
        {
          name: "numberOfEmployees",
          type: "number",
          required: false,
          description: "Number of employees",
          mockValue: 150
        }
      ]
    }
  },
  {
    id: "event-1",
    entity: {
      name: "Event",
      type: "Event",
      fields: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Event name",
          mockValue: "AI Summit 2025: The Future of Artificial Intelligence"
        },
        {
          name: "startDate",
          type: "date",
          required: true,
          description: "Start date and time",
          mockValue: "2025-11-15T09:00:00-08:00"
        },
        {
          name: "endDate",
          type: "date",
          required: true,
          description: "End date and time",
          mockValue: "2025-11-17T18:00:00-08:00"
        },
        {
          name: "location",
          type: "Place",
          required: true,
          description: "Event location",
          mockValue: {
            name: "Moscone Center",
            address: {
              streetAddress: "747 Howard St",
              addressLocality: "San Francisco",
              addressRegion: "CA",
              postalCode: "94103",
              addressCountry: "US"
            }
          }
        },
        {
          name: "description",
          type: "string",
          required: false,
          description: "Event description",
          mockValue: "Join industry leaders, researchers, and innovators for three days of cutting-edge AI discussions, networking, and the latest breakthroughs in artificial intelligence."
        },
        {
          name: "organizer",
          type: "Organization",
          required: false,
          description: "Event organizer",
          mockValue: {
            name: "AI Research Consortium",
            url: "https://airesearch.org"
          }
        },
        {
          name: "attendeeCapacity",
          type: "number",
          required: false,
          description: "Maximum attendees",
          mockValue: 5000
        },
        {
          name: "offers",
          type: "Offer",
          required: false,
          description: "Ticket information",
          mockValue: {
            price: "299.99",
            priceCurrency: "USD",
            availability: "InStock",
            url: "https://aisummit2025.com/tickets"
          }
        }
      ]
    }
  },
  {
    id: "person-1",
    entity: {
      name: "Person",
      type: "Person",
      fields: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Full name",
          mockValue: "Dr. Alex Rodriguez"
        },
        {
          name: "jobTitle",
          type: "string",
          required: false,
          description: "Job title",
          mockValue: "Senior Machine Learning Engineer"
        },
        {
          name: "worksFor",
          type: "Organization",
          required: false,
          description: "Current employer",
          mockValue: {
            name: "Google DeepMind",
            url: "https://deepmind.com"
          }
        },
        {
          name: "image",
          type: "URL",
          required: false,
          description: "Profile photo",
          mockValue: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
        },
        {
          name: "email",
          type: "string",
          required: false,
          description: "Email address",
          mockValue: "alex.rodriguez@example.com"
        },
        {
          name: "telephone",
          type: "string",
          required: false,
          description: "Phone number",
          mockValue: "+1-555-0199"
        },
        {
          name: "sameAs",
          type: "array",
          required: false,
          description: "Social profiles",
          mockValue: [
            "https://linkedin.com/in/alexrodriguez-ml",
            "https://github.com/alexrodriguez-ai",
            "https://twitter.com/alexrodriguez_ml"
          ]
        },
        {
          name: "knowsAbout",
          type: "array",
          required: false,
          description: "Areas of expertise",
          mockValue: [
            "Machine Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Deep Learning"
          ]
        }
      ]
    }
  },
  {
    id: "product-1",
    entity: {
      name: "Product",
      type: "Product",
      fields: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Product name",
          mockValue: "ProAI Development Suite"
        },
        {
          name: "description",
          type: "string",
          required: true,
          description: "Product description",
          mockValue: "Enterprise-grade AI development platform with pre-trained models, automated workflows, and advanced analytics."
        },
        {
          name: "brand",
          type: "Brand",
          required: false,
          description: "Product brand",
          mockValue: {
            name: "AI Solutions Inc."
          }
        },
        {
          name: "image",
          type: "array",
          required: false,
          description: "Product images",
          mockValue: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600"
          ]
        },
        {
          name: "offers",
          type: "Offer",
          required: false,
          description: "Pricing information",
          mockValue: {
            price: "999.99",
            priceCurrency: "USD",
            availability: "InStock",
            validFrom: "2025-01-01",
            validThrough: "2025-12-31"
          }
        },
        {
          name: "aggregateRating",
          type: "AggregateRating",
          required: false,
          description: "Customer ratings",
          mockValue: {
            ratingValue: "4.8",
            reviewCount: "247",
            bestRating: "5",
            worstRating: "1"
          }
        },
        {
          name: "category",
          type: "string",
          required: false,
          description: "Product category",
          mockValue: "Software > Development Tools > AI & Machine Learning"
        },
        {
          name: "sku",
          type: "string",
          required: false,
          description: "Product SKU",
          mockValue: "PAI-SUITE-PRO-2025"
        }
      ]
    }
  }
]

// Additional utility functions
export const getMockEntityByType = (type: string): MockEntity | undefined => {
  return mockSchemaData.find(entity => 
    entity.entity.type.toLowerCase().includes(type.toLowerCase())
  )
}

export const getAllMockEntities = (): MockEntity[] => {
  return mockSchemaData
}

export const getMockEntityById = (id: string): MockEntity | undefined => {
  return mockSchemaData.find(entity => entity.id === id)
}
