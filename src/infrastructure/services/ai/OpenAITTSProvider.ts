/**
 * OpenAI TTS Provider
 *
 * Implements text-to-speech using OpenAI's TTS API.
 */

import { BaseTTSProvider } from './BaseTTSProvider';
import { TTSProviderType, GeneratedAudio, TTSOptions, getDefaultVoice } from '@/domain/models';

/**
 * OpenAI TTS provider
 */
export class OpenAITTSProvider extends BaseTTSProvider {
  readonly type: TTSProviderType = 'openai';
  readonly modelName = 'tts-1';

  constructor() {
    super('OPENAI_API_KEY');
  }

  /**
   * Generate speech using OpenAI TTS
   */
  async generateSpeech(text: string, options?: TTSOptions): Promise<GeneratedAudio> {
    const apiKey = this.getApiKey();
    const voice = options?.voice || getDefaultVoice('openai');
    const speed = options?.speed || 1.0;

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.modelName,
        input: text,
        voice,
        speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || `OpenAI TTS error: ${response.status}`);
    }

    // Get audio as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = this.arrayBufferToBase64(audioBuffer);
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return {
      audioUrl,
      format: 'mp3',
    };
  }
}
