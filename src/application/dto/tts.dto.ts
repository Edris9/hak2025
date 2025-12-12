/**
 * Text-to-Speech DTOs
 *
 * Data Transfer Objects for the TTS API endpoints.
 */

import {
  TTSProviderType,
  TTSProviderStatus,
  AudioFormat,
} from '@/domain/models';

/**
 * Request to generate speech
 */
export interface GenerateSpeechRequest {
  /** Text to convert to speech */
  text: string;
  /** Voice ID to use (optional) */
  voice?: string;
  /** Speech speed 0.5-2.0 (optional, defaults to 1.0) */
  speed?: number;
  /** Specific provider to use (optional) */
  provider?: TTSProviderType;
}

/**
 * Response from speech generation
 */
export interface GenerateSpeechResponse {
  /** Audio data URL (base64 encoded) */
  audio: string;
  /** Audio format */
  format: AudioFormat;
  /** Duration in seconds (if known) */
  duration?: number;
  /** Provider that generated the audio */
  provider: TTSProviderType;
  /** Request ID for tracking */
  requestId: string;
}

/**
 * Error response from speech generation
 */
export interface TTSErrorResponse {
  error: {
    code: string;
    message: string;
    instructions?: string[];
    requestId: string;
  };
}

/**
 * Response from providers endpoint
 */
export interface TTSProvidersResponse {
  /** List of all providers with their status */
  providers: TTSProviderStatus[];
  /** The default provider type (if any configured) */
  defaultProvider: TTSProviderType | null;
  /** Whether any provider is configured */
  hasAnyConfigured: boolean;
}
