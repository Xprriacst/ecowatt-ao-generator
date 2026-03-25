import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AIProviderType } from './types';

interface ChatProvider {
  type: AIProviderType;
  model: string;
}

export function createChatCompletion(provider: ChatProvider, apiKey: string) {
  const providerConfig = {
    openrouter: { baseUrl: 'https://openrouter.ai/api/v1' },
    groq: { baseUrl: 'https://api.groq.com/openai/v1' },
    openai: { baseUrl: 'https://api.openai.com/v1' },
    anthropic: { baseUrl: 'https://api.anthropic.com/v1' },
  }[provider.type] ?? { baseUrl: '' };

  // Anthropic uses its own SDK with a different API format
  if (provider.type === 'anthropic') {
    return async (systemPrompt: string, userMessage: string): Promise<string> => {
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: provider.model,
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });
      const block = response.content[0];
      if (block.type === 'text') return block.text;
      throw new Error('Réponse Anthropic inattendue');
    };
  }

  // OpenRouter, Groq, OpenAI all use OpenAI-compatible API
  const client = new OpenAI({
    apiKey,
    baseURL: providerConfig.baseUrl,
    defaultHeaders: provider.type === 'openrouter'
      ? { 'HTTP-Referer': 'https://generateur-memoire-ao.app', 'X-Title': 'Générateur Mémoire AO' }
      : undefined,
  });

  return async (systemPrompt: string, userMessage: string): Promise<string> => {
    const response = await client.chat.completions.create({
      model: provider.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 8000,
      temperature: 0.3,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Réponse vide du modèle');
    return content;
  };
}
