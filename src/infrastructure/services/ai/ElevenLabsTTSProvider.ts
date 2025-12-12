/**
 * ElevenLabs TTS Provider
 *
 * Implements text-to-speech using ElevenLabs API.
 */

import { BaseTTSProvider } from './BaseTTSProvider';
import { TTSProviderType, GeneratedAudio, TTSOptions, getDefaultVoice } from '@/domain/models';

/**
 * ElevenLabs TTS provider
 */
export class ElevenLabsTTSProvider extends BaseTTSProvider {
  readonly type: TTSProviderType = 'elevenlabs';
  readonly modelName = 'eleven_monolingual_v1';

  constructor() {
    super('ELEVENLABS_API_KEY');
  }

  /**
   * Generate speech using ElevenLabs
   */
  async generateSpeech(text: string, options?: TTSOptions): Promise<GeneratedAudio> {
    const apiKey = this.getApiKey();
    const voiceId = options?.voice || getDefaultVoice('elevenlabs');

    // ElevenLabs uses stability and similarity_boost instead of speed
    // We'll map speed to these parameters
    const stability = 0.5;
    const similarityBoost = 0.75;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: this.modelName,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.message || error?.detail || `ElevenLabs error: ${response.status}`);
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
