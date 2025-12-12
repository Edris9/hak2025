'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageGenProvider, useImageGenContext } from '@/presentation/providers';
import { useImageProviders } from '@/presentation/hooks';
import {
  ImageDisplay,
  ImageGenInput,
  ImageProviderSetup,
  ImageProviderSelector,
} from '@/presentation/components/image-gen';

/**
 * Image Generation Page Content
 *
 * The main image generation interface that shows either:
 * - Provider setup instructions (when no provider is configured)
 * - The image generation interface (when at least one provider is configured)
 */
function ImageGenContent() {
  const { providers, hasConfigured, isLoading } = useImageProviders();
  const { clearImage, generatedImage } = useImageGenContext();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasConfigured) {
    return <ImageProviderSetup providers={providers} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Image Generation</h1>
          <p className="text-sm text-muted-foreground">
            Generate images from text descriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ImageProviderSelector />
          {generatedImage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearImage}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Image Display */}
      <ImageDisplay />

      {/* Input */}
      <ImageGenInput />
    </div>
  );
}

/**
 * Image Generation Page
 *
 * A full-featured image generation interface that supports multiple providers.
 *
 * Features:
 * - Multiple AI provider support (OpenAI DALL-E, Google Imagen)
 * - Text-to-image generation
 * - Provider switching (when multiple are configured)
 * - Download generated images
 * - Clear functionality
 */
export default function ImageGenPage() {
  return (
    <ImageGenProvider>
      <div className="h-[calc(100vh-4rem)]">
        <ImageGenContent />
      </div>
    </ImageGenProvider>
  );
}
