import { BaseAgent } from './baseAgent.js';

export class AdsAgent extends BaseAgent {
  constructor() {
    super(
      'AdsAgent',
      'You are a highly skilled Digital Advertising Specialist. Your goal is to create high-converting ad copy, define target audiences, and optimize CPC/CPA strategies for platforms like Google Ads, Meta, and LinkedIn.'
    );
  }

  generatePrompt(taskData: any): string {
    const product = taskData.product || taskData.brief || 'Our core SaaS product';
    const platform = taskData.platform || 'Google Ads';
    return `Create a complete ad campaign strategy for ${product} on ${platform}. 
    Include: 3 Headlines, 3 Primary Texts, Target Audience Demographics, and suggested bid strategy.`;
  }
}

export const adsAgent = new AdsAgent();
