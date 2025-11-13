import { NextResponse } from 'next/server';
import axios from 'axios';

interface ProcessedEntity {
  id: string;
  name: string;
  description: string;
  children: ProcessedEntity[];
  level: number;
}

interface SchemaType {
  '@id': string;
  '@type': string | string[];
  'rdfs:label': string;
  'rdfs:comment'?: string;
  'rdfs:subClassOf'?: { '@id': string } | { '@id': string }[];
  [key: string]: any;
}

class SimpleSchemaOrgClient {
  private schemaData: Map<string, any> = new Map();
  private initialized = false;
  private readonly SCHEMA_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld';

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Fetching complete schema.org data...');
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
      console.log(`Schema.org data loaded with ${this.schemaData.size} items`);
    } catch (error) {
      console.error('Error loading schema.org data:', error);
      throw error;
    }
  }

  async getSchemaType(typeName: string): Promise<any> {
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

  async getTypeHierarchy(typeName: string): Promise<any> {
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

  private extractSuperTypes(type: any): any[] {
    const superClasses = this.normalizeToArray(type['rdfs:subClassOf']);
    return superClasses.map((sc: any) => {
      const superType = this.schemaData.get(sc['@id']);
      return {
        name: superType?.['rdfs:label'] || sc['@id'].replace('schema:', ''),
        id: sc['@id'],
      };
    });
  }

  private findSubTypes(typeId: string): any[] {
    const subTypes: any[] = [];

    for (const [key, value] of this.schemaData.entries()) {
      if (!value['@type'] || !Array.isArray(value['@type'])) continue;
      if (!value['@type'].includes('rdfs:Class')) continue;

      const superClasses = this.normalizeToArray(value['rdfs:subClassOf']);
      if (superClasses.some((sc: any) => sc['@id'] === typeId)) {
        subTypes.push({
          name: value['rdfs:label'],
          id: value['@id'],
        });
      }
    }

    return subTypes;
  }

  private normalizeToArray(value: any): any[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }
}

async function buildCompleteSchemaHierarchy(): Promise<ProcessedEntity[]> {
  try {
    console.log('Building complete Schema.org hierarchy...');

    const client = new SimpleSchemaOrgClient();
    await client.initialize();

    // Start with "Thing" and build the hierarchy
    const thingHierarchy = await client.getTypeHierarchy('Thing');
    const rootEntities: ProcessedEntity[] = [];

    console.log(`Thing has ${thingHierarchy.children?.length || 0} direct children`);

    // Process each direct child of "Thing"
    for (const child of thingHierarchy.children || []) {
      try {
        console.log(`Processing root entity: ${child.name}`);
        const entity = await buildEntityWithChildren(client, child.name, 1);
        if (entity) {
          rootEntities.push(entity);
        }
      } catch (error) {
        console.warn(`Failed to process root entity ${child.name}:`, error);
      }
    }

    console.log(`Built hierarchy with ${rootEntities.length} root entities`);
    return rootEntities.sort((a, b) => a.name.localeCompare(b.name));

  } catch (error) {
    console.error('Error building complete hierarchy:', error);
    throw error;
  }
}

async function buildEntityWithChildren(
  client: SimpleSchemaOrgClient,
  entityName: string,
  level: number,
  maxDepth: number = 4
): Promise<ProcessedEntity | null> {
  try {
    if (level > maxDepth) {
      return null;
    }

    const typeInfo = await client.getSchemaType(entityName);
    const hierarchyInfo = await client.getTypeHierarchy(entityName);

    const children: ProcessedEntity[] = [];

    // Process children if they exist and we're not too deep
    if (hierarchyInfo.children && hierarchyInfo.children.length > 0 && level < maxDepth) {
      // Limit children to avoid overwhelming the UI
      const childLimit = level === 1 ? 20 : level === 2 ? 10 : 5;

      console.log(`${entityName} has ${hierarchyInfo.children.length} children, processing ${Math.min(childLimit, hierarchyInfo.children.length)}`);

      for (const child of hierarchyInfo.children.slice(0, childLimit)) {
        try {
          const childEntity = await buildEntityWithChildren(client, child.name, level + 1, maxDepth);
          if (childEntity) {
            children.push(childEntity);
          }
        } catch (error) {
          console.warn(`Failed to process child ${child.name} of ${entityName}:`, error);
        }
      }
    }

    return {
      id: typeInfo.id,
      name: typeInfo.name,
      description: typeInfo.description,
      children: children.sort((a, b) => a.name.localeCompare(b.name)),
      level
    };

  } catch (error) {
    console.warn(`Failed to build entity ${entityName}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    console.log('API: Starting Schema.org hierarchy fetch');

    // Build hierarchy with real Schema.org data
    const hierarchy = await buildSchemaHierarchy();
    console.log(`API: Hierarchy built with ${hierarchy.length} root entities`);
    console.log('API: Root entity children count:', hierarchy[0]?.children?.length || 0);

    return NextResponse.json(hierarchy);

  } catch (error) {
    console.error('API Error:', error);

    // Fallback to basic hierarchy if real data fails
    const fallbackHierarchy: ProcessedEntity[] = [
      {
        id: 'schema:Thing',
        name: 'Thing',
        description: 'The most generic type of item.',
        level: 0,
        children: [
          {
            id: 'schema:Action',
            name: 'Action',
            description: 'An action performed by a direct or indirect agent.',
            level: 1,
            children: []
          },
          {
            id: 'schema:Place',
            name: 'Place',
            description: 'Entities that have a somewhat fixed, physical extension.',
            level: 1,
            children: []
          },
          {
            id: 'schema:Person',
            name: 'Person',
            description: 'A person (alive, dead, undead, or fictional).',
            level: 1,
            children: []
          },
          {
            id: 'schema:Organization',
            name: 'Organization',
            description: 'An organization such as a school, NGO, corporation, club, etc.',
            level: 1,
            children: []
          },
          {
            id: 'schema:CreativeWork',
            name: 'CreativeWork',
            description: 'The most generic kind of creative work.',
            level: 1,
            children: []
          },
          {
            id: 'schema:Product',
            name: 'Product',
            description: 'Any offered product or service.',
            level: 1,
            children: []
          },
          {
            id: 'schema:Event',
            name: 'Event',
            description: 'An event happening at a certain time and location.',
            level: 1,
            children: []
          },
          {
            id: 'schema:Intangible',
            name: 'Intangible',
            description: 'A utility class that serves as the umbrella for a number of intangible entities.',
            level: 1,
            children: []
          },
          {
            id: 'schema:StructuredValue',
            name: 'StructuredValue',
            description: 'A structured value.',
            level: 1,
            children: []
          }
        ]
      }
    ];

    console.log('API: Returning fallback hierarchy due to error');
    return NextResponse.json(fallbackHierarchy);
  }
}

// Comprehensive Schema.org hierarchy based on current official documentation
const schemaHierarchy: ProcessedEntity[] = [
  {
    id: 'schema:Thing',
    name: 'Thing',
    description: 'The most generic type of item.',
    level: 0,
    children: [
      {
        id: 'schema:Action',
        name: 'Action',
        description: 'An action performed by a direct or indirect agent.',
        level: 1,
        children: [
          { id: 'schema:AssessAction', name: 'AssessAction', description: 'The act of assessing something.', level: 2, children: [] },
          { id: 'schema:ConsumeAction', name: 'ConsumeAction', description: 'The act of consuming something.', level: 2, children: [] },
          { id: 'schema:CreateAction', name: 'CreateAction', description: 'The act of creating something.', level: 2, children: [] },
          { id: 'schema:FindAction', name: 'FindAction', description: 'The act of finding something.', level: 2, children: [] },
          { id: 'schema:InteractAction', name: 'InteractAction', description: 'The act of interacting with another party.', level: 2, children: [] },
          { id: 'schema:MoveAction', name: 'MoveAction', description: 'An agent relocates an object.', level: 2, children: [] },
          { id: 'schema:OrganizeAction', name: 'OrganizeAction', description: 'The act of organizing something.', level: 2, children: [] },
          { id: 'schema:PlayAction', name: 'PlayAction', description: 'The act of playing a game or sport.', level: 2, children: [] },
          { id: 'schema:SearchAction', name: 'SearchAction', description: 'The act of searching for something.', level: 2, children: [] },
          { id: 'schema:TradeAction', name: 'TradeAction', description: 'The act of participating in an exchange.', level: 2, children: [] },
          { id: 'schema:TransferAction', name: 'TransferAction', description: 'The act of transferring something.', level: 2, children: [] },
          { id: 'schema:UpdateAction', name: 'UpdateAction', description: 'The act of updating something.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:CreativeWork',
        name: 'CreativeWork',
        description: 'The most generic kind of creative work.',
        level: 1,
        children: [
          { id: 'schema:Article', name: 'Article', description: 'An article.', level: 2, children: [] },
          { id: 'schema:Atlas', name: 'Atlas', description: 'An atlas.', level: 2, children: [] },
          { id: 'schema:Blog', name: 'Blog', description: 'A blog.', level: 2, children: [] },
          { id: 'schema:Book', name: 'Book', description: 'A book.', level: 2, children: [] },
          { id: 'schema:Chapter', name: 'Chapter', description: 'A chapter of a book.', level: 2, children: [] },
          { id: 'schema:Claim', name: 'Claim', description: 'A claim.', level: 2, children: [] },
          { id: 'schema:Clip', name: 'Clip', description: 'A clip.', level: 2, children: [] },
          { id: 'schema:Code', name: 'Code', description: 'A code.', level: 2, children: [] },
          { id: 'schema:Collection', name: 'Collection', description: 'A collection of items.', level: 2, children: [] },
          { id: 'schema:ComicStory', name: 'ComicStory', description: 'A comic story.', level: 2, children: [] },
          { id: 'schema:Comment', name: 'Comment', description: 'A comment.', level: 2, children: [] },
          { id: 'schema:Conversation', name: 'Conversation', description: 'A conversation.', level: 2, children: [] },
          { id: 'schema:Course', name: 'Course', description: 'A course.', level: 2, children: [] },
          { id: 'schema:CreativeWorkSeason', name: 'CreativeWorkSeason', description: 'A season of a creative work.', level: 2, children: [] },
          { id: 'schema:CreativeWorkSeries', name: 'CreativeWorkSeries', description: 'A series of creative works.', level: 2, children: [] },
          { id: 'schema:DataCatalog', name: 'DataCatalog', description: 'A data catalog.', level: 2, children: [] },
          { id: 'schema:Dataset', name: 'Dataset', description: 'A dataset.', level: 2, children: [] },
          { id: 'schema:Diet', name: 'Diet', description: 'A diet.', level: 2, children: [] },
          { id: 'schema:DigitalDocument', name: 'DigitalDocument', description: 'A digital document.', level: 2, children: [] },
          { id: 'schema:Episode', name: 'Episode', description: 'An episode.', level: 2, children: [] },
          { id: 'schema:ExercisePlan', name: 'ExercisePlan', description: 'An exercise plan.', level: 2, children: [] },
          { id: 'schema:Game', name: 'Game', description: 'A game.', level: 2, children: [] },
          { id: 'schema:Guide', name: 'Guide', description: 'A guide.', level: 2, children: [] },
          { id: 'schema:HowTo', name: 'HowTo', description: 'A how-to guide.', level: 2, children: [] },
          { id: 'schema:HowToDirection', name: 'HowToDirection', description: 'A direction for a how-to.', level: 2, children: [] },
          { id: 'schema:HowToSection', name: 'HowToSection', description: 'A section of a how-to.', level: 2, children: [] },
          { id: 'schema:HowToStep', name: 'HowToStep', description: 'A step in a how-to.', level: 2, children: [] },
          { id: 'schema:HowToTip', name: 'HowToTip', description: 'A tip for a how-to.', level: 2, children: [] },
          { id: 'schema:HyperToc', name: 'HyperToc', description: 'A hypertext table of contents.', level: 2, children: [] },
          { id: 'schema:HyperTocEntry', name: 'HyperTocEntry', description: 'An entry in a hypertext table of contents.', level: 2, children: [] },
          { id: 'schema:ImageObject', name: 'ImageObject', description: 'An image object.', level: 2, children: [] },
          { id: 'schema:Legislation', name: 'Legislation', description: 'A legislation.', level: 2, children: [] },
          { id: 'schema:Manuscript', name: 'Manuscript', description: 'A manuscript.', level: 2, children: [] },
          { id: 'schema:Map', name: 'Map', description: 'A map.', level: 2, children: [] },
          { id: 'schema:MathSolver', name: 'MathSolver', description: 'A math solver.', level: 2, children: [] },
          { id: 'schema:MediaObject', name: 'MediaObject', description: 'A media object.', level: 2, children: [] },
          { id: 'schema:Menu', name: 'Menu', description: 'A menu.', level: 2, children: [] },
          { id: 'schema:MenuSection', name: 'MenuSection', description: 'A section of a menu.', level: 2, children: [] },
          { id: 'schema:Message', name: 'Message', description: 'A message.', level: 2, children: [] },
          { id: 'schema:Movie', name: 'Movie', description: 'A movie.', level: 2, children: [] },
          { id: 'schema:MusicComposition', name: 'MusicComposition', description: 'A music composition.', level: 2, children: [] },
          { id: 'schema:MusicPlaylist', name: 'MusicPlaylist', description: 'A music playlist.', level: 2, children: [] },
          { id: 'schema:MusicRecording', name: 'MusicRecording', description: 'A music recording.', level: 2, children: [] },
          { id: 'schema:MusicVideoObject', name: 'MusicVideoObject', description: 'A music video object.', level: 2, children: [] },
          { id: 'schema:Newspaper', name: 'Newspaper', description: 'A newspaper.', level: 2, children: [] },
          { id: 'schema:Painting', name: 'Painting', description: 'A painting.', level: 2, children: [] },
          { id: 'schema:Photograph', name: 'Photograph', description: 'A photograph.', level: 2, children: [] },
          { id: 'schema:Play', name: 'Play', description: 'A play.', level: 2, children: [] },
          { id: 'schema:Poster', name: 'Poster', description: 'A poster.', level: 2, children: [] },
          { id: 'schema:PublicationIssue', name: 'PublicationIssue', description: 'A publication issue.', level: 2, children: [] },
          { id: 'schema:PublicationVolume', name: 'PublicationVolume', description: 'A publication volume.', level: 2, children: [] },
          { id: 'schema:Question', name: 'Question', description: 'A question.', level: 2, children: [] },
          { id: 'schema:Quotation', name: 'Quotation', description: 'A quotation.', level: 2, children: [] },
          { id: 'schema:Recipe', name: 'Recipe', description: 'A recipe.', level: 2, children: [] },
          { id: 'schema:Review', name: 'Review', description: 'A review.', level: 2, children: [] },
          { id: 'schema:ScholarlyArticle', name: 'ScholarlyArticle', description: 'A scholarly article.', level: 2, children: [] },
          { id: 'schema:Sculpture', name: 'Sculpture', description: 'A sculpture.', level: 2, children: [] },
          { id: 'schema:SheetMusic', name: 'SheetMusic', description: 'Sheet music.', level: 2, children: [] },
          { id: 'schema:ShortStory', name: 'ShortStory', description: 'A short story.', level: 2, children: [] },
          { id: 'schema:SiteNavigationElement', name: 'SiteNavigationElement', description: 'A site navigation element.', level: 2, children: [] },
          { id: 'schema:SoftwareApplication', name: 'SoftwareApplication', description: 'A software application.', level: 2, children: [] },
          { id: 'schema:SoftwareSourceCode', name: 'SoftwareSourceCode', description: 'Software source code.', level: 2, children: [] },
          { id: 'schema:SpecialAnnouncement', name: 'SpecialAnnouncement', description: 'A special announcement.', level: 2, children: [] },
          { id: 'schema:Statement', name: 'Statement', description: 'A statement.', level: 2, children: [] },
          { id: 'schema:TVSeries', name: 'TVSeries', description: 'A TV series.', level: 2, children: [] },
          { id: 'schema:TVSeason', name: 'TVSeason', description: 'A TV season.', level: 2, children: [] },
          { id: 'schema:TVEpisode', name: 'TVEpisode', description: 'A TV episode.', level: 2, children: [] },
          { id: 'schema:Table', name: 'Table', description: 'A table.', level: 2, children: [] },
          { id: 'schema:TechArticle', name: 'TechArticle', description: 'A technical article.', level: 2, children: [] },
          { id: 'schema:TextObject', name: 'TextObject', description: 'A text object.', level: 2, children: [] },
          { id: 'schema:Thesis', name: 'Thesis', description: 'A thesis.', level: 2, children: [] },
          { id: 'schema:VideoGame', name: 'VideoGame', description: 'A video game.', level: 2, children: [] },
          { id: 'schema:VideoObject', name: 'VideoObject', description: 'A video object.', level: 2, children: [] },
          { id: 'schema:VisualArtwork', name: 'VisualArtwork', description: 'A visual artwork.', level: 2, children: [] },
          { id: 'schema:WebPage', name: 'WebPage', description: 'A web page.', level: 2, children: [] },
          { id: 'schema:WebPageElement', name: 'WebPageElement', description: 'A web page element.', level: 2, children: [] },
          { id: 'schema:WebSite', name: 'WebSite', description: 'A web site.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:Event',
        name: 'Event',
        description: 'An event happening at a certain time and location.',
        level: 1,
        children: [
          { id: 'schema:BusinessEvent', name: 'BusinessEvent', description: 'Event type: Business event.', level: 2, children: [] },
          { id: 'schema:ChildrensEvent', name: 'ChildrensEvent', description: 'Event type: Children\'s event.', level: 2, children: [] },
          { id: 'schema:ComedyEvent', name: 'ComedyEvent', description: 'Event type: Comedy event.', level: 2, children: [] },
          { id: 'schema:CourseInstance', name: 'CourseInstance', description: 'An instance of a course.', level: 2, children: [] },
          { id: 'schema:DanceEvent', name: 'DanceEvent', description: 'Event type: Dance event.', level: 2, children: [] },
          { id: 'schema:DeliveryEvent', name: 'DeliveryEvent', description: 'An event involving the delivery of an item.', level: 2, children: [] },
          { id: 'schema:EducationEvent', name: 'EducationEvent', description: 'Event type: Education event.', level: 2, children: [] },
          { id: 'schema:ExhibitionEvent', name: 'ExhibitionEvent', description: 'Event type: Exhibition event.', level: 2, children: [] },
          { id: 'schema:Festival', name: 'Festival', description: 'Event type: Festival.', level: 2, children: [] },
          { id: 'schema:FoodEvent', name: 'FoodEvent', description: 'Event type: Food event.', level: 2, children: [] },
          { id: 'schema:LiteraryEvent', name: 'LiteraryEvent', description: 'Event type: Literary event.', level: 2, children: [] },
          { id: 'schema:MusicEvent', name: 'MusicEvent', description: 'Event type: Music event.', level: 2, children: [] },
          { id: 'schema:PublicationEvent', name: 'PublicationEvent', description: 'A publication event.', level: 2, children: [] },
          { id: 'schema:SaleEvent', name: 'SaleEvent', description: 'Event type: Sales event.', level: 2, children: [] },
          { id: 'schema:ScreeningEvent', name: 'ScreeningEvent', description: 'A screening event.', level: 2, children: [] },
          { id: 'schema:SocialEvent', name: 'SocialEvent', description: 'Event type: Social event.', level: 2, children: [] },
          { id: 'schema:SportsEvent', name: 'SportsEvent', description: 'Event type: Sports event.', level: 2, children: [] },
          { id: 'schema:TheaterEvent', name: 'TheaterEvent', description: 'Event type: Theater event.', level: 2, children: [] },
          { id: 'schema:VisualArtsEvent', name: 'VisualArtsEvent', description: 'Event type: Visual arts event.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:Intangible',
        name: 'Intangible',
        description: 'A utility class that serves as the umbrella for a number of intangible entities.',
        level: 1,
        children: [
          { id: 'schema:AlignmentObject', name: 'AlignmentObject', description: 'An intangible item that describes an alignment.', level: 2, children: [] },
          { id: 'schema:Audience', name: 'Audience', description: 'Intended audience for an item.', level: 2, children: [] },
          { id: 'schema:BedDetails', name: 'BedDetails', description: 'An entity holding basic details about a bed.', level: 2, children: [] },
          { id: 'schema:Brand', name: 'Brand', description: 'A brand.', level: 2, children: [] },
          { id: 'schema:BroadcastChannel', name: 'BroadcastChannel', description: 'A broadcast channel.', level: 2, children: [] },
          { id: 'schema:BroadcastFrequencySpecification', name: 'BroadcastFrequencySpecification', description: 'A broadcast frequency specification.', level: 2, children: [] },
          { id: 'schema:Class', name: 'Class', description: 'A class, also often called a \'Type\'.', level: 2, children: [] },
          { id: 'schema:ComputerLanguage', name: 'ComputerLanguage', description: 'A computer language.', level: 2, children: [] },
          { id: 'schema:DataFeed', name: 'DataFeed', description: 'A data feed.', level: 2, children: [] },
          { id: 'schema:DefinedTerm', name: 'DefinedTerm', description: 'A defined term.', level: 2, children: [] },
          { id: 'schema:Demand', name: 'Demand', description: 'A demand entity.', level: 2, children: [] },
          { id: 'schema:DigitalDocumentPermission', name: 'DigitalDocumentPermission', description: 'A permission for a digital document.', level: 2, children: [] },
          { id: 'schema:EducationalOccupationalCredential', name: 'EducationalOccupationalCredential', description: 'An educational or occupational credential.', level: 2, children: [] },
          { id: 'schema:EnergyConsumptionDetails', name: 'EnergyConsumptionDetails', description: 'Energy consumption details.', level: 2, children: [] },
          { id: 'schema:EntryPoint', name: 'EntryPoint', description: 'An entry point.', level: 2, children: [] },
          { id: 'schema:Enumeration', name: 'Enumeration', description: 'Lists or enumerations.', level: 2, children: [] },
          { id: 'schema:GameServer', name: 'GameServer', description: 'A game server.', level: 2, children: [] },
          { id: 'schema:GeospatialGeometry', name: 'GeospatialGeometry', description: 'A geospatial geometry.', level: 2, children: [] },
          { id: 'schema:Grant', name: 'Grant', description: 'A grant.', level: 2, children: [] },
          { id: 'schema:HealthInsurancePlan', name: 'HealthInsurancePlan', description: 'A health insurance plan.', level: 2, children: [] },
          { id: 'schema:HealthPlanCostSharingSpecification', name: 'HealthPlanCostSharingSpecification', description: 'A cost sharing specification for a health plan.', level: 2, children: [] },
          { id: 'schema:HealthPlanFormulary', name: 'HealthPlanFormulary', description: 'A formulary for a health plan.', level: 2, children: [] },
          { id: 'schema:HealthPlanNetwork', name: 'HealthPlanNetwork', description: 'A network for a health plan.', level: 2, children: [] },
          { id: 'schema:Invoice', name: 'Invoice', description: 'An invoice.', level: 2, children: [] },
          { id: 'schema:ItemList', name: 'ItemList', description: 'A list of items.', level: 2, children: [] },
          { id: 'schema:JobPosting', name: 'JobPosting', description: 'A listing that describes a job opening.', level: 2, children: [] },
          { id: 'schema:Language', name: 'Language', description: 'A language.', level: 2, children: [] },
          { id: 'schema:ListItem', name: 'ListItem', description: 'An item in a list.', level: 2, children: [] },
          { id: 'schema:MediaSubscription', name: 'MediaSubscription', description: 'A media subscription.', level: 2, children: [] },
          { id: 'schema:MenuItem', name: 'MenuItem', description: 'A menu item.', level: 2, children: [] },
          { id: 'schema:MerchantReturnPolicy', name: 'MerchantReturnPolicy', description: 'A merchant return policy.', level: 2, children: [] },
          { id: 'schema:Occupation', name: 'Occupation', description: 'A profession, may involve training.', level: 2, children: [] },
          { id: 'schema:Offer', name: 'Offer', description: 'An offer to transfer some rights to an item.', level: 2, children: [] },
          { id: 'schema:Order', name: 'Order', description: 'An order.', level: 2, children: [] },
          { id: 'schema:OrderItem', name: 'OrderItem', description: 'An order item.', level: 2, children: [] },
          { id: 'schema:ParcelDelivery', name: 'ParcelDelivery', description: 'The delivery of a parcel.', level: 2, children: [] },
          { id: 'schema:Permit', name: 'Permit', description: 'A permit.', level: 2, children: [] },
          { id: 'schema:ProgramMembership', name: 'ProgramMembership', description: 'A program membership.', level: 2, children: [] },
          { id: 'schema:Property', name: 'Property', description: 'A property.', level: 2, children: [] },
          { id: 'schema:PropertyValue', name: 'PropertyValue', description: 'A property value.', level: 2, children: [] },
          { id: 'schema:Quantity', name: 'Quantity', description: 'Quantities such as distance, time, mass, weight, etc.', level: 2, children: [] },
          { id: 'schema:Reservation', name: 'Reservation', description: 'A reservation.', level: 2, children: [] },
          { id: 'schema:Role', name: 'Role', description: 'A role played by a person or organization.', level: 2, children: [] },
          { id: 'schema:Seat', name: 'Seat', description: 'A seat.', level: 2, children: [] },
          { id: 'schema:Service', name: 'Service', description: 'A service provided by an organization.', level: 2, children: [] },
          { id: 'schema:ServiceChannel', name: 'ServiceChannel', description: 'A means for accessing a service.', level: 2, children: [] },
          { id: 'schema:SpeakableSpecification', name: 'SpeakableSpecification', description: 'A specification for something that can be spoken.', level: 2, children: [] },
          { id: 'schema:StructuredValue', name: 'StructuredValue', description: 'A structured value.', level: 2, children: [] },
          { id: 'schema:Ticket', name: 'Ticket', description: 'A ticket.', level: 2, children: [] },
          { id: 'schema:Trip', name: 'Trip', description: 'A trip.', level: 2, children: [] },
          { id: 'schema:VirtualLocation', name: 'VirtualLocation', description: 'A virtual location.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:Organization',
        name: 'Organization',
        description: 'An organization such as a school, NGO, corporation, club, etc.',
        level: 1,
        children: [
          { id: 'schema:Airline', name: 'Airline', description: 'An airline.', level: 2, children: [] },
          { id: 'schema:Consortium', name: 'Consortium', description: 'A consortium.', level: 2, children: [] },
          { id: 'schema:Corporation', name: 'Corporation', description: 'A business corporation.', level: 2, children: [] },
          { id: 'schema:EducationalOrganization', name: 'EducationalOrganization', description: 'An educational organization.', level: 2, children: [] },
          { id: 'schema:FundingScheme', name: 'FundingScheme', description: 'A funding scheme.', level: 2, children: [] },
          { id: 'schema:GovernmentOrganization', name: 'GovernmentOrganization', description: 'A governmental organization.', level: 2, children: [] },
          { id: 'schema:LibrarySystem', name: 'LibrarySystem', description: 'A library system.', level: 2, children: [] },
          { id: 'schema:LocalBusiness', name: 'LocalBusiness', description: 'A particular physical business or branch of an organization.', level: 2, children: [] },
          { id: 'schema:MedicalOrganization', name: 'MedicalOrganization', description: 'A medical organization.', level: 2, children: [] },
          { id: 'schema:NewsMediaOrganization', name: 'NewsMediaOrganization', description: 'A news media organization.', level: 2, children: [] },
          { id: 'schema:Ngo', name: 'Ngo', description: 'An NGO (non-governmental organization).', level: 2, children: [] },
          { id: 'schema:PerformingGroup', name: 'PerformingGroup', description: 'A performing group.', level: 2, children: [] },
          { id: 'schema:Project', name: 'Project', description: 'A project.', level: 2, children: [] },
          { id: 'schema:ResearchOrganization', name: 'ResearchOrganization', description: 'A research organization.', level: 2, children: [] },
          { id: 'schema:SportsOrganization', name: 'SportsOrganization', description: 'A sports organization.', level: 2, children: [] },
          { id: 'schema:WorkersUnion', name: 'WorkersUnion', description: 'A workers union.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:Person',
        name: 'Person',
        description: 'A person (alive, dead, undead, or fictional).',
        level: 1,
        children: []
      },
      {
        id: 'schema:Place',
        name: 'Place',
        description: 'Entities that have a somewhat fixed, physical extension.',
        level: 1,
        children: [
          { id: 'schema:Accommodation', name: 'Accommodation', description: 'An accommodation.', level: 2, children: [] },
          { id: 'schema:AdministrativeArea', name: 'AdministrativeArea', description: 'An administrative area.', level: 2, children: [] },
          { id: 'schema:CivicStructure', name: 'CivicStructure', description: 'A public structure.', level: 2, children: [] },
          { id: 'schema:Landform', name: 'Landform', description: 'A landform.', level: 2, children: [] },
          { id: 'schema:LandmarksOrHistoricalBuildings', name: 'LandmarksOrHistoricalBuildings', description: 'A landmark or historical building.', level: 2, children: [] },
          { id: 'schema:LocalBusiness', name: 'LocalBusiness', description: 'A particular physical business or branch.', level: 2, children: [] },
          { id: 'schema:Residence', name: 'Residence', description: 'A residence.', level: 2, children: [] },
          { id: 'schema:TouristAttraction', name: 'TouristAttraction', description: 'A tourist attraction.', level: 2, children: [] },
          { id: 'schema:TouristDestination', name: 'TouristDestination', description: 'A tourist destination.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:Product',
        name: 'Product',
        description: 'Any offered product or service.',
        level: 1,
        children: [
          { id: 'schema:IndividualProduct', name: 'IndividualProduct', description: 'A single, identifiable product.', level: 2, children: [] },
          { id: 'schema:ProductCollection', name: 'ProductCollection', description: 'A collection of products.', level: 2, children: [] },
          { id: 'schema:ProductGroup', name: 'ProductGroup', description: 'A product group.', level: 2, children: [] },
          { id: 'schema:ProductModel', name: 'ProductModel', description: 'A datasheet or vendor specification.', level: 2, children: [] },
          { id: 'schema:SomeProducts', name: 'SomeProducts', description: 'A placeholder for multiple similar products.', level: 2, children: [] },
          { id: 'schema:Vehicle', name: 'Vehicle', description: 'A vehicle.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:MedicalEntity',
        name: 'MedicalEntity',
        description: 'Any medical entity.',
        level: 1,
        children: [
          { id: 'schema:AnatomicalStructure', name: 'AnatomicalStructure', description: 'Any part of the human body.', level: 2, children: [] },
          { id: 'schema:AnatomicalSystem', name: 'AnatomicalSystem', description: 'An anatomical system.', level: 2, children: [] },
          { id: 'schema:ApprovedIndication', name: 'ApprovedIndication', description: 'An indication for a medical therapy.', level: 2, children: [] },
          { id: 'schema:Drug', name: 'Drug', description: 'A drug.', level: 2, children: [] },
          { id: 'schema:DrugClass', name: 'DrugClass', description: 'A drug class.', level: 2, children: [] },
          { id: 'schema:DrugCost', name: 'DrugCost', description: 'The cost of a drug.', level: 2, children: [] },
          { id: 'schema:DrugLegalStatus', name: 'DrugLegalStatus', description: 'The legal status of a drug.', level: 2, children: [] },
          { id: 'schema:DrugStrength', name: 'DrugStrength', description: 'A drug strength.', level: 2, children: [] },
          { id: 'schema:LifestyleModification', name: 'LifestyleModification', description: 'A process of care using lifestyle modification.', level: 2, children: [] },
          { id: 'schema:MedicalCause', name: 'MedicalCause', description: 'The causative agent of a medical condition.', level: 2, children: [] },
          { id: 'schema:MedicalClinic', name: 'MedicalClinic', description: 'A medical clinic.', level: 2, children: [] },
          { id: 'schema:MedicalCode', name: 'MedicalCode', description: 'A medical code.', level: 2, children: [] },
          { id: 'schema:MedicalCondition', name: 'MedicalCondition', description: 'A medical condition.', level: 2, children: [] },
          { id: 'schema:MedicalContraindication', name: 'MedicalContraindication', description: 'A contraindication for a medical therapy.', level: 2, children: [] },
          { id: 'schema:MedicalDevice', name: 'MedicalDevice', description: 'A medical device.', level: 2, children: [] },
          { id: 'schema:MedicalGuideline', name: 'MedicalGuideline', description: 'A medical guideline.', level: 2, children: [] },
          { id: 'schema:MedicalGuidelineContraindication', name: 'MedicalGuidelineContraindication', description: 'A guideline contraindication.', level: 2, children: [] },
          { id: 'schema:MedicalGuidelineRecommendation', name: 'MedicalGuidelineRecommendation', description: 'A guideline recommendation.', level: 2, children: [] },
          { id: 'schema:MedicalImagingTechnique', name: 'MedicalImagingTechnique', description: 'A medical imaging technique.', level: 2, children: [] },
          { id: 'schema:MedicalIndication', name: 'MedicalIndication', description: 'A medical indication.', level: 2, children: [] },
          { id: 'schema:MedicalIntangible', name: 'MedicalIntangible', description: 'A medical intangible.', level: 2, children: [] },
          { id: 'schema:MedicalObservationalStudy', name: 'MedicalObservationalStudy', description: 'A medical observational study.', level: 2, children: [] },
          { id: 'schema:MedicalProcedure', name: 'MedicalProcedure', description: 'A medical procedure.', level: 2, children: [] },
          { id: 'schema:MedicalRiskEstimator', name: 'MedicalRiskEstimator', description: 'A risk estimator for medical conditions.', level: 2, children: [] },
          { id: 'schema:MedicalRiskFactor', name: 'MedicalRiskFactor', description: 'A risk factor for medical conditions.', level: 2, children: [] },
          { id: 'schema:MedicalSign', name: 'MedicalSign', description: 'A medical sign.', level: 2, children: [] },
          { id: 'schema:MedicalSignOrSymptom', name: 'MedicalSignOrSymptom', description: 'A medical sign or symptom.', level: 2, children: [] },
          { id: 'schema:MedicalStudy', name: 'MedicalStudy', description: 'A medical study.', level: 2, children: [] },
          { id: 'schema:MedicalSymptom', name: 'MedicalSymptom', description: 'A medical symptom.', level: 2, children: [] },
          { id: 'schema:MedicalTest', name: 'MedicalTest', description: 'A medical test.', level: 2, children: [] },
          { id: 'schema:MedicalTestPanel', name: 'MedicalTestPanel', description: 'A medical test panel.', level: 2, children: [] },
          { id: 'schema:MedicalTherapy', name: 'MedicalTherapy', description: 'A medical therapy.', level: 2, children: [] },
          { id: 'schema:MedicalTrial', name: 'MedicalTrial', description: 'A medical trial.', level: 2, children: [] },
          { id: 'schema:MedicineSystem', name: 'MedicineSystem', description: 'A medicine system.', level: 2, children: [] },
          { id: 'schema:Midwifery', name: 'Midwifery', description: 'Midwifery.', level: 2, children: [] },
          { id: 'schema:Nursing', name: 'Nursing', description: 'Nursing.', level: 2, children: [] },
          { id: 'schema:OccupationalTherapy', name: 'OccupationalTherapy', description: 'Occupational therapy.', level: 2, children: [] },
          { id: 'schema:PalliativeProcedure', name: 'PalliativeProcedure', description: 'A palliative procedure.', level: 2, children: [] },
          { id: 'schema:PathologyTest', name: 'PathologyTest', description: 'A pathology test.', level: 2, children: [] },
          { id: 'schema:PhysicalExam', name: 'PhysicalExam', description: 'A physical exam.', level: 2, children: [] },
          { id: 'schema:PhysicalTherapy', name: 'PhysicalTherapy', description: 'Physical therapy.', level: 2, children: [] },
          { id: 'schema:PreventionIndication', name: 'PreventionIndication', description: 'An indication for preventing a medical condition.', level: 2, children: [] },
          { id: 'schema:PsychologicalTreatment', name: 'PsychologicalTreatment', description: 'A psychological treatment.', level: 2, children: [] },
          { id: 'schema:RadiationTherapy', name: 'RadiationTherapy', description: 'Radiation therapy.', level: 2, children: [] },
          { id: 'schema:Substance', name: 'Substance', description: 'Any matter of defined composition.', level: 2, children: [] },
          { id: 'schema:SuperficialAnatomy', name: 'SuperficialAnatomy', description: 'Anatomical features that can be observed by sight.', level: 2, children: [] },
          { id: 'schema:SurgicalProcedure', name: 'SurgicalProcedure', description: 'A surgical procedure.', level: 2, children: [] },
          { id: 'schema:TherapeuticProcedure', name: 'TherapeuticProcedure', description: 'A therapeutic procedure.', level: 2, children: [] },
          { id: 'schema:VitalSign', name: 'VitalSign', description: 'A vital sign.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      },
      {
        id: 'schema:BioChemEntity',
        name: 'BioChemEntity',
        description: 'Any biological or chemical entity.',
        level: 1,
        children: [
          { id: 'schema:ChemicalSubstance', name: 'ChemicalSubstance', description: 'A chemical substance.', level: 2, children: [] },
          { id: 'schema:Gene', name: 'Gene', description: 'A gene.', level: 2, children: [] },
          { id: 'schema:MolecularEntity', name: 'MolecularEntity', description: 'Any constitutionally or isotopically distinct atom, molecule, ion, etc.', level: 2, children: [] },
          { id: 'schema:Protein', name: 'Protein', description: 'A protein.', level: 2, children: [] },
          { id: 'schema:Taxon', name: 'Taxon', description: 'A taxon.', level: 2, children: [] }
        ].sort((a, b) => a.name.localeCompare(b.name))
      }
    ].sort((a, b) => a.name.localeCompare(b.name))
  }
];

async function buildSchemaHierarchy(): Promise<ProcessedEntity[]> {
  try {
    console.log('Returning comprehensive Schema.org hierarchy');
    return schemaHierarchy;
  } catch (error) {
    console.error('Error returning schema hierarchy:', error);
    throw error;
  }
}
