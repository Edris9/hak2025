/**
 * Image Provider Service Interface
 *
 * Defines the contract for image generation provider implementations.
 * All image providers must implement this interface.
 */

import { ImageProviderType, GeneratedImage, ImageGenOptions } from '../models/ImageGen';

/**
 * Interface for image generation provider implementations
 */
export interface IImageProviderService {
  /**
   * The provider type identifier
   */
  readonly type: ImageProviderType;

  /**
   * The model name used by this provider
   */
  readonly modelName: string;

  /**
   * Check if this provider is configured (has API key)
   */
  isConfigured(): boolean;

  /**
   * Generate an image from a text prompt
   *
   * @param prompt - The text description of the image to generate
   * @param options - Optional generation parameters (size, etc.)
   * @returns Promise resolving to the generated image data
   */
  generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage>;
}
