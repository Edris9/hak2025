/**
 * TTS Provider Service Interface
 *
 * Defines the contract for text-to-speech provider implementations.
 * All TTS providers must implement this interface.
 */

import { TTSProviderType, GeneratedAudio, TTSOptions, VoiceOption } from '../models/TTS';

/**
 * Interface for TTS provider implementations
 */
export interface ITTSProviderService {
  /**
   * The provider type identifier
   */
  readonly type: TTSProviderType;

  /**
   * The model name used by this provider
   */
  readonly modelName: string;

  /**
   * Check if this provider is configured (has API key)
   */
  isConfigured(): boolean;

  /**
   * Generate speech from text
   *
   * @param text - The text to convert to speech
   * @param options - Optional generation parameters (voice, speed)
   * @returns Promise resolving to the generated audio data
   */
  generateSpeech(text: string, options?: TTSOptions): Promise<GeneratedAudio>;

  /**
   * Get available voices for this provider
   */
  getVoices(): VoiceOption[];
}
