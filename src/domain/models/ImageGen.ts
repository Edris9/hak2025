/**
 * Image Generation Domain Models
 *
 * This file defines the core data structures for the Image Generation feature.
 * It supports multiple providers (OpenAI DALL-E, Google Imagen) with a
 * plug-and-play architecture.
 */

/**
 * Supported image generation provider types
 */
export type ImageProviderType = 'openai' | 'gemini';

/**
 * Image size options
 */
export type ImageSize = '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';

/**
 * Generated image result
 */
export interface GeneratedImage {
  /** Image URL */
  url: string;
  /** Revised prompt (if model modified it) */
  revisedPrompt?: string;
}

/**
 * Image generation options
 */
export interface ImageGenOptions {
  /** Image dimensions */
  size?: ImageSize;
  /** Number of images to generate (currently only 1 supported) */
  n?: number;
}

/**
 * Configuration for an image provider including setup instructions
 */
export interface ImageProviderConfig {
  type: ImageProviderType;
  name: string;
  description: string;
  docsUrl: string;
  apiKeyEnvVar: string;
  apiKeyInstructions: string[];
  modelName: string;
}

/**
 * Provider status including configuration state
 */
export interface ImageProviderStatus extends ImageProviderConfig {
  isConfigured: boolean;
}

/**
 * Configuration for all supported image providers
 */
export const IMAGE_PROVIDERS: Record<ImageProviderType, ImageProviderConfig> = {
  openai: {
    type: 'openai',
    name: 'OpenAI DALL-E 3',
    description: 'DALL-E 3 - High quality image generation with excellent prompt understanding.',
    docsUrl: 'https://platform.openai.com/api-keys',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    modelName: 'dall-e-3',
    apiKeyInstructions: [
      'Go to https://platform.openai.com/api-keys',
      'Sign in or create an OpenAI account',
      'Click "Create new secret key"',
      'Give your key a name and click "Create secret key"',
      'Copy the key immediately (shown only once, starts with sk-...)',
      'Add to .env.local: OPENAI_API_KEY=sk-...',
    ],
  },
  gemini: {
    type: 'gemini',
    name: 'Google Imagen 3',
    description: 'Imagen 3 - Google\'s latest image generation model with photorealistic output.',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    apiKeyEnvVar: 'GEMINI_API_KEY',
    modelName: 'imagen-3.0-generate-002',
    apiKeyInstructions: [
      'Go to https://aistudio.google.com/app/apikey',
      'Sign in with your Google account',
      'Click "Create API Key"',
      'Select or create a Google Cloud project',
      'Copy the generated API key',
      'Add to .env.local: GEMINI_API_KEY=your-key-here',
    ],
  },
};

/**
 * Priority order for selecting default provider
 * First configured provider in this list will be used as default
 */
export const IMAGE_PROVIDER_PRIORITY: ImageProviderType[] = ['openai', 'gemini'];

/**
 * Helper to generate a unique image request ID
 */
export function generateImageRequestId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
