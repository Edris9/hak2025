/**
 * Image Provider Factory
 *
 * Factory for creating and managing image generation provider instances.
 * Supports multiple providers with lazy initialization and caching.
 */

import { IImageProviderService } from '@/domain/interfaces';
import {
  ImageProviderType,
  ImageProviderStatus,
  IMAGE_PROVIDERS,
  IMAGE_PROVIDER_PRIORITY,
} from '@/domain/models';
import { OpenAIImageProvider } from './OpenAIImageProvider';
import { GeminiImageProvider } from './GeminiImageProvider';

/**
 * Factory for image generation providers
 */
export class ImageProviderFactory {
  private static providers: Map<ImageProviderType, IImageProviderService> = new Map();

  /**
   * Get a specific provider instance
   */
  static getProvider(type: ImageProviderType): IImageProviderService {
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
  static getDefaultProvider(): IImageProviderService | null {
    // Check for forced provider via environment variable
    const forcedProvider = process.env.IMAGE_PROVIDER as ImageProviderType | undefined;
    if (forcedProvider && IMAGE_PROVIDER_PRIORITY.includes(forcedProvider)) {
      const provider = this.getProvider(forcedProvider);
      if (provider.isConfigured()) {
        return provider;
      }
    }

    // Find first configured provider by priority
    for (const type of IMAGE_PROVIDER_PRIORITY) {
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
  static getConfiguredProviders(): ImageProviderStatus[] {
    return IMAGE_PROVIDER_PRIORITY.map((type) => {
      const provider = this.getProvider(type);
      const config = IMAGE_PROVIDERS[type];
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
    return IMAGE_PROVIDER_PRIORITY.some((type) => {
      const provider = this.getProvider(type);
      return provider.isConfigured();
    });
  }

  /**
   * Get the default provider type if any is configured
   */
  static getDefaultProviderType(): ImageProviderType | null {
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
  private static createProvider(type: ImageProviderType): IImageProviderService {
    switch (type) {
      case 'openai':
        return new OpenAIImageProvider();
      case 'gemini':
        return new GeminiImageProvider();
      default:
        throw new Error(`Unknown image provider type: ${type}`);
    }
  }
}
