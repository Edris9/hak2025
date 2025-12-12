# Text-to-Speech - User Documentation

## Overview

The Text-to-Speech feature converts your text into natural-sounding audio. You can type or paste any text, choose from different voices, and download the generated audio file.

## Getting Started

### Prerequisites

You need at least one TTS provider configured:

- **OpenAI TTS**: Uses your existing OpenAI API key (same as Chat)
- **ElevenLabs**: Requires a separate ElevenLabs API key

### Configuration

1. Open your `.env.local` file in the project root
2. Add your API key(s):

```env
# OpenAI TTS (if you already have this for Chat, you're set!)
OPENAI_API_KEY=sk-your-key-here

# ElevenLabs (for ultra-realistic voices)
ELEVENLABS_API_KEY=your-elevenlabs-key
```

3. Restart your development server

## How to Use

### 1. Navigate to Text to Speech

Click "Text to Speech" in the sidebar navigation, or go directly to `/text-to-speech`.

### 2. Enter Your Text

Type or paste the text you want to convert to speech in the text area. The character counter shows how much space you have (max 5,000 characters).

### 3. Select Provider and Voice (Optional)

Use the dropdowns at the top to:
- **Provider**: Choose between OpenAI TTS or ElevenLabs
- **Voice**: Select from available voices for that provider

### 4. Generate Speech

Click the "Generate Speech" button or press `Ctrl+Enter` to start generation.

### 5. Listen and Download

Once generated:
- Click the **play button** to listen
- Click **Download** to save the audio file

## Available Voices

### OpenAI TTS Voices

| Voice | Description |
|-------|-------------|
| Alloy | Neutral, versatile |
| Echo | Male, clear |
| Fable | Male, expressive |
| Onyx | Male, deep |
| Nova | Female, warm |
| Shimmer | Female, soft |

### ElevenLabs Voices

| Voice | Gender |
|-------|--------|
| Rachel | Female |
| Drew | Male |
| Clyde | Male |
| Paul | Male |
| Domi | Female |
| Dave | Male |
| Fin | Male |
| Sarah | Female |
| Antoni | Male |
| Thomas | Male |
| Charlie | Male |
| Emily | Female |

## Tips

- **Short texts**: For quick tests, try short phrases first
- **Punctuation matters**: Include proper punctuation for natural pauses
- **Voice selection**: Different voices work better for different content types
- **Download**: Audio is saved as MP3 format

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Generate speech |

## Error Handling

### "No TTS provider is configured"

Add at least one API key to your `.env.local` file and restart the server.

### "Text exceeds 5000 characters"

Shorten your text. The limit is 5,000 characters per request.

### "Generation Failed"

This usually means an API error. Try:
1. Check your API key is valid
2. Ensure you have API credits
3. Try again in a few seconds

### "Too many requests"

You've hit the rate limit (20 requests per minute). Wait a moment and try again.

## Supported Providers

| Provider | Quality | Speed | Best For |
|----------|---------|-------|----------|
| OpenAI TTS | High | Fast | General use, clear speech |
| ElevenLabs | Very High | Medium | Natural conversation, characters |

## FAQ

**Q: Can I use the same API key for Chat and TTS?**
A: Yes! OpenAI TTS uses the same `OPENAI_API_KEY` as the Chat feature.

**Q: What audio format is generated?**
A: MP3 format, compatible with all browsers and devices.

**Q: Is there a text limit?**
A: Yes, 5,000 characters per request.

**Q: Can I change the speech speed?**
A: Currently fixed at 1.0x. Speed customization may be added in future updates.

**Q: Do I need both providers?**
A: No, one provider is enough. Configure whichever you prefer.
