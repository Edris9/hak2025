'use client';

import { Image as ImageIcon, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageGenContext } from '@/presentation/providers';

/**
 * ImageDisplay Component
 *
 * Displays the generated image with:
 * - Empty state when no image
 * - Loading skeleton during generation
 * - Error state with message
 * - Download button for the image
 */
export function ImageDisplay() {
  const { generatedImage, isLoading, error } = useImageGenContext();

  const handleDownload = async () => {
    if (!generatedImage?.url) return;

    try {
      // For data URLs (base64), create a blob directly
      if (generatedImage.url.startsWith('data:')) {
        const response = await fetch(generatedImage.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For regular URLs, open in new tab (CORS may prevent direct download)
        window.open(generatedImage.url, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Skeleton className="w-[400px] h-[400px] rounded-lg mx-auto" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Generating your image...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Image state
  if (generatedImage?.url) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generatedImage.url}
            alt={generatedImage.revisedPrompt || 'Generated image'}
            className="max-w-full max-h-[60vh] rounded-lg shadow-lg object-contain"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        {generatedImage.revisedPrompt && (
          <p className="text-sm text-muted-foreground max-w-xl text-center">
            <span className="font-medium">Revised prompt: </span>
            {generatedImage.revisedPrompt}
          </p>
        )}
      </div>
    );
  }

  // Empty state
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50" />
        <div>
          <h3 className="font-medium">No Image Generated</h3>
          <p className="text-sm text-muted-foreground">
            Enter a prompt below to generate an image
          </p>
        </div>
      </div>
    </div>
  );
}
