/**
 * TTS Provider Factory
 *
 * Factory for creating and managing TTS provider instances.
 * Supports multiple providers with lazy initialization and caching.
 */

import { ITTSProviderService } from '@/domain/interfaces';
import {
  TTSProviderType,
  TTSProviderStatus,
  TTS_PROVIDERS,
  TTS_PROVIDER_PRIORITY,
} from '@/domain/models';
import { OpenAITTSProvider } from './OpenAITTSProvider';
import { ElevenLabsTTSProvider } from './ElevenLabsTTSProvider';

/**
 * Factory for TTS providers
 */
export class TTSProviderFactory {
  private static providers: Map<TTSProviderType, ITTSProviderService> = new Map();

  /**
   * Get a specific provider instance
   */
  static getProvider(type: TTSProviderType): ITTSProviderService {
    if (!this.providers.has(type)) {
      const provider = this.createProvider(type);
      this.providers.set(type, provider);
    }
    return this.providers.get(type)!;
  }

  /**
   * Get the default configured provider
   * Returns null if no provider is configured
   */
  static getDefaultProvider(): ITTSProviderService | null {
    // Check for forced provider via environment variable
    const forcedProvider = process.env.TTS_PROVIDER as TTSProviderType | undefined;
    if (forcedProvider && TTS_PROVIDER_PRIORITY.includes(forcedProvider)) {
      const provider = this.getProvider(forcedProvider);
      if (provider.isConfigured()) {
        return provider;
      }
    }

    // Find first configured provider by priority
    for (const type of TTS_PROVIDER_PRIORITY) {
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
  static getConfiguredProviders(): TTSProviderStatus[] {
    return TTS_PROVIDER_PRIORITY.map((type) => {
      const provider = this.getProvider(type);
      const config = TTS_PROVIDERS[type];
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
    return TTS_PROVIDER_PRIORITY.some((type) => {
      const provider = this.getProvider(type);
      return provider.isConfigured();
    });
  }

  /**
   * Get the default provider type if any is configured
   */
  static getDefaultProviderType(): TTSProviderType | null {
    const provider = this.getDefaultProvider();
    return provider?.type ?? null;
  }

  /**
   * Reset the factory (useful for testing)
   */
  static reset(): void {
    this.providers.clear();
  }

  /**
   * Create a new provider instance
   */
  private static createProvider(type: TTSProviderType): ITTSProviderService {
    switch (type) {
      case 'openai':
        return new OpenAITTSProvider();
      case 'elevenlabs':
        return new ElevenLabsTTSProvider();
      default:
        throw new Error(`Unknown TTS provider type: ${type}`);
    }
  }
}
