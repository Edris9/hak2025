import { ChatMessage } from '@/domain/models';
import { StreamCallbacks } from '@/domain/interfaces';
import { BaseAIProvider } from './BaseAIProvider';

/**
 * Mistral AI Provider
 *
 * This provider uses fetch with streaming to communicate with Mistral's API.
 * Mistral's API is compatible with the OpenAI format.
 *
 * @see https://docs.mistral.ai/api/
 */
export class MistralProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://api.mistral.ai/v1/chat/completions';

  constructor() {
    super('mistral', process.env.MISTRAL_API_KEY);
  }

  async sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    if (!this.apiKey) {
      callbacks.onError(new Error('Mistral API key not configured'));
      return;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: this.formatMessages(messages),
          stream: true,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Mistral API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace('data:', '').trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              callbacks.onToken(content);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      callbacks.onComplete(fullResponse);
    } catch (error) {
      callbacks.onError(
        error instanceof Error ? error : new Error('Unknown error occurred')
      );
    }
  }
}
