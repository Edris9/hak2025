import { AIProviderType, ChatMessage } from '../models/Chat';

/**
 * Callbacks for streaming responses from AI providers
 *
 * These callbacks allow real-time updates as the AI generates its response,
 * enabling a more interactive chat experience.
 */
export interface StreamCallbacks {
  /**
   * Called for each token/chunk received from the AI
   * @param token - The text chunk received
   */
  onToken: (token: string) => void;

  /**
   * Called when the AI has finished generating its response
   * @param fullResponse - The complete response text
   */
  onComplete: (fullResponse: string) => void;

  /**
   * Called if an error occurs during generation
   * @param error - The error that occurred
   */
  onError: (error: Error) => void;
}

/**
 * Interface for AI provider services
 *
 * This interface allows for plug-and-play AI providers.
 * Each provider (Gemini, OpenAI, Mistral, Anthropic) implements this interface,
 * enabling the chat system to work with any provider transparently.
 *
 * @example
 * ```typescript
 * const provider = AIProviderFactory.getProvider('openai');
 * if (provider.isConfigured()) {
 *   await provider.sendMessage(messages, {
 *     onToken: (token) => console.log(token),
 *     onComplete: (full) => console.log('Done:', full),
 *     onError: (err) => console.error(err),
 *   });
 * }
 * ```
 */
export interface IAIProviderService {
  /**
   * The type of this provider
   */
  readonly type: AIProviderType;

  /**
   * The model name used by this provider
   */
  readonly modelName: string;

  /**
   * Check if this provider is configured (has API key)
   * @returns true if the provider has a valid API key configured
   */
  isConfigured(): boolean;

  /**
   * Send a message to the AI and stream the response
   *
   * @param messages - The conversation history
   * @param callbacks - Callbacks for streaming response
   * @returns Promise that resolves when the response is complete
   */
  sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void>;
}
