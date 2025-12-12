/**
 * OpenAI DALL-E Image Provider
 *
 * Implements image generation using OpenAI's DALL-E 3 model.
 */

import { BaseImageProvider } from './BaseImageProvider';
import { ImageProviderType, GeneratedImage, ImageGenOptions } from '@/domain/models';

/**
 * OpenAI DALL-E 3 image provider
 */
export class OpenAIImageProvider extends BaseImageProvider {
  readonly type: ImageProviderType = 'openai';
  readonly modelName = 'dall-e-3';

  constructor() {
    super('OPENAI_API_KEY');
  }

  /**
   * Generate an image using DALL-E 3
   */
  async generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage> {
    const apiKey = this.getApiKey();
    const size = this.normalizeOpenAISize(options?.size);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.modelName,
        prompt,
        n: 1,
        size,
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const imageData = data.data?.[0];

    if (!imageData?.url) {
      throw new Error('No image URL in response');
    }

    return {
      url: imageData.url,
      revisedPrompt: imageData.revised_prompt,
    };
  }

  /**
   * Normalize size to DALL-E 3 supported sizes
   * DALL-E 3 supports: 1024x1024, 1792x1024, 1024x1792
   */
  private normalizeOpenAISize(size?: string): string {
    const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
    if (size && validSizes.includes(size)) {
      return size;
    }
    // Map smaller sizes to 1024x1024
    return '1024x1024';
  }
}
