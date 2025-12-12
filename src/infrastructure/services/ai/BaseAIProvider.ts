import { AIProviderType, ChatMessage, AI_PROVIDERS } from '@/domain/models';
import { IAIProviderService, StreamCallbacks } from '@/domain/interfaces';

/**
 * Base class for AI providers
 *
 * This abstract class implements common functionality shared by all AI providers.
 * Each specific provider extends this class and implements the sendMessage method.
 *
 * @example
 * ```typescript
 * class MyProvider extends BaseAIProvider {
 *   constructor() {
 *     super('openai', process.env.OPENAI_API_KEY);
 *   }
 *
 *   async sendMessage(messages, callbacks) {
 *     // Implementation specific to this provider
 *   }
 * }
 * ```
 */
export abstract class BaseAIProvider implements IAIProviderService {
  readonly type: AIProviderType;
  readonly modelName: string;
  protected readonly apiKey: string | undefined;

  constructor(type: AIProviderType, apiKey: string | undefined) {
    this.type = type;
    this.apiKey = apiKey;
    this.modelName = AI_PROVIDERS[type].modelName;
  }

  /**
   * Check if this provider has an API key configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Send a message to the AI and stream the response
   * Must be implemented by each provider
   */
  abstract sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void>;

  /**
   * Convert internal ChatMessage format to the format expected by the AI API
   * Override in subclasses if needed
   */
  protected formatMessages(messages: ChatMessage[]): { role: string; content: string }[] {
    return messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
      content: msg.content,
    }));
  }

  /**
   * Get the provider name for display
   */
  getProviderName(): string {
    return AI_PROVIDERS[this.type].name;
  }
}
