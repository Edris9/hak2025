'use client';

/**
 * API Explorer Provider Context
 *
 * Manages state for the Swedish APIs Explorer including
 * selected API, endpoint, parameters, and response data.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  SwedishAPIType,
  SwedishAPIStatus,
  APIEndpoint,
  APIResponse,
} from '@/domain/models';

interface APIExplorerContextType {
  /** Available APIs with status */
  availableAPIs: SwedishAPIStatus[];
  /** Currently selected API */
  selectedAPI: SwedishAPIType | null;
  /** Currently selected endpoint */
  selectedEndpoint: APIEndpoint | null;
  /** Request parameters */
  requestParams: Record<string, string>;
  /** Request body for POST requests */
  requestBody: string;
  /** API response */
  response: APIResponse | null;
  /** Whether request is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Set available APIs */
  setAvailableAPIs: (apis: SwedishAPIStatus[]) => void;
  /** Set selected API */
  setSelectedAPI: (api: SwedishAPIType | null) => void;
  /** Set selected endpoint */
  setSelectedEndpoint: (endpoint: APIEndpoint | null) => void;
  /** Set request parameters */
  setRequestParams: (params: Record<string, string>) => void;
  /** Update a single parameter */
  updateParam: (key: string, value: string) => void;
  /** Set request body */
  setRequestBody: (body: string) => void;
  /** Set response */
  setResponse: (response: APIResponse | null) => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set error */
  setError: (error: string | null) => void;
  /** Clear response and error */
  clearResponse: () => void;
  /** Get current API config */
  getCurrentAPIConfig: () => SwedishAPIStatus | undefined;
}

const APIExplorerContext = createContext<APIExplorerContextType | undefined>(undefined);

interface APIExplorerProviderProps {
  children: React.ReactNode;
}

export function APIExplorerProvider({ children }: APIExplorerProviderProps) {
  const [availableAPIs, setAvailableAPIs] = useState<SwedishAPIStatus[]>([]);
  const [selectedAPI, setSelectedAPI] = useState<SwedishAPIType | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [requestParams, setRequestParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>('');
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateParam = useCallback((key: string, value: string) => {
    setRequestParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  const getCurrentAPIConfig = useCallback(() => {
    if (!selectedAPI) return undefined;
    return availableAPIs.find((api) => api.type === selectedAPI);
  }, [selectedAPI, availableAPIs]);

  const value: APIExplorerContextType = {
    availableAPIs,
    selectedAPI,
    selectedEndpoint,
    requestParams,
    requestBody,
    response,
    isLoading,
    error,
    setAvailableAPIs,
    setSelectedAPI,
    setSelectedEndpoint,
    setRequestParams,
    updateParam,
    setRequestBody,
    setResponse,
    setIsLoading,
    setError,
    clearResponse,
    getCurrentAPIConfig,
  };

  return (
    <APIExplorerContext.Provider value={value}>
      {children}
    </APIExplorerContext.Provider>
  );
}

export function useAPIExplorerContext() {
  const context = useContext(APIExplorerContext);
  if (context === undefined) {
    throw new Error('useAPIExplorerContext must be used within an APIExplorerProvider');
  }
  return context;
}
