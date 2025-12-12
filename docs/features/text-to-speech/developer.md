# Text-to-Speech - Developer Documentation

## Overview

The Text-to-Speech (TTS) feature converts text into natural-sounding audio using AI providers. It supports multiple providers with a plug-and-play architecture, following the same patterns established by AI Chat and Image Generation features.

## Architecture

### Clean Architecture Layers

```
Domain Layer
├── models/TTS.ts                    # Types, configs, voice definitions
└── interfaces/ITTSProviderService.ts # Provider contract

Application Layer
└── dto/tts.dto.ts                   # Request/Response DTOs

Infrastructure Layer
├── services/ai/BaseTTSProvider.ts   # Abstract base class
├── services/ai/OpenAITTSProvider.ts # OpenAI TTS implementation
├── services/ai/ElevenLabsTTSProvider.ts # ElevenLabs implementation
├── services/ai/TTSProviderFactory.ts    # Factory pattern
└── security/middleware/withSecurity.ts  # Security middleware (updated)

Presentation Layer
├── providers/TTSProvider.tsx        # React context
├── hooks/useGenerateSpeech.ts       # Speech generation hook
├── hooks/useTTSProviders.ts         # Providers fetching hook
└── components/tts/                  # UI components
    ├── TTSInput.tsx                 # Text input component
    ├── AudioPlayer.tsx              # Audio playback component
    ├── TTSProviderSelector.tsx      # Provider/voice selector
    ├── TTSProviderSetup.tsx         # Setup instructions
    └── index.ts                     # Barrel exports

App Layer
├── api/tts/route.ts                 # POST endpoint
├── api/tts/providers/route.ts       # GET providers endpoint
└── (dashboard)/text-to-speech/page.tsx # TTS page
```

## Supported Providers

### OpenAI TTS

- **Model**: `tts-1` (fast) or `tts-1-hd` (high quality)
- **Voices**: alloy, echo, fable, onyx, nova, shimmer
- **Format**: MP3
- **Speed**: 0.25 to 4.0
- **API**: `https://api.openai.com/v1/audio/speech`
- **Env var**: `OPENAI_API_KEY` (shared with Chat/Image)

### ElevenLabs

- **Model**: `eleven_multilingual_v2`
- **Voices**: Rachel, Drew, Clyde, Paul, Domi, Dave, Fin, Sarah, Antoni, Thomas, Charlie, Emily
- **Format**: MP3
- **API**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Env var**: `ELEVENLABS_API_KEY`

## Files Created/Modified

### New Files (16)

```
src/domain/models/TTS.ts
src/domain/interfaces/ITTSProviderService.ts
src/application/dto/tts.dto.ts
src/infrastructure/services/ai/BaseTTSProvider.ts
src/infrastructure/services/ai/OpenAITTSProvider.ts
src/infrastructure/services/ai/ElevenLabsTTSProvider.ts
src/infrastructure/services/ai/TTSProviderFactory.ts
src/presentation/providers/TTSProvider.tsx
src/presentation/hooks/useGenerateSpeech.ts
src/presentation/hooks/useTTSProviders.ts
src/presentation/components/tts/TTSInput.tsx
src/presentation/components/tts/AudioPlayer.tsx
src/presentation/components/tts/TTSProviderSelector.tsx
src/presentation/components/tts/TTSProviderSetup.tsx
src/presentation/components/tts/index.ts
src/app/api/tts/route.ts
src/app/api/tts/providers/route.ts
src/app/(dashboard)/text-to-speech/page.tsx
```

### Modified Files (7)

```
src/domain/models/index.ts           # Export TTS types
src/domain/interfaces/index.ts       # Export ITTSProviderService
src/application/dto/index.ts         # Export TTS DTOs
src/infrastructure/services/ai/index.ts # Export TTS providers
src/infrastructure/security/middleware/withSecurity.ts # TTS validation
src/presentation/providers/index.ts  # Export TTSProvider
src/presentation/hooks/index.ts      # Export TTS hooks
src/presentation/components/layout/AppSidebar.tsx # Navigation
```

## API Endpoints

### POST /api/tts

Generate speech from text.

