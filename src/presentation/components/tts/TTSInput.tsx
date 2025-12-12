'use client';

/**
 * TTS Input Component
 *
 * Text input area with character count and generate button.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateSpeech } from '@/presentation/hooks/useGenerateSpeech';
import { Loader2, Volume2 } from 'lucide-react';
import { LIMITS } from '@/infrastructure/security';

interface TTSInputProps {
  disabled?: boolean;
}

export function TTSInput({ disabled }: TTSInputProps) {
  const [text, setText] = useState('');
  const { generateSpeech, isLoading } = useGenerateSpeech();

  const maxLength = LIMITS.tts.maxTextLength;
  const characterCount = text.length;
  const isOverLimit = characterCount > maxLength;
  const canGenerate = text.trim().length > 0 && !isOverLimit && !disabled;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canGenerate && !isLoading) {
      await generateSpeech(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (canGenerate && !isLoading) {
        generateSpeech(text);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter text to convert to speech..."
          className="min-h-[120px] resize-none pr-4 pb-8"
          disabled={disabled || isLoading}
        />
        <div
          className={`absolute bottom-2 right-3 text-xs ${
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          {characterCount.toLocaleString()} / {maxLength.toLocaleString()}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Press Ctrl+Enter to generate
        </p>
        <Button
          type="submit"
          disabled={!canGenerate || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Generate Speech
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
