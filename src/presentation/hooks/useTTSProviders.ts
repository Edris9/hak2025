'use client';

/**
 * useTTSProviders Hook
 *
 * Fetches available TTS providers from the API and manages provider state.
 */

import { useEffect, useCallback } from 'react';
import { useTTSContext } from '../providers/TTSProvider';
import { TTSProvidersResponse } from '@/application/dto/tts.dto';

interface UseTTSProvidersReturn {
  /** Whether providers are being loaded */
  isLoading: boolean;
  /** Whether any provider is configured */
  hasAnyConfigured: boolean;
  /** Refetch providers */
  refetch: () => Promise<void>;
}

export function useTTSProviders(): UseTTSProvidersReturn {
  const {
    availableProviders,
    setAvailableProviders,
    currentProvider,
    setCurrentProvider,
    setSelectedVoice,
    isLoading,
    setIsLoading,
    setError,
  } = useTTSContext();

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts/providers');
      if (!response.ok) {
        throw new Error('Failed to fetch TTS providers');
      }

      const data: TTSProvidersResponse = await response.json();

      setAvailableProviders(data.providers);

      // Set default provider if not already set
      if (!currentProvider && data.defaultProvider) {
        setCurrentProvider(data.defaultProvider);

        // Set default voice for the provider
        const defaultProviderConfig = data.providers.find(
          (p) => p.type === data.defaultProvider
        );
        if (defaultProviderConfig?.voices?.length) {
          setSelectedVoice(defaultProviderConfig.voices[0].id);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load providers';
      setError(message);
      console.error('Error fetching TTS providers:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentProvider,
    setAvailableProviders,
    setCurrentProvider,
    setSelectedVoice,
    setIsLoading,
    setError,
  ]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const hasAnyConfigured = availableProviders.some((p) => p.isConfigured);

  return {
    isLoading,
    hasAnyConfigured,
    refetch: fetchProviders,
  };
}
