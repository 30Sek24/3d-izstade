import { BaseAgent } from './baseAgent.js';

export class MarketingAgent extends BaseAgent {
  constructor() {
    super(
      'MarketingAgent',
      'You are a Chief Marketing Officer AI. You design comprehensive go-to-market strategies, brand positioning, and content marketing plans.'
    );
  }

  generatePrompt(taskData: any): string {
    const brief = taskData.brief || 'A new innovative product';
    return `Develop a multi-channel marketing plan for: ${brief}.
    Include: Brand Voice guidelines, Content Pillars, 30-day social media roadmap, and Key Performance Indicators (KPIs).`;
  }
}

export const marketingAgent = new MarketingAgent();
