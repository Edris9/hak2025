'use client';

/**
 * useSwedishAPIs Hook
 *
 * Fetches available Swedish APIs from the API endpoint.
 */

import { useEffect, useCallback } from 'react';
import { useAPIExplorerContext } from '../providers/APIExplorerProvider';
import { AvailableAPIsResponse } from '@/application/dto';

interface UseSwedishAPIsReturn {
  /** Whether APIs are being loaded */
  isLoading: boolean;
  /** Number of configured APIs */
  configuredCount: number;
  /** Total number of APIs */
  totalCount: number;
  /** Refetch APIs */
  refetch: () => Promise<void>;
}

export function useSwedishAPIs(): UseSwedishAPIsReturn {
  const {
    availableAPIs,
    setAvailableAPIs,
    selectedAPI,
    setSelectedAPI,
    setSelectedEndpoint,
    setRequestParams,
    setRequestBody,
    isLoading,
    setIsLoading,
    setError,
  } = useAPIExplorerContext();

  const fetchAPIs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/swedish-apis');
      if (!response.ok) {
        throw new Error('Failed to fetch Swedish APIs');
      }

      const data: AvailableAPIsResponse = await response.json();
      setAvailableAPIs(data.apis);

      // Set default selection if not already set
      if (!selectedAPI && data.apis.length > 0) {
        const firstConfigured = data.apis.find((api) => api.isConfigured);
        const firstAPI = firstConfigured || data.apis[0];

        setSelectedAPI(firstAPI.type);

        // Select first endpoint
        if (firstAPI.endpoints.length > 0) {
          const firstEndpoint = firstAPI.endpoints[0];
          setSelectedEndpoint(firstEndpoint);

          // Set default parameters
          const defaultParams: Record<string, string> = {};
          firstEndpoint.params?.forEach((param) => {
            if (param.default) {
              defaultParams[param.name] = param.default;
            }
          });
          setRequestParams(defaultParams);

          // Set default body
          if (firstEndpoint.bodyTemplate) {
            setRequestBody(firstEndpoint.bodyTemplate);
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load APIs';
      setError(message);
      console.error('Error fetching Swedish APIs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedAPI,
    setAvailableAPIs,
    setSelectedAPI,
    setSelectedEndpoint,
    setRequestParams,
    setRequestBody,
    setIsLoading,
    setError,
  ]);

  useEffect(() => {
    fetchAPIs();
  }, [fetchAPIs]);

  const configuredCount = availableAPIs.filter((api) => api.isConfigured).length;

  return {
    isLoading,
    configuredCount,
    totalCount: availableAPIs.length,
    refetch: fetchAPIs,
  };
}
