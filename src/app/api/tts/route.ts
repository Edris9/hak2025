import { TTSProviderFactory } from '@/infrastructure/services/ai';
import { TTS_PROVIDERS } from '@/domain/models';
import {
  withSecurity,
  SecureRequest,
  ValidatedTTSRequest,
} from '@/infrastructure/security';

/**
 * POST /api/tts
 *
 * Secure text-to-speech endpoint with:
 * - Rate limiting (20 req/min per IP)
 * - Input validation (max 5K chars text)
 * - Input sanitization
 * - Sanitized error responses
 *
 * Request body:
 * - text: The text to convert to speech (required, max 5000 chars)
 * - voice: Voice to use (optional)
 * - speed: Speech speed 0.5-2.0 (optional, defaults to 1.0)
 * - provider: Specific provider to use (optional)
 *
 * Response:
 * - JSON with base64 audio data and metadata
 */
export const POST = withSecurity<ValidatedTTSRequest>(
  {
    modality: 'text-to-speech',
    validateInput: true,
    requireAuth: false,
    timeout: 60000, // TTS may take time for longer texts
  },
  async (request: SecureRequest, body: ValidatedTTSRequest) => {
    const { text, voice, speed, provider: requestedProvider } = body;
    const { requestId } = request;

    // Get the provider
    let provider;
    if (requestedProvider) {
      provider = TTSProviderFactory.getProvider(requestedProvider);
      if (!provider.isConfigured()) {
        const config = TTS_PROVIDERS[requestedProvider];
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
      provider = TTSProviderFactory.getDefaultProvider();
    }

    // If no provider is configured, return helpful instructions
    if (!provider) {
      const allInstructions = Object.values(TTS_PROVIDERS).flatMap((config) => [
        `--- ${config.name} ---`,
        ...config.apiKeyInstructions,
        '',
      ]);

      return new Response(
        JSON.stringify({
          error: {
            code: 'NO_PROVIDER_CONFIGURED',
            message: 'No TTS provider is configured. Please add an API key for at least one provider.',
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
      // Generate speech
      const audio = await provider.generateSpeech(text, { voice, speed });

      return new Response(
        JSON.stringify({
          audio: audio.audioUrl,
          format: audio.format,
          duration: audio.duration,
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
      console.error(`[${requestId}] TTS error:`, error);

      // Return a sanitized error message
      const message = error instanceof Error ? error.message : 'Speech generation failed';

      return new Response(
        JSON.stringify({
          error: {
            code: 'GENERATION_ERROR',
            message: message.includes('API') ? 'TTS service error. Please try again.' : message,
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
