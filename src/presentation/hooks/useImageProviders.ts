'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useImageGenContext } from '@/presentation/providers';
import { ImageProvidersResponse } from '@/application/dto';

/**
 * Hook to fetch and manage image generation providers
 */
export function useImageProviders() {
  const { setAvailableProviders } = useImageGenContext();

  const query = useQuery<ImageProvidersResponse>({
    queryKey: ['image-providers'],
    queryFn: async () => {
      const response = await fetch('/api/image/providers');
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update context when data changes
  useEffect(() => {
    if (query.data) {
      setAvailableProviders(query.data.providers, query.data.defaultProvider);
    }
  }, [query.data, setAvailableProviders]);

  return {
    providers: query.data?.providers ?? [],
    defaultProvider: query.data?.defaultProvider ?? null,
    hasConfigured: query.data?.hasAnyConfigured ?? false,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
