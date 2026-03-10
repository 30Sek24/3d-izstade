import { logger } from '../../logging/logger.js';
import { serpApiHelper } from '../../leads/sources/serpApiHelper.js';
import { websiteScraper } from '../../dataSources/websiteScraper.js';

export interface AgentTool {
  name: string;
  description: string;
  execute: (args: any) => Promise<any>;
}

export const agentTools: Record<string, AgentTool> = {
  search_web: {
    name: 'search_web',
    description: 'Searches the web for information using SerpAPI. Arguments: { "query": "search query" }',
    execute: async (args: { query: string }) => {
      logger.info('AgentTools', `Executing search_web for: ${args.query}`);
      const result = await serpApiHelper.search({ q: args.query, engine: 'google' });
      return result.data?.organic_results?.slice(0, 5) || 'No results found.';
    }
  },
  scrape_website: {
    name: 'scrape_website',
    description: 'Scrapes text content from a provided URL. Arguments: { "url": "https://..." }',
    execute: async (args: { url: string }) => {
      logger.info('AgentTools', `Executing scrape_website for: ${args.url}`);
      const result = await websiteScraper.scrapeText(args.url);
      return result.data || 'Failed to scrape website.';
    }
  },
  save_to_memory: {
    name: 'save_to_memory',
    description: 'Saves important extracted information to long-term memory. Arguments: { "context": "Data to remember" }',
    execute: async (args: { context: string }) => {
      // Memory saving is handled at the loop level, this tool just passes the context back
      logger.info('AgentTools', `Executing save_to_memory`);
      return { success: true, saved_context: args.context };
    }
  }
};
