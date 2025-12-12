'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateImage } from '@/presentation/hooks';
import { useImageGenContext } from '@/presentation/providers';

/**
 * ImageGenInput Component
 *
 * Text input for image generation prompts with:
 * - Auto-resizing textarea
 * - Enter to submit, Shift+Enter for new line
 * - Loading state with spinner
 */
export function ImageGenInput() {
  const [prompt, setPrompt] = useState('');
  const { generateImage, isLoading } = useGenerateImage();
  const { hasConfiguredProvider } = useImageGenContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    await generateImage({ prompt });
    // Don't clear the prompt so user can modify and regenerate
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const disabled = !hasConfiguredProvider || isLoading;

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to generate..."
          className="min-h-[44px] max-h-[200px] resize-none"
          disabled={disabled}
          rows={2}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !prompt.trim()}
          className="h-auto aspect-square"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to generate, Shift+Enter for new line
      </p>
    </div>
  );
}
