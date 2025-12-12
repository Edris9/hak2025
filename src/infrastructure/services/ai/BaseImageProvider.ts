/**
 * Base Image Provider
 *
 * Abstract base class for all image generation providers.
 * Provides common functionality for API key validation and error handling.
 */

import { IImageProviderService } from '@/domain/interfaces';
import { ImageProviderType, GeneratedImage, ImageGenOptions } from '@/domain/models';

/**
 * Abstract base class for image providers
 */
export abstract class BaseImageProvider implements IImageProviderService {
  abstract readonly type: ImageProviderType;
  abstract readonly modelName: string;

  protected apiKey: string | undefined;
  protected apiKeyEnvVar: string;

  constructor(apiKeyEnvVar: string) {
    this.apiKeyEnvVar = apiKeyEnvVar;
    this.apiKey = process.env[apiKeyEnvVar];
  }

  /**
   * Check if this provider is configured (has API key)
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Generate an image from a prompt
   * Must be implemented by each provider
   */
  abstract generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage>;

  /**
   * Get the API key, throwing if not configured
   */
  protected getApiKey(): string {
    if (!this.apiKey) {
      throw new Error(`${this.apiKeyEnvVar} is not configured`);
    }
    return this.apiKey;
  }

  /**
   * Normalize size to provider-specific format if needed
   */
  protected normalizeSize(size?: string): string {
    return size || '1024x1024';
  }
}
