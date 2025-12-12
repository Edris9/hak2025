import { ImageProviderFactory } from '@/infrastructure/services/ai';
import { IMAGE_PROVIDERS } from '@/domain/models';
import {
  withSecurity,
  SecureRequest,
  ValidatedImageRequest,
  filterOutput,
} from '@/infrastructure/security';

/**
 * POST /api/image
 *
 * Secure image generation endpoint with:
 * - Rate limiting (10 req/min per IP)
 * - Input validation (max 1K chars prompt)
 * - Prompt injection protection
 * - Output filtering (sensitive data redaction)
 * - Sanitized error responses
 *
 * Request body:
 * - prompt: The image description (required, max 1000 chars)
 * - size: Image size (optional, defaults to 1024x1024)
 * - provider: Specific provider to use (optional)
 *
 * Response:
 * - JSON with image URL/data and request metadata
 */
export const POST = withSecurity<ValidatedImageRequest>(
  {
    modality: 'image-generation',
    validateInput: true,
    requireAuth: false,
    timeout: 60000, // Images may take longer to generate
  },
  async (request: SecureRequest, body: ValidatedImageRequest) => {
    const { prompt, size, provider: requestedProvider } = body;
    const { requestId } = request;

    // Get the provider
    let provider;
    if (requestedProvider) {
      provider = ImageProviderFactory.getProvider(requestedProvider);
      if (!provider.isConfigured()) {
        const config = IMAGE_PROVIDERS[requestedProvider];
        return new Response(
          JSON.stringify({
            error: {
              code: 'NO_PROVIDER_CONFIGURED',
              message: `${config.name} is not configured. Please add your API key.`,
              requestId,
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      provider = ImageProviderFactory.getDefaultProvider();
    }

    // If no provider is configured, return helpful instructions
    if (!provider) {
      const allInstructions = Object.values(IMAGE_PROVIDERS).flatMap((config) => [
        `--- ${config.name} ---`,
        ...config.apiKeyInstructions,
        '',
      ]);

      return new Response(
        JSON.stringify({
          error: {
            code: 'NO_PROVIDER_CONFIGURED',
            message: 'No image provider is configured. Please add an API key for at least one provider.',
            instructions: allInstructions,
            requestId,
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      // Generate the image
      const image = await provider.generateImage(prompt, { size });

      // Filter the revised prompt if present
      const filteredImage = {
        url: image.url,
        revisedPrompt: image.revisedPrompt ? filterOutput(image.revisedPrompt) : undefined,
      };

      return new Response(
        JSON.stringify({
          image: filteredImage,
          provider: provider.type,
          requestId,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    } catch (error) {
      // Log the error for debugging
      console.error(`[${requestId}] Image generation error:`, error);

      // Return a sanitized error message
      const message = error instanceof Error ? error.message : 'Image generation failed';

      return new Response(
        JSON.stringify({
          error: {
            code: 'GENERATION_ERROR',
            message: message.includes('API') ? 'Image generation service error. Please try again.' : message,
            requestId,
          },
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    }
  }
);
