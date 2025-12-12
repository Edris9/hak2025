import { NextResponse } from 'next/server';
import { AIProviderFactory } from '@/infrastructure/services/ai';
import { ProvidersResponse } from '@/application/dto';

/**
 * GET /api/chat/providers
 *
 * Get a list of all available AI providers and their configuration status.
 * This endpoint is used to populate the provider selector and show setup instructions.
 *
 * Response:
 * - providers: Array of provider configurations with isConfigured flag
 * - defaultProvider: The type of the default provider (or null)
 * - hasAnyConfigured: Whether any provider has an API key configured
 */
export async function GET() {
  try {
    const providers = AIProviderFactory.getConfiguredProviders();
    const defaultProvider = AIProviderFactory.getDefaultProviderType();
    const hasAnyConfigured = AIProviderFactory.hasAnyConfigured();

    const response: ProvidersResponse = {
      providers,
      defaultProvider,
      hasAnyConfigured,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Providers API error:', error);
    return NextResponse.json(
      { error: 'Failed to get providers' },
      { status: 500 }
    );
  }
}
