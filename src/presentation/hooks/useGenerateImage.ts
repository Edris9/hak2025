'use client';

import { useCallback } from 'react';
import { useImageGenContext } from '@/presentation/providers';
import { GenerateImageResponse, ImageErrorResponse } from '@/application/dto';
import { ImageSize } from '@/domain/models';

interface GenerateImageParams {
  prompt: string;
  size?: ImageSize;
}

/**
 * Hook to generate images using the image generation API
 */
export function useGenerateImage() {
  const {
    currentProvider,
    setGeneratedImage,
    setIsLoading,
    setError,
    isLoading,
  } = useImageGenContext();

  const generateImage = useCallback(
    async ({ prompt, size }: GenerateImageParams) => {
      if (!prompt.trim()) {
        setError('Please enter a prompt');
        return;
      }

      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);

      try {
        const response = await fetch('/api/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            size,
            provider: currentProvider,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorData = data as ImageErrorResponse;
          throw new Error(errorData.error?.message || 'Failed to generate image');
        }

        const successData = data as GenerateImageResponse;
        setGeneratedImage(successData.image);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentProvider, setGeneratedImage, setIsLoading, setError]
  );

  return {
    generateImage,
    isLoading,
  };
}
