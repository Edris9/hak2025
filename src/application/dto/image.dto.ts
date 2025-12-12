/**
 * Image Generation DTOs
 *
 * Data Transfer Objects for the image generation API endpoints.
 */

import {
  ImageProviderType,
  ImageProviderStatus,
  GeneratedImage,
  ImageSize,
} from '@/domain/models';

/**
 * Request to generate an image
 */
export interface GenerateImageRequest {
  /** Text prompt describing the image */
  prompt: string;
  /** Image size (optional, defaults to 1024x1024) */
  size?: ImageSize;
  /** Specific provider to use (optional) */
  provider?: ImageProviderType;
}

/**
 * Response from image generation
 */
export interface GenerateImageResponse {
  /** Generated image data */
  image: GeneratedImage;
  /** Provider that generated the image */
  provider: ImageProviderType;
  /** Request ID for tracking */
  requestId: string;
}

/**
 * Error response from image generation
 */
export interface ImageErrorResponse {
  error: {
    code: string;
    message: string;
    instructions?: string[];
    requestId: string;
  };
}

/**
 * Response from providers endpoint
 */
export interface ImageProvidersResponse {
  /** List of all providers with their status */
  providers: ImageProviderStatus[];
  /** The default provider type (if any configured) */
  defaultProvider: ImageProviderType | null;
  /** Whether any provider is configured */
  hasAnyConfigured: boolean;
}
