/**
 * Base TTS Provider
 *
 * Abstract base class for all text-to-speech providers.
 * Provides common functionality for API key validation and error handling.
 */

import { ITTSProviderService } from '@/domain/interfaces';
import { TTSProviderType, GeneratedAudio, TTSOptions, VoiceOption, TTS_PROVIDERS } from '@/domain/models';

/**
 * Abstract base class for TTS providers
 */
export abstract class BaseTTSProvider implements ITTSProviderService {
  abstract readonly type: TTSProviderType;
  abstract readonly modelName: string;

  protected apiKey: string | undefined;
  protected apiKeyEnvVar: string;

  constructor(apiKeyEnvVar: string) {
    this.apiKeyEnvVar = apiKeyEnvVar;
    this.apiKey = process.env[apiKeyEnvVar];
  }

  /**
   * Check if this provider is configured (has API key)
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Generate speech from text
   * Must be implemented by each provider
   */
  abstract generateSpeech(text: string, options?: TTSOptions): Promise<GeneratedAudio>;

  /**
   * Get available voices for this provider
   */
  getVoices(): VoiceOption[] {
    return TTS_PROVIDERS[this.type].voices;
  }

  /**
   * Get the API key, throwing if not configured
   */
  protected getApiKey(): string {
    if (!this.apiKey) {
      throw new Error(`${this.apiKeyEnvVar} is not configured`);
    }
    return this.apiKey;
  }

  /**
   * Convert ArrayBuffer to base64
   */
  protected arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
