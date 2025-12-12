# Image Generation - User Documentation

## Overview

The Image Generation feature allows you to create images from text descriptions using AI. Simply describe what you want to see, and the AI will generate an image for you.

## Supported Providers

| Provider | Model | Description |
|----------|-------|-------------|
| **OpenAI DALL-E 3** | dall-e-3 | High-quality image generation with excellent prompt understanding |
| **Google Imagen 3** | imagen-3.0-generate-002 | Google's latest image generation with photorealistic output |

## Getting Started

### Step 1: Configure an API Key

Before using image generation, you need to set up at least one AI provider:

#### Option A: OpenAI DALL-E 3 (Recommended)

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. Add to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

#### Option B: Google Imagen 3

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to your `.env.local` file:
   ```
   GEMINI_API_KEY=your-key-here
   ```

**Note:** Google Imagen 3 requires a Google Cloud project with billing enabled.

### Step 2: Restart the Server

After adding your API key, restart the development server:
```bash
npm run dev
```

### Step 3: Navigate to Image Generation

1. Open your browser to `http://localhost:3000`
2. Log in with your credentials
3. Click "Image Gen" in the sidebar

## How to Use

### Generating an Image

1. **Enter a prompt**: Describe the image you want in the text area
2. **Click Generate** (or press Enter)
3. **Wait for generation**: A loading skeleton appears while the image is being created
4. **View your image**: The generated image appears in the main area

### Writing Good Prompts

The quality of your generated image depends on your prompt. Here are some tips:

#### Be Specific
❌ "A cat"
✅ "A fluffy orange tabby cat sleeping on a sunny windowsill"

#### Include Style Details
❌ "A city"
✅ "A futuristic cyberpunk city at night with neon signs and flying cars"

#### Describe Lighting and Mood
❌ "A forest"
✅ "A mystical forest at dawn with rays of golden light filtering through the mist"

#### Example Prompts
- "A cozy coffee shop interior with warm lighting and plants"
- "An astronaut floating in space with Earth in the background"
- "A watercolor painting of a Japanese garden in autumn"
- "A photorealistic portrait of a robot with human-like expressions"
- "A minimalist logo design for a tech startup"

### Downloading Images

1. Hover over the generated image
2. Click the "Download" button that appears
3. The image will be saved to your downloads folder

### Switching Providers

If you have multiple providers configured:

1. Look for the provider dropdown in the header
2. Click to see available providers
3. Select a different provider
4. Your next generation will use the new provider

**Note:** The dropdown only appears if you have 2+ providers configured.

### Clearing the Image

Click the "Clear" button in the header to remove the current image and start fresh.

## Image Sizes

Different providers support different sizes:

### DALL-E 3
- 1024x1024 (Square)
- 1792x1024 (Landscape)
- 1024x1792 (Portrait)

### Imagen 3
- 1:1 (Square)
- 16:9 (Landscape)
- 9:16 (Portrait)
- 4:3 / 3:4 (Standard)

The default size is 1024x1024 (square).

## Understanding Results

### Revised Prompts (DALL-E 3)

DALL-E 3 may modify your prompt to improve the result. The revised prompt appears below the generated image, showing what the AI actually used.

### Generation Time

- Typical generation: 5-15 seconds
- Complex prompts may take longer
- Network conditions affect speed

## Troubleshooting

### "No Image Provider Configured"

**Problem:** You see setup instructions instead of the image generation interface.

**Solution:**
1. Add an API key to `.env.local` (see Getting Started above)
2. Restart the development server
3. Refresh the page

### "Image generation service error"

**Problem:** Generation fails with a generic error.

**Possible causes:**
- Invalid API key
- Account billing issues
- API rate limits exceeded
- Content policy violation

**Solutions:**
1. Verify your API key is correct
2. Check your provider account status
3. Wait a minute and try again
4. Try a different prompt (some content may be blocked)

### Image Not Loading

**Problem:** Generation succeeds but image doesn't display.

**Solutions:**
1. Check your internet connection
2. Try refreshing the page
3. Try generating a new image
4. Check browser console for errors

### "Request timeout"

**Problem:** Generation takes too long and times out.

**Solutions:**
1. Try a simpler prompt
2. Check your internet connection
3. Try again later (server may be busy)

## Content Guidelines

AI image generators have content policies. The following types of content are typically blocked:

- Explicit or adult content
- Violence or gore
- Real people without consent
- Copyrighted characters
- Harmful or illegal content

If your prompt is blocked, try rephrasing it or using different subjects.

## Rate Limits

To ensure fair usage, image generation is rate-limited:

- **10 requests per minute** per user
- Exceeding this limit will show a "Too many requests" error
- Wait a minute before trying again

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Generate image |
| `Shift + Enter` | New line in prompt |

## FAQ

### Q: Which provider should I use?
**A:** DALL-E 3 is recommended for most users due to its reliability and quality. Imagen 3 offers alternative styles but requires Google Cloud billing.

### Q: Can I edit generated images?
**A:** Currently, the feature only supports text-to-image generation. Image editing may be added in future updates.

### Q: Are my prompts stored?
**A:** Prompts are sent to the AI provider but are not stored by this application. Check your provider's privacy policy for their data handling.

### Q: Why does DALL-E 3 change my prompt?
**A:** DALL-E 3 uses "prompt rewriting" to improve results. The revised prompt is shown below the image so you can see what was actually used.

### Q: Can I generate multiple images at once?
**A:** Currently, one image is generated per request. Batch generation may be added in future updates.

### Q: What image format is used?
**A:** Images are typically PNG format. DALL-E 3 returns URLs, while Imagen 3 returns base64-encoded images converted to data URLs.
