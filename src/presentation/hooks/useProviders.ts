import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChatContext } from '../providers/ChatProvider';
import { ProvidersResponse } from '@/application/dto';

/**
 * Fetch available AI providers from the API
 */
async function fetchProviders(): Promise<ProvidersResponse> {
  const response = await fetch('/api/chat/providers');
  if (!response.ok) {
    throw new Error('Failed to fetch providers');
  }
  return response.json();
}

/**
 * Hook for fetching and managing available AI providers
 *
 * This hook fetches the list of available providers from the API
 * and updates the chat context with the results.
 *
 * @example
 * ```tsx
 * const { providers, hasConfigured, isLoading } = useProviders();
 *
 * if (!hasConfigured) {
 *   return <ProviderSetup providers={providers} />;
 * }
 * ```
 */
export function useProviders() {
  const { setAvailableProviders, availableProviders, hasConfiguredProvider } = useChatContext();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['chat-providers'],
    queryFn: fetchProviders,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  // Update context when data changes
  useEffect(() => {
    if (data) {
      setAvailableProviders(data.providers, data.defaultProvider);
    }
  }, [data, setAvailableProviders]);

  return {
    providers: availableProviders,
    defaultProvider: data?.defaultProvider || null,
    hasConfigured: hasConfiguredProvider,
    isLoading,
    error,
    refetch,
  };
}
