import { logger } from '../logging/logger';
import OpenAI from 'openai';

// Assuming OpenAI package is available based on context, otherwise gracefully fail
let openaiClient: OpenAI | null = null;
try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'dummy_key';
  openaiClient = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
} catch (e) {
  logger.warn('LLMService', 'Failed to initialize OpenAI client.', e);
}

export interface GenerateTextOptions {
  provider?: 'openai' | 'gemini';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export const llmService = {
  /**
   * Generates text using the specified LLM provider with timeout and error protection.
   */
  async generateText(prompt: string, options: GenerateTextOptions = {}): Promise<{ text: string | null; error: any }> {
    const provider = options.provider || 'openai';
    const timeoutMs = options.timeoutMs || 30000;

    try {
      logger.info('LLMService', `Generating text via ${provider}`, { promptLength: prompt.length });

      // Implement timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM request timed out')), timeoutMs)
      );

      const requestPromise = provider === 'openai' 
        ? this._callOpenAI(prompt, options)
        : this._callGemini(prompt, options);

      const result = await Promise.race([requestPromise, timeoutPromise]) as string;

      return { text: result, error: null };
    } catch (error) {
      logger.error('LLMService', `Error in generateText (${provider})`, error);
      return { text: null, error: error instanceof Error ? error.message : String(error) };
    }
  },

  async _callOpenAI(prompt: string, options: GenerateTextOptions): Promise<string> {
    if (!openaiClient) throw new Error('OpenAI client is not initialized.');
    
    const response = await openaiClient.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  },

  async _callGemini(prompt: string, options: GenerateTextOptions): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is missing.');

    const model = options.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
           temperature: options.temperature ?? 0.7,
           maxOutputTokens: options.maxTokens
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
};
