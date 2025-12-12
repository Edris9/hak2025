'use client';

/**
 * useExecuteAPI Hook
 *
 * Handles executing requests to Swedish APIs via the proxy endpoint.
 */

import { useCallback } from 'react';
import { useAPIExplorerContext } from '../providers/APIExplorerProvider';
import { ExecuteAPIRequest, ExecuteAPIResponse } from '@/application/dto';

interface UseExecuteAPIReturn {
  /** Execute the current request */
  executeRequest: () => Promise<void>;
  /** Whether request is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
}

export function useExecuteAPI(): UseExecuteAPIReturn {
  const {
    selectedAPI,
    selectedEndpoint,
    requestParams,
    requestBody,
    setResponse,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearResponse,
  } = useAPIExplorerContext();

  const executeRequest = useCallback(async () => {
    if (!selectedAPI || !selectedEndpoint) {
      setError('Please select an API and endpoint');
      return;
    }

    clearResponse();
    setIsLoading(true);
    setError(null);

    try {
      const requestData: ExecuteAPIRequest = {
        apiType: selectedAPI,
        endpointId: selectedEndpoint.id,
        params: requestParams,
        body: selectedEndpoint.method === 'POST' ? requestBody : undefined,
      };

      const response = await fetch('/api/swedish-apis/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Request failed: ${response.status}`);
      }

      const executeResponse = data as ExecuteAPIResponse;
      setResponse(executeResponse.response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to execute request';
      setError(message);
      console.error('API execution error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedAPI,
    selectedEndpoint,
    requestParams,
    requestBody,
    setResponse,
    setIsLoading,
    setError,
    clearResponse,
  ]);

  return {
    executeRequest,
    isLoading,
    error,
  };
}
