import { ChatMessage } from '@/domain/models';
import { StreamCallbacks } from '@/domain/interfaces';
import { BaseAIProvider } from './BaseAIProvider';

/**
 * Anthropic Claude Provider
 *
 * This provider uses fetch with streaming to communicate with Anthropic's API.
 * Claude uses a slightly different message format and streaming protocol.
 *
 * @see https://docs.anthropic.com/en/api/messages
 */
export class AnthropicProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    super('anthropic', process.env.ANTHROPIC_API_KEY);
  }

  async sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    if (!this.apiKey) {
      callbacks.onError(new Error('Anthropic API key not configured'));
      return;
    }

    try {
      // Extract system message if present
      let systemPrompt: string | undefined;
      const conversationMessages = messages.filter((msg) => {
        if (msg.role === 'system') {
          systemPrompt = msg.content;
          return false;
        }
        return true;
      });

      // Format messages for Anthropic API
      const formattedMessages = conversationMessages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const requestBody: Record<string, unknown> = {
        model: this.modelName,
        messages: formattedMessages,
        stream: true,
        max_tokens: 2048,
      };

      if (systemPrompt) {
        requestBody.system = systemPrompt;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
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
        const lines = chunk.split('\n').filter((line) => line.trim().length > 0);

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.replace('data:', '').trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // Handle content_block_delta events
              if (parsed.type === 'content_block_delta') {
                const text = parsed.delta?.text;
                if (text) {
                  fullResponse += text;
                  callbacks.onToken(text);
                }
              }
            } catch {
              // Skip malformed JSON
            }
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
