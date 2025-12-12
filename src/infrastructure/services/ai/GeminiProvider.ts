import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '@/domain/models';
import { StreamCallbacks } from '@/domain/interfaces';
import { BaseAIProvider } from './BaseAIProvider';

/**
 * Google Gemini AI Provider
 *
 * This provider uses the Google Generative AI SDK to communicate with Gemini models.
 * It supports streaming responses for real-time token display.
 *
 * @see https://ai.google.dev/gemini-api/docs
 */
export class GeminiProvider extends BaseAIProvider {
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    super('gemini', process.env.GEMINI_API_KEY);
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    if (!this.client || !this.apiKey) {
      callbacks.onError(new Error('Gemini API key not configured'));
      return;
    }

    try {
      const model = this.client.getGenerativeModel({ model: this.modelName });

      // Convert messages to Gemini format
      // Gemini uses 'user' and 'model' roles
      const history = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];

      // Start a chat session with history
      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 2048,
        },
      });

      // Send message and stream response
      const result = await chat.sendMessageStream(lastMessage.content);

      let fullResponse = '';

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          callbacks.onToken(text);
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
