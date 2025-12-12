'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TTSProvider, useTTSContext } from '@/presentation/providers';
import { useTTSProviders } from '@/presentation/hooks';
import {
  AudioPlayer,
  TTSInput,
  TTSProviderSetup,
  TTSProviderSelector,
} from '@/presentation/components/tts';

/**
 * Text-to-Speech Page Content
 *
 * The main TTS interface that shows either:
 * - Provider setup instructions (when no provider is configured)
 * - The TTS interface (when at least one provider is configured)
 */
function TTSContent() {
  const { isLoading, hasAnyConfigured } = useTTSProviders();
  const { clearAudio, generatedAudio } = useTTSContext();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAnyConfigured) {
    return <TTSProviderSetup />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Text to Speech</h1>
          <p className="text-sm text-muted-foreground">
            Convert text to natural-sounding audio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TTSProviderSelector />
          {generatedAudio && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAudio}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Audio Player */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AudioPlayer />
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="max-w-2xl mx-auto">
          <TTSInput />
        </div>
      </div>
    </div>
  );
}

/**
 * Text-to-Speech Page
 *
 * A full-featured TTS interface that supports multiple providers.
 *
 * Features:
 * - Multiple AI provider support (OpenAI TTS, ElevenLabs)
 * - Text-to-speech conversion
 * - Voice selection per provider
 * - Audio playback controls
 * - Download generated audio
 * - Clear functionality
 */
export default function TextToSpeechPage() {
  return (
    <TTSProvider>
      <div className="h-[calc(100vh-4rem)]">
        <TTSContent />
      </div>
    </TTSProvider>
  );
}
