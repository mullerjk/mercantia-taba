"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { AnimatedBeamMultipleOutputDemo } from "@/components/magicui/animated-beam-multiple-outputs";
import { AnimatedListDemo } from "@/components/magicui/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/TranslationContext";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";

const files = [
  {
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
]



interface ChangelogItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  timestamp: string;
  version?: string;
  schemaType?: string;
}

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [changelogItems, setChangelogItems] = useState<ChangelogItem[]>([]);
  const [selectedSchemaType, setSelectedSchemaType] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected in home:", entityName);
    console.log("Setting selectedSchemaType to:", entityName);
    setSelectedSchemaType(entityName);
  };

  // Fetch real entities from database
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        console.log('Fetching entities from API...');
        const response = await fetch('/api/entities');
        if (response.ok) {
          const entities = await response.json();
          console.log('Fetched entities:', entities);

          const items: ChangelogItem[] = entities.map((entity: any) => {
            const category = entity.schema_type.split(':')[1] || 'Thing';
            let description = `New ${category} entity registered in the system`;

            // Create specific descriptions based on entity type and properties
            switch (category) {
              case 'Person':
                const personProps = entity.properties || {};
                const personDetails = [];
                if (personProps.jobTitle) personDetails.push(personProps.jobTitle);
                if (personProps.worksFor) personDetails.push(`at ${personProps.worksFor}`);
                if (personProps.email) personDetails.push(`contact: ${personProps.email}`);
                description = personDetails.length > 0
                  ? `${personProps.givenName || ''} ${personProps.familyName || entity.name} - ${personDetails.join(', ')}`
                  : `${entity.name} joined the network`;
                break;

              case 'Organization':
                const orgProps = entity.properties || {};
                const orgDetails = [];
                if (orgProps.orgType) orgDetails.push(orgProps.orgType);
                if (orgProps.foundingDate) orgDetails.push(`Founded ${orgProps.foundingDate}`);
                if (orgProps.url) orgDetails.push(`Website: ${orgProps.url}`);
                description = orgDetails.length > 0
                  ? `${entity.name} - ${orgDetails.join(', ')}`
                  : `${entity.name} is now part of our business network`;
                break;

              case 'Product':
                const productProps = entity.properties || {};
                const productDetails = [];
                if (productProps.price) productDetails.push(`$${productProps.price}`);
                if (productProps.category) productDetails.push(productProps.category);
                if (productProps.brand) productDetails.push(`by ${productProps.brand}`);
                description = productDetails.length > 0
                  ? `${entity.name} - ${productDetails.join(', ')}`
                  : `${entity.name} now available in our marketplace`;
                break;

              default:
                description = entity.properties?.description || `New ${category} entity: ${entity.name}`;
            }

            return {
              id: entity.id,
              title: entity.name,
              description: description,
              emoji: getEmojiForCategory(category),
              category: category,
              schemaType: entity.schema_type,
              timestamp: new Date(entity.created_at).toLocaleString(),
              version: `v1.0.0`,
            };
          });

          console.log('Converted to timeline items:', items);
          setChangelogItems(items);
        } else {
          console.error('Failed to fetch entities:', response.status);
          setChangelogItems([]);
        }
      } catch (error) {
        console.error('Error fetching entities:', error);
        setChangelogItems([]);
      }
    };



    fetchEntities();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchEntities, 30000);

    return () => clearInterval(interval);
  }, []);

  const getEmojiForCategory = (category: string): string => {
    const emojiMap: Record<string, string> = {
      "Thing": "🌐",
      "CreativeWork": "🎨",
      "Organization": "🏢",
      "Person": "👤",
      "Place": "📍",
      "Event": "📅",
      "Product": "📦",
      "Action": "⚡",
      "MedicalEntity": "🏥",
      "BioChemEntity": "🧬",
      "ChemicalSubstance": "⚗️",
      "New": "✨",
    };
    return emojiMap[category] || "📄";
  };



  // Filter changelog items based on selected schema type
  const filteredChangelogItems = selectedSchemaType
    ? changelogItems.filter(item => {
        const matches = item.schemaType === selectedSchemaType;
        console.log(`Filtering item with schemaType "${item.schemaType}" against selected "${selectedSchemaType}": ${matches}`);
        return matches;
      })
    : changelogItems;

  console.log(`Filtering: selectedSchemaType=${selectedSchemaType}, total items=${changelogItems.length}, filtered items=${filteredChangelogItems.length}`);

  const features = [
    {
      Icon: FileTextIcon,
      name: "Save your files",
      description: "We automatically save your files as you type.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Notifications",
      description: "Get notified when something happens.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
      ),
    },
    {
      Icon: Share2Icon,
      name: t('globalStructure.title'),
      description: t('globalStructure.subtitle'),
      href: "#",
      cta: t('globalStructure.explore'),
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Calendar",
      description: "Use the calendar to filter your files by date.",
      className: "col-span-3 lg:col-span-1",
      href: "#",
      cta: "Learn more",
      background: (
        <Calendar
          mode="single"
          selected={new Date(2022, 4, 11, 0, 0, 0)}
          className="absolute top-10 right-0 origin-top scale-75 rounded-md border [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90"
        />
      ),
    },
    {
      Icon: BellIcon,
      name: t('donations.title'),
      description: t('donations.subtitle'),
      href: "/donations",
      cta: t('donations.campaigns'),
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
      ),
    },
  ];

  const ChangelogEntry = ({ item }: { item: ChangelogItem }) => {
    const getEntityUrl = () => {
      switch (item.category) {
        case 'Person':
          return `/person/${item.id}`;
        case 'Organization':
          return `/organization/${item.id}`;
        case 'Product':
          return `/product/${item.id}`;
        default:
          return null;
      }
    };

    const entityUrl = getEntityUrl();

    const renderMiniCards = () => {
      // For now, we'll create mini-cards based on the description we already generated
      // In a real implementation, we'd have the entity data available
      const miniCards = [];

      switch (item.category) {
        case 'Person':
          // Extract info from description: "Antonio Müller - Software Engineer, at Mercantia, contact: antonio@mercantia.app"
          const personParts = item.description.split(' - ');
          if (personParts.length > 1) {
            const details = personParts[1].split(', ');
            details.forEach((detail, index) => {
              if (detail.includes('Software Engineer')) {
                miniCards.push(
                  <div key={`person-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.role')}</span>
                    <span className="text-sm font-semibold text-foreground">Software Engineer</span>
                  </div>
                );
              } else if (detail.includes('at Mercantia')) {
                miniCards.push(
                  <div key={`person-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.company')}</span>
                    <span className="text-sm font-semibold text-foreground">Mercantia</span>
                  </div>
                );
              } else if (detail.includes('contact:')) {
                miniCards.push(
                  <div key={`person-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.contact')}</span>
                    <span className="text-xs font-semibold text-foreground truncate">antonio@mercantia.app</span>
                  </div>
                );
              }
            });
          }
          break;

        case 'Organization':
          // Extract info from description: "Mercantia Solutions - Technology Company, Founded 2020-01-01, Website: https://mercantia.app"
          const orgParts = item.description.split(' - ');
          if (orgParts.length > 1) {
            const details = orgParts[1].split(', ');
            details.forEach((detail, index) => {
              if (detail.includes('Technology Company')) {
                miniCards.push(
                  <div key={`org-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.type')}</span>
                    <span className="text-sm font-semibold text-foreground">Technology Company</span>
                  </div>
                );
              } else if (detail.includes('Founded')) {
                miniCards.push(
                  <div key={`org-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.founded')}</span>
                    <span className="text-sm font-semibold text-foreground">2020-01-01</span>
                  </div>
                );
              } else if (detail.includes('Website:')) {
                miniCards.push(
                  <div key={`org-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.website')}</span>
                    <span className="text-xs font-semibold text-foreground truncate">mercantia.app</span>
                  </div>
                );
              }
            });
          }
          break;

        case 'Product':
          // Extract info from description: "Schema.org Toolkit Pro - $299.99, Software, by Mercantia"
          const productParts = item.description.split(' - ');
          if (productParts.length > 1) {
            const details = productParts[1].split(', ');
            details.forEach((detail, index) => {
              if (detail.startsWith('$')) {
                miniCards.push(
                  <div key={`product-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.price')}</span>
                    <span className="text-lg font-bold text-foreground">{detail}</span>
                  </div>
                );
              } else if (detail === 'Software') {
                miniCards.push(
                  <div key={`product-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.category')}</span>
                    <span className="text-sm font-semibold text-foreground">{detail}</span>
                  </div>
                );
              } else if (detail.includes('by Mercantia')) {
                miniCards.push(
                  <div key={`product-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">{t('home.brand')}</span>
                    <span className="text-sm font-semibold text-foreground">Mercantia</span>
                  </div>
                );
              }
            });
          }
          break;
      }

      return miniCards.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {miniCards}
        </div>
      ) : null;
    };

    const CardContent = () => (
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">{item.emoji}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {item.title}
              </h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {t(`home.${item.category.toLowerCase()}`)}
              </Badge>
              {item.version && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {item.version}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
              {item.description}
            </p>
          </div>
        </div>

        {/* Mini Cards */}
        {renderMiniCards()}

        {/* Live indicator */}
        <div className="flex items-center justify-end mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground">{t('home.live')}</span>
          </div>
        </div>
      </div>
    );

    if (entityUrl) {
      return (
        <a href={entityUrl} className="block z-10 relative">
          <div className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent />
          </div>
        </a>
      );
    }

    return (
      <div className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-sm z-10 relative">
        <CardContent />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-8">


      {/* Bento Grid Demo - Exact MagicUI Layout */}
      <div className="w-full px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </div>

      {/* Global Sidebar Overlay - positioned above content but below dock */}
      <GlobalSidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
        onEntitySelect={handleEntitySelect}
      />

      {/* Dock Navigation - stays on top of everything */}
      <DockNavigation
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
