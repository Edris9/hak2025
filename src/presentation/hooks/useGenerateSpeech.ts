'use client';

/**
 * useGenerateSpeech Hook
 *
 * Handles text-to-speech generation via API endpoint.
 * Manages loading, error states, and updates context.
 */

import { useCallback } from 'react';
import { useTTSContext } from '../providers/TTSProvider';
import { GenerateSpeechRequest, GenerateSpeechResponse } from '@/application/dto/tts.dto';
import { AudioFormat } from '@/domain/models';

interface UseGenerateSpeechReturn {
  /** Generate speech from text */
  generateSpeech: (text: string) => Promise<void>;
  /** Whether speech is being generated */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
}

export function useGenerateSpeech(): UseGenerateSpeechReturn {
  const {
    setGeneratedAudio,
    setIsLoading,
    setError,
    currentProvider,
    selectedVoice,
    isLoading,
    error,
    clearAudio,
  } = useTTSContext();

  const generateSpeech = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setError('Please enter some text');
        return;
      }

      if (!currentProvider) {
        setError('No TTS provider configured');
        return;
      }

      // Clear previous audio and errors
      clearAudio();
      setIsLoading(true);
      setError(null);

      try {
        const requestBody: GenerateSpeechRequest = {
          text: text.trim(),
          provider: currentProvider,
          voice: selectedVoice || undefined,
          speed: 1.0,
        };

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Generation failed: ${response.status}`);
        }

        const data: GenerateSpeechResponse = await response.json();

        if (!data.audio) {
          throw new Error('No audio returned from API');
        }

        setGeneratedAudio({
          audioUrl: data.audio,
          format: (data.format || 'mp3') as AudioFormat,
          duration: data.duration,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate speech';
        setError(message);
        console.error('Speech generation error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentProvider, selectedVoice, setGeneratedAudio, setIsLoading, setError, clearAudio]
  );

  return {
    generateSpeech,
    isLoading,
    error,
  };
}
