/**
 * Google Imagen Image Provider
 *
 * Implements image generation using Google's Imagen 3 model via the Gemini API.
 */

import { BaseImageProvider } from './BaseImageProvider';
import { ImageProviderType, GeneratedImage, ImageGenOptions } from '@/domain/models';

/**
 * Google Imagen 3 image provider
 */
export class GeminiImageProvider extends BaseImageProvider {
  readonly type: ImageProviderType = 'gemini';
  readonly modelName = 'imagen-3.0-generate-002';

  constructor() {
    super('GEMINI_API_KEY');
  }

  /**
   * Generate an image using Imagen 3
   */
  async generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage> {
    const apiKey = this.getApiKey();
    const aspectRatio = this.sizeToAspectRatio(options?.size);

    // Imagen 3 uses the generativelanguage API with header-based auth
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:predict`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Imagen API error response:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.message || `Imagen API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const prediction = data.predictions?.[0];

    if (!prediction?.bytesBase64Encoded) {
      console.error('Unexpected Imagen response format:', JSON.stringify(data, null, 2));
      throw new Error('No image data in response');
    }

    // Convert base64 to data URL
    const dataUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;

    return {
      url: dataUrl,
      revisedPrompt: undefined, // Imagen doesn't return revised prompts
    };
  }

  /**
   * Convert size to Imagen aspect ratio
   * Imagen 3 supports: 1:1, 3:4, 4:3, 9:16, 16:9
   */
  private sizeToAspectRatio(size?: string): string {
    switch (size) {
      case '1024x1792':
        return '9:16';
      case '1792x1024':
        return '16:9';
      case '256x256':
      case '512x512':
      case '1024x1024':
      default:
        return '1:1';
    }
  }
}
