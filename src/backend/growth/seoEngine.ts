import { llmService } from '../ai/llmService.js';
import { logger } from '../logging/logger.js';

export const seoEngine = {
  /**
   * Generates SEO keyword clusters based on a primary niche.
   */
  async generateKeywordClusters(niche: string) {
    try {
      logger.info('SEOEngine', `Generating keyword clusters for ${niche}`);

      const prompt = `Act as an Expert SEO Strategist.
Create a keyword cluster strategy for the niche: "${niche}".
Provide 3 main pillars (clusters). For each pillar, list 5 long-tail keywords.
Format as JSON: { "clusters": [ { "pillar": "Name", "keywords": ["kw1", "kw2"] } ] }`;

      const { text, error } = await llmService.generateText(prompt, { temperature: 0.3 });
      if (error || !text) throw new Error(error || 'Failed to generate keywords');

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return { data: jsonMatch ? JSON.parse(jsonMatch[0]) : null, error: null };
    } catch (error) {
      logger.error('SEOEngine', 'Failed to generate clusters', error);
      return { data: null, error: String(error) };
    }
  },

  /**
   * Generates a fully optimized SEO blog post.
   */
  async generateBlogPost(topic: string, keywords: string[]) {
    try {
      logger.info('SEOEngine', `Generating blog post for topic: ${topic}`);

      const prompt = `Write a comprehensive, highly engaging, and SEO-optimized blog post about "${topic}".
Naturally incorporate these keywords: ${keywords.join(', ')}.
Use Markdown formatting. Include a catchy H1, structured H2/H3 tags, and a strong conclusion.`;

      const { text, error } = await llmService.generateText(prompt, { temperature: 0.6 });
      if (error) throw new Error(error);

      return { data: text, error: null };
    } catch (error) {
      logger.error('SEOEngine', 'Failed to generate blog post', error);
      return { data: null, error: String(error) };
    }
  }
};
