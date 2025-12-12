import { NextResponse } from 'next/server';
import { TTSProviderFactory } from '@/infrastructure/services/ai';
import { TTSProvidersResponse } from '@/application/dto';

/**
 * GET /api/tts/providers
 *
 * Returns the list of available TTS providers,
 * their configuration status, and available voices.
 *
 * Response:
 * - providers: Array of provider configs with isConfigured flag and voices
 * - defaultProvider: The default provider type (if any configured)
 * - hasAnyConfigured: Whether any provider is available
 */
export async function GET() {
  const providers = TTSProviderFactory.getConfiguredProviders();
  const defaultProvider = TTSProviderFactory.getDefaultProviderType();
  const hasAnyConfigured = TTSProviderFactory.hasAnyConfigured();

  const response: TTSProvidersResponse = {
    providers,
    defaultProvider,
    hasAnyConfigured,
  };

  return NextResponse.json(response);
}
