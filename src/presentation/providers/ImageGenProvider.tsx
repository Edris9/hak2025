'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ImageProviderType, ImageProviderStatus, GeneratedImage } from '@/domain/models';

/**
 * Image generation context state
 */
interface ImageGenContextState {
  /** Currently generated image */
  generatedImage: GeneratedImage | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Currently selected provider */
  currentProvider: ImageProviderType;
  /** Available providers with configuration status */
  availableProviders: ImageProviderStatus[];
  /** Whether any provider is configured */
  hasConfiguredProvider: boolean;
  /** Set the generated image */
  setGeneratedImage: (image: GeneratedImage | null) => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Set current provider */
  setCurrentProvider: (provider: ImageProviderType) => void;
  /** Set available providers from API response */
  setAvailableProviders: (providers: ImageProviderStatus[], defaultProvider: ImageProviderType | null) => void;
  /** Clear the current image */
  clearImage: () => void;
}

const ImageGenContext = createContext<ImageGenContextState | undefined>(undefined);

/**
 * Hook to access image generation context
 */
export function useImageGenContext(): ImageGenContextState {
  const context = useContext(ImageGenContext);
  if (!context) {
    throw new Error('useImageGenContext must be used within ImageGenProvider');
  }
  return context;
}

interface ImageGenProviderProps {
  children: ReactNode;
}

/**
 * Image generation context provider
 *
 * Manages state for image generation including:
 * - Generated image
 * - Loading/error states
 * - Provider selection
 */
export function ImageGenProvider({ children }: ImageGenProviderProps) {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<ImageProviderType>('openai');
  const [availableProviders, setAvailableProvidersState] = useState<ImageProviderStatus[]>([]);
  const [hasConfiguredProvider, setHasConfiguredProvider] = useState(false);

  const setAvailableProviders = useCallback(
    (providers: ImageProviderStatus[], defaultProvider: ImageProviderType | null) => {
      setAvailableProvidersState(providers);
      setHasConfiguredProvider(providers.some((p) => p.isConfigured));
      if (defaultProvider) {
        setCurrentProvider(defaultProvider);
      }
    },
    []
  );

  const clearImage = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
  }, []);

  const value: ImageGenContextState = {
    generatedImage,
    isLoading,
    error,
    currentProvider,
    availableProviders,
    hasConfiguredProvider,
    setGeneratedImage,
    setIsLoading,
    setError,
    setCurrentProvider,
    setAvailableProviders,
    clearImage,
  };

  return (
    <ImageGenContext.Provider value={value}>
      {children}
    </ImageGenContext.Provider>
  );
}
