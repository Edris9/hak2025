import {
  AIProviderType,
  AIProviderStatus,
  AI_PROVIDERS,
  PROVIDER_PRIORITY,
} from '@/domain/models';
import { IAIProviderService } from '@/domain/interfaces';
import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { MistralProvider } from './MistralProvider';
import { AnthropicProvider } from './AnthropicProvider';

/**
 * Factory for creating and managing AI providers
 *
 * This factory implements the Factory pattern to provide a clean way to:
 * - Get specific providers by type
 * - Get the default (first configured) provider
 * - List all providers with their configuration status
 *
 * @example
 * ```typescript
 * // Get a specific provider
 * const openai = AIProviderFactory.getProvider('openai');
 *
 * // Get the default provider (first configured one)
 * const defaultProvider = AIProviderFactory.getDefaultProvider();
 *
 * // Check if any provider is configured
 * if (AIProviderFactory.hasAnyConfigured()) {
 *   // At least one provider has an API key
 * }
 * ```
 */
export class AIProviderFactory {
  private static providers: Map<AIProviderType, IAIProviderService> = new Map();

  /**
   * Get a specific provider by type
   * Creates the provider lazily if not already instantiated
   */
  static getProvider(type: AIProviderType): IAIProviderService {
    if (!this.providers.has(type)) {
      const provider = this.createProvider(type);
      this.providers.set(type, provider);
    }
    return this.providers.get(type)!;
  }

  /**
   * Get the default provider (first configured provider by priority)
   * Returns null if no provider is configured
   */
  static getDefaultProvider(): IAIProviderService | null {
    // Check for forced provider via environment variable
    const forcedProvider = process.env.AI_PROVIDER as AIProviderType | undefined;
    if (forcedProvider && PROVIDER_PRIORITY.includes(forcedProvider)) {
      const provider = this.getProvider(forcedProvider);
      if (provider.isConfigured()) {
        return provider;
      }
    }

    // Otherwise, return first configured provider by priority
    for (const type of PROVIDER_PRIORITY) {
      const provider = this.getProvider(type);
      if (provider.isConfigured()) {
        return provider;
      }
    }

    return null;
  }

  /**
   * Get all providers with their configuration status
   */
  static getConfiguredProviders(): AIProviderStatus[] {
    return PROVIDER_PRIORITY.map((type) => {
      const provider = this.getProvider(type);
      const config = AI_PROVIDERS[type];
      return {
        ...config,
        isConfigured: provider.isConfigured(),
      };
    });
  }

  /**
   * Check if any provider is configured
   */
  static hasAnyConfigured(): boolean {
    return PROVIDER_PRIORITY.some((type) => {
      const provider = this.getProvider(type);
      return provider.isConfigured();
    });
  }

  /**
   * Get the default provider type (or null if none configured)
   */
  static getDefaultProviderType(): AIProviderType | null {
    const provider = this.getDefaultProvider();
    return provider?.type || null;
  }

  /**
   * Create a provider instance by type
   */
  private static createProvider(type: AIProviderType): IAIProviderService {
    switch (type) {
      case 'gemini':
        return new GeminiProvider();
      case 'openai':
        return new OpenAIProvider();
      case 'mistral':
        return new MistralProvider();
      case 'anthropic':
        return new AnthropicProvider();
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }

  /**
   * Reset cached providers (useful for testing)
   */
  static reset(): void {
    this.providers.clear();
  }
}
