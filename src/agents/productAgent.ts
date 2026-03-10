import { BaseAgent } from './baseAgent.js';

export class ProductAgent extends BaseAgent {
  constructor() {
    super(
      'ProductAgent',
      'You are a Product Manager AI. You help define product features, user stories, pricing strategies, and product-market fit.'
    );
  }

  generatePrompt(taskData: any): string {
    const idea = taskData.brief || taskData.idea || 'A vague startup idea';
    return `Analyze this product idea: "${idea}".
    Provide a feature roadmap (MVP vs v2.0), target user personas, and a competitive pricing strategy framework.`;
  }
}

export const productAgent = new ProductAgent();
