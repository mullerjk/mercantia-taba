#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';

interface ShadcnComponent {
  name: string;
  description: string;
  category: string;
  code: string;
}

class ShadcnUiServer {
  private server: Server;
  private components: ShadcnComponent[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'shadcn-ui-mcp',
        version: '0.1.0',
      }
    );

    this.loadComponents();
    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private loadComponents() {
    // Load components from the project's ui folder
    const uiPath = path.join(process.cwd(), 'app', 'src', 'components', 'ui');

    if (fs.existsSync(uiPath)) {
      const files = fs.readdirSync(uiPath).filter(file => file.endsWith('.tsx'));

      for (const file of files) {
        try {
          const filePath = path.join(uiPath, file);
          const code = fs.readFileSync(filePath, 'utf-8');
          const name = file.replace('.tsx', '');

          // Extract description from comments or generate based on name
          const description = this.extractDescription(code) || `shadcn/ui ${name} component`;

          this.components.push({
            name,
            description,
            category: 'ui',
            code
          });
        } catch (error) {
          console.error(`Error loading component ${file}:`, error);
        }
      }
    }
  }

  private extractDescription(code: string): string | null {
    // Try to extract description from JSDoc comments
    const jsdocMatch = code.match(/\/\*\*\s*\n\s*\*\s*([^*\n]+)/);
    if (jsdocMatch) {
      return jsdocMatch[1].trim();
    }

    // Try to extract from single line comments
    const commentMatch = code.match(/\/\/\s*(.+)/);
    if (commentMatch) {
      return commentMatch[1].trim();
    }

    return null;
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_components',
          description: 'List all available shadcn/ui components',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          },
        },
        {
          name: 'get_component',
          description: 'Get the implementation code for a specific shadcn/ui component',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the component (without .tsx extension)',
              },
            },
            required: ['name']
          },
        },
        {
          name: 'search_components',
          description: 'Search for components by name or description',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
            },
            required: ['query']
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'list_components':
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  this.components.map(c => ({
                    name: c.name,
                    description: c.description,
                    category: c.category
                  })),
                  null,
                  2
                ),
              },
            ],
          };

        case 'get_component':
          if (!args || typeof args.name !== 'string') {
            throw new McpError(
              ErrorCode.InvalidParams,
              'Component name is required'
            );
          }

          const component = this.components.find(c => c.name === args.name);
          if (!component) {
            throw new McpError(
              ErrorCode.InvalidParams,
              `Component '${args.name}' not found`
            );
          }

          return {
            content: [
              {
                type: 'text',
                text: component.code,
              },
            ],
          };

        case 'search_components':
          if (!args || typeof args.query !== 'string') {
            throw new McpError(
              ErrorCode.InvalidParams,
              'Search query is required'
            );
          }

          const query = args.query.toLowerCase();
          const results = this.components.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query)
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  results.map(c => ({
                    name: c.name,
                    description: c.description,
                    category: c.category
                  })),
                  null,
                  2
                ),
              },
            ],
          };

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`shadcn/ui MCP server running with ${this.components.length} components`);
  }
}

const server = new ShadcnUiServer();
server.run().catch(console.error);
