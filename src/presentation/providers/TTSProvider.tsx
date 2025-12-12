'use client';

/**
 * TTS Provider Context
 *
 * Manages text-to-speech state including generated audio,
 * provider selection, and playback state.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { GeneratedAudio, TTSProviderType, TTSProviderStatus, VoiceOption } from '@/domain/models';

interface TTSContextType {
  /** Currently generated audio */
  generatedAudio: GeneratedAudio | null;
  /** Whether audio is being generated */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Currently selected provider */
  currentProvider: TTSProviderType | null;
  /** List of configured providers */
  availableProviders: TTSProviderStatus[];
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Selected voice */
  selectedVoice: string | null;
  /** Set generated audio */
  setGeneratedAudio: (audio: GeneratedAudio | null) => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: string | null) => void;
  /** Set current provider */
  setCurrentProvider: (provider: TTSProviderType | null) => void;
  /** Set available providers */
  setAvailableProviders: (providers: TTSProviderStatus[]) => void;
  /** Set playing state */
  setIsPlaying: (playing: boolean) => void;
  /** Set selected voice */
  setSelectedVoice: (voice: string | null) => void;
  /** Clear current audio and error */
  clearAudio: () => void;
  /** Get voices for current provider */
  getVoicesForProvider: () => VoiceOption[];
  /** Audio element ref for controlling playback */
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

interface TTSProviderProps {
  children: React.ReactNode;
}

export function TTSProvider({ children }: TTSProviderProps) {
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<TTSProviderType | null>(null);
  const [availableProviders, setAvailableProviders] = useState<TTSProviderStatus[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearAudio = useCallback(() => {
    setGeneratedAudio(null);
    setError(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const getVoicesForProvider = useCallback(() => {
    if (!currentProvider) return [];
    const provider = availableProviders.find((p) => p.type === currentProvider);
    return provider?.voices || [];
  }, [currentProvider, availableProviders]);

  const value: TTSContextType = {
    generatedAudio,
    isLoading,
    error,
    currentProvider,
    availableProviders,
    isPlaying,
    selectedVoice,
    setGeneratedAudio,
    setIsLoading,
    setError,
    setCurrentProvider,
    setAvailableProviders,
    setIsPlaying,
    setSelectedVoice,
    clearAudio,
    getVoicesForProvider,
    audioRef,
  };

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
}

export function useTTSContext() {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error('useTTSContext must be used within a TTSProvider');
  }
  return context;
}