**Request:**
```json
{
  "text": "Hello, this is a test of text to speech.",
  "voice": "alloy",
  "speed": 1.0,
  "provider": "openai"
}
```

**Response:**
```json
{
  "audio": "data:audio/mpeg;base64,//uQxAAAAAANIAAAA...",
  "format": "mp3",
  "duration": null,
  "provider": "openai",
  "requestId": "req_abc123"
}
```

**Error Response:**
```json
{
  "error": {
    "code": "GENERATION_ERROR",
    "message": "Speech generation failed",
    "requestId": "req_abc123"
  }
}
```

### GET /api/tts/providers

Get available TTS providers.

**Response:**
```json
{
  "providers": [
    {
      "type": "openai",
      "name": "OpenAI TTS",
      "description": "High-quality text-to-speech using OpenAI's TTS API",
      "isConfigured": true,
      "voices": [
        { "id": "alloy", "name": "Alloy", "gender": "neutral" },
        { "id": "echo", "name": "Echo", "gender": "male" }
      ]
    },
    {
      "type": "elevenlabs",
      "name": "ElevenLabs",
      "description": "Ultra-realistic voice synthesis with ElevenLabs",
      "isConfigured": false,
      "voices": []
    }
  ],
  "defaultProvider": "openai",
  "hasAnyConfigured": true
}
```

## Data Flow

```
User Input → TTSInput Component
                ↓
         useGenerateSpeech Hook
                ↓
         POST /api/tts
                ↓
         withSecurity Middleware
         (rate limit, validation, sanitization)
                ↓
         TTSProviderFactory.getProvider()
                ↓
         Provider.generateSpeech()
         (OpenAI or ElevenLabs API)
                ↓
         Base64 Audio Response
                ↓
         TTSContext.setGeneratedAudio()
                ↓
         AudioPlayer Component
         (HTML5 Audio playback)
```

## Security

### Rate Limiting
- 20 requests per minute per IP (configured in `RATE_LIMITS`)
- Uses `text-to-speech` modality

### Input Validation
- Max text length: 5,000 characters
- Speed range: 0.5 to 2.0
- Provider enum: `openai` | `elevenlabs`
- Zod schema validation

### Input Sanitization
- Prompt injection pattern detection
- Suspicious input flagging
- Malicious content blocking

## Adding a New Provider

1. **Domain Layer**: Add provider type to `TTSProviderType` union in `TTS.ts`

2. **Provider Config**: Add entry to `TTS_PROVIDERS` object with:
   - name, description
   - voices array
   - API key instructions

3. **Implementation**: Create new provider class extending `BaseTTSProvider`:
```typescript
export class NewTTSProvider extends BaseTTSProvider {
  readonly type: TTSProviderType = 'newprovider';
  readonly modelName = 'model-name';

  isConfigured(): boolean {
    return !!process.env.NEWPROVIDER_API_KEY;
  }

  getVoices(): VoiceOption[] {
    return NEW_PROVIDER_VOICES;
  }

  async generateSpeech(text: string, options?: TTSOptions): Promise<GeneratedAudio> {
    // Implementation
  }
}
```

4. **Factory**: Register in `TTSProviderFactory.createProvider()`

5. **Priority**: Add to `TTS_PROVIDER_PRIORITY` array

## Testing

### Manual Testing
1. Configure at least one provider API key
2. Navigate to `/text-to-speech`
3. Enter text and click Generate Speech
4. Verify audio plays correctly
5. Test download functionality
6. Test voice switching
7. Test provider switching (if multiple configured)

### Error States
- No provider configured → Shows setup instructions
- Invalid input → Shows validation error
- API error → Shows sanitized error message
- Rate limited → Shows retry message

## Environment Variables

```env
# OpenAI (shared with Chat and Image Gen)
OPENAI_API_KEY=sk-...

# ElevenLabs (new for TTS)
ELEVENLABS_API_KEY=...

# Optional: Force specific provider
TTS_PROVIDER=openai
```

## Audio Handling

Audio is returned as base64-encoded data URLs for simplicity:
- No need for file storage
- Works directly with HTML5 Audio element
- Enables easy download via data URL

Format: `data:audio/mpeg;base64,{base64_data}`

Browser playback uses the `audioRef` from TTSContext, managed by the `AudioPlayer` component.
