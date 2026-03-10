import { BaseAgent } from './baseAgent.js';
import { leadEngine } from '../backend/leads/engine/leadEngine.js';

export class LeadAgent extends BaseAgent {
  constructor() {
    super(
      'LeadAgent',
      'You are an expert Lead Generation Specialist. You identify target industries, structure search queries, and analyze prospect viability.'
    );
  }

  generatePrompt(taskData: any): string {
    const niche = taskData.niche || taskData.brief || 'B2B Software';
    return `Analyze the target audience for the niche: ${niche}. 
    Provide the top 3 job titles to target, 3 key pain points, and specific search keywords to find them on Google and LinkedIn.`;
  }

  // Override to include actual scraping logic
  async executeTask(taskId: string, agentId: string, taskData: any): Promise<any> {
    const baseResult = await super.executeTask(taskId, agentId, taskData);
    
    // If real scraping is requested
    if (baseResult && taskData.run_scraper) {
      const industry = taskData.niche || 'Technology';
      const location = taskData.location || 'London';
      await leadEngine.processAndStoreLeads(industry, location, taskData.user_id);
      baseResult.scraper_executed = true;
      await this.storeResults(taskId, baseResult);
    }
    
    return baseResult;
  }
}

export const leadAgent = new LeadAgent();
