/**
 * Text-to-Speech Domain Models
 *
 * This file defines the core data structures for the TTS feature.
 * It supports multiple providers (OpenAI TTS, ElevenLabs) with a
 * plug-and-play architecture.
 */

/**
 * Supported TTS provider types
 */
export type TTSProviderType = 'openai' | 'elevenlabs';

/**
 * Audio output format
 */
export type AudioFormat = 'mp3' | 'wav' | 'opus' | 'aac' | 'flac';

/**
 * Voice option for TTS
 */
export interface VoiceOption {
  id: string;
  name: string;
  gender?: 'male' | 'female' | 'neutral';
  description?: string;
}

/**
 * Generated audio result
 */
export interface GeneratedAudio {
  /** Audio data URL (base64 encoded) */
  audioUrl: string;
  /** Audio format */
  format: AudioFormat;
  /** Duration in seconds (if known) */
  duration?: number;
}

/**
 * TTS generation options
 */
export interface TTSOptions {
  /** Voice ID to use */
  voice?: string;
  /** Speech speed (0.5 to 2.0) */
  speed?: number;
}

/**
 * Configuration for a TTS provider including setup instructions
 */
export interface TTSProviderConfig {
  type: TTSProviderType;
  name: string;
  description: string;
  docsUrl: string;
  apiKeyEnvVar: string;
  apiKeyInstructions: string[];
  modelName: string;
  voices: VoiceOption[];
}

/**
 * Provider status including configuration state
 */
export interface TTSProviderStatus extends TTSProviderConfig {
  isConfigured: boolean;
}

/**
 * OpenAI TTS voices
 */
export const OPENAI_VOICES: VoiceOption[] = [
  { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', gender: 'male', description: 'Warm and conversational' },
  { id: 'fable', name: 'Fable', gender: 'neutral', description: 'Expressive and dramatic' },
  { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', gender: 'female', description: 'Friendly and upbeat' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female', description: 'Clear and pleasant' },
];

/**
 * ElevenLabs default voices
 */
export const ELEVENLABS_VOICES: VoiceOption[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'female', description: 'Soft and friendly' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', description: 'Calm and professional' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'female', description: 'Strong and clear' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male', description: 'Well-rounded and calm' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', gender: 'female', description: 'Emotional and expressive' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male', description: 'Deep and narrative' },
];

/**
 * Configuration for all supported TTS providers
 */
export const TTS_PROVIDERS: Record<TTSProviderType, TTSProviderConfig> = {
  openai: {
    type: 'openai',
    name: 'OpenAI TTS',
    description: 'High-quality text-to-speech with natural sounding voices.',
    docsUrl: 'https://platform.openai.com/api-keys',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    modelName: 'tts-1',
    voices: OPENAI_VOICES,
    apiKeyInstructions: [
      'Go to https://platform.openai.com/api-keys',
      'Sign in or create an OpenAI account',
      'Click "Create new secret key"',
      'Give your key a name and click "Create secret key"',
      'Copy the key immediately (shown only once, starts with sk-...)',
      'Add to .env.local: OPENAI_API_KEY=sk-...',
    ],
  },
  elevenlabs: {
    type: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Premium voice synthesis with ultra-realistic voices.',
    docsUrl: 'https://elevenlabs.io/app/api-keys',
    apiKeyEnvVar: 'ELEVENLABS_API_KEY',
    modelName: 'eleven_monolingual_v1',
    voices: ELEVENLABS_VOICES,
    apiKeyInstructions: [
      'Go to https://elevenlabs.io/app/api-keys',
      'Sign in or create an ElevenLabs account',
      'Click "Create API Key"',
      'Copy the generated API key',
      'Add to .env.local: ELEVENLABS_API_KEY=your-key-here',
    ],
  },
};

/**
 * Priority order for selecting default provider
 * First configured provider in this list will be used as default
 */
export const TTS_PROVIDER_PRIORITY: TTSProviderType[] = ['openai', 'elevenlabs'];

/**
 * Helper to generate a unique TTS request ID
 */
export function generateTTSRequestId(): string {
  return `tts_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get default voice for a provider
 */
export function getDefaultVoice(provider: TTSProviderType): string {
  const config = TTS_PROVIDERS[provider];
  return config.voices[0]?.id || 'alloy';
}
