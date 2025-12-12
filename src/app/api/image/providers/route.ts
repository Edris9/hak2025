import { NextResponse } from 'next/server';
import { ImageProviderFactory } from '@/infrastructure/services/ai';
import { ImageProvidersResponse } from '@/application/dto';

/**
 * GET /api/image/providers
 *
 * Returns the list of available image generation providers
 * and their configuration status.
 *
 * Response:
 * - providers: Array of provider configs with isConfigured flag
 * - defaultProvider: The default provider type (if any configured)
 * - hasAnyConfigured: Whether any provider is available
 */
export async function GET() {
  const providers = ImageProviderFactory.getConfiguredProviders();
  const defaultProvider = ImageProviderFactory.getDefaultProviderType();
  const hasAnyConfigured = ImageProviderFactory.hasAnyConfigured();

  const response: ImageProvidersResponse = {
    providers,
    defaultProvider,
    hasAnyConfigured,
  };

  return NextResponse.json(response);
}
