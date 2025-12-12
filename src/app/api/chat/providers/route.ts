import { NextResponse } from 'next/server';
import { AIProviderFactory } from '@/infrastructure/services/ai';
import { ProvidersResponse } from '@/application/dto';
import { generateRequestId, sanitizeError, createErrorResponse } from '@/infrastructure/security';

/**
 * GET /api/chat/providers
 *
 * Get a list of all available AI providers and their configuration status.
 * This endpoint is used to populate the provider selector and show setup instructions.
 *
 * Rate limited via Edge middleware (30 req/min per IP)
 *
 * Response:
 * - providers: Array of provider configurations with isConfigured flag
 * - defaultProvider: The type of the default provider (or null)
 * - hasAnyConfigured: Whether any provider has an API key configured
 * - X-Request-ID header for tracking
 */
export async function GET() {
  const requestId = generateRequestId();

  try {
    const providers = AIProviderFactory.getConfiguredProviders();
    const defaultProvider = AIProviderFactory.getDefaultProviderType();
    const hasAnyConfigured = AIProviderFactory.hasAnyConfigured();

    const response: ProvidersResponse = {
      providers,
      defaultProvider,
      hasAnyConfigured,
    };

    return NextResponse.json(response, {
      headers: {
        'X-Request-ID': requestId,
      },
    });
  } catch (error) {
    // Sanitize error - never expose internal details
    const sanitized = sanitizeError(error, requestId);
    return NextResponse.json(
      createErrorResponse(sanitized, requestId),
      {
        status: 500,
        headers: {
          'X-Request-ID': requestId,
        },
      }
    );
  }
}
