# Image Generation - Developer Documentation

## Overview

The Image Generation feature is built following Clean Architecture principles, enabling text-to-image generation with multiple AI providers. It supports OpenAI DALL-E 3 and Google Imagen 3 with a plug-and-play architecture.

## Architecture

```
Image Generation Feature
├── Domain Layer
│   ├── ImageGen Model (ImageProviderType, GeneratedImage, ImageProviderConfig)
│   └── IImageProviderService Interface
├── Application Layer
│   └── Image DTOs (GenerateImageRequest, GenerateImageResponse, etc.)
├── Infrastructure Layer
│   ├── BaseImageProvider (abstract class)
│   ├── Provider Implementations (OpenAI DALL-E, Gemini Imagen)
│   └── ImageProviderFactory
├── API Layer
│   ├── /api/image (POST - JSON response)
│   └── /api/image/providers (GET)
└── Presentation Layer
    ├── ImageGenProvider (context)
    ├── Hooks (useGenerateImage, useImageProviders)
    └── Components (ImageDisplay, ImageGenInput, etc.)
```

## File Structure

```
src/
├── domain/
│   ├── models/ImageGen.ts                    # Types and constants
│   └── interfaces/IImageProviderService.ts   # Provider interface
├── application/
│   └── dto/image.dto.ts                      # Data transfer objects
├── infrastructure/
│   └── services/ai/
│       ├── BaseImageProvider.ts              # Abstract base class
│       ├── OpenAIImageProvider.ts            # DALL-E 3 implementation
│       ├── GeminiImageProvider.ts            # Imagen 3 implementation
│       ├── ImageProviderFactory.ts           # Factory for providers
│       └── index.ts
├── app/
│   ├── api/image/
│   │   ├── route.ts                          # Image generation endpoint
│   │   └── providers/route.ts                # Providers list endpoint
│   └── (dashboard)/image-gen/page.tsx        # Image generation page
└── presentation/
    ├── providers/ImageGenProvider.tsx        # Image state management
    ├── hooks/
    │   ├── useGenerateImage.ts               # Generate image hook
    │   └── useImageProviders.ts              # Fetch providers hook
    └── components/image-gen/
        ├── ImageDisplay.tsx                  # Image display with download
        ├── ImageGenInput.tsx                 # Prompt input field
        ├── ImageProviderSetup.tsx            # Setup instructions
        ├── ImageProviderSelector.tsx         # Provider dropdown
        └── index.ts
```

## Key Components

### Domain Layer

#### ImageGen.ts
Defines the core types:
```typescript
type ImageProviderType = 'openai' | 'gemini';

interface GeneratedImage {
  url: string;
  revisedPrompt?: string;
}

interface ImageGenOptions {
  size?: ImageSize;
  n?: number;
}

interface ImageProviderConfig {
  type: ImageProviderType;
  name: string;
  description: string;
  docsUrl: string;
  apiKeyEnvVar: string;
  apiKeyInstructions: string[];
  modelName: string;
}
```

#### IImageProviderService.ts
The interface all providers must implement:
```typescript
interface IImageProviderService {
  readonly type: ImageProviderType;
  readonly modelName: string;
  isConfigured(): boolean;
  generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage>;
}
```

### Infrastructure Layer

#### Provider Implementation Pattern
Each provider extends `BaseImageProvider` and implements `generateImage`:

```typescript
export class MyImageProvider extends BaseImageProvider {
  readonly type: ImageProviderType = 'mytype';
  readonly modelName = 'model-name';

  constructor() {
    super('MY_API_KEY');
  }

  async generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage> {
    const apiKey = this.getApiKey();

    // 1. Make API request to image generation service
    // 2. Parse response
    // 3. Return GeneratedImage with URL

    return {
      url: imageUrl,
      revisedPrompt: revisedPrompt,
    };
  }
}
```

#### ImageProviderFactory
Factory pattern for managing providers:
```typescript
// Get a specific provider
const openai = ImageProviderFactory.getProvider('openai');

// Get the first configured provider
const defaultProvider = ImageProviderFactory.getDefaultProvider();

// Check if any provider is configured
if (ImageProviderFactory.hasAnyConfigured()) {
  // At least one provider has an API key
}

// Get all providers with status
const providers = ImageProviderFactory.getConfiguredProviders();
```

### API Layer

#### POST /api/image
Image generation endpoint returning JSON:

**Request:**
```json
{
  "prompt": "A futuristic city at sunset with flying cars",
  "size": "1024x1024",
  "provider": "openai"
}
```

**Response:**
```json
{
  "image": {
    "url": "https://...",
    "revisedPrompt": "A detailed futuristic cityscape..."
  },
  "provider": "openai",
  "requestId": "req_abc123"
}
```

**Error Response:**
```json
{
  "error": {
    "code": "NO_PROVIDER_CONFIGURED",
    "message": "No image provider is configured.",
    "instructions": ["...setup steps..."],
    "requestId": "req_abc123"
  }
}
```

#### GET /api/image/providers
Returns available providers and their configuration status:

**Response:**
```json
{
  "providers": [
    {
      "type": "openai",
      "name": "OpenAI DALL-E 3",
      "isConfigured": true,
      "description": "High quality image generation...",
      "modelName": "dall-e-3"
    },
    {
      "type": "gemini",
      "name": "Google Imagen 3",
      "isConfigured": false,
      ...
    }
  ],
  "defaultProvider": "openai",
  "hasAnyConfigured": true
}
```

### Presentation Layer

#### ImageGenProvider
React context for managing image generation state:
```typescript
const {
  generatedImage,       // Current generated image
  isLoading,            // Loading state
  error,                // Error message
  currentProvider,      // Selected provider
  availableProviders,   // All providers with status
  hasConfiguredProvider,// Whether any provider is ready
  setGeneratedImage,    // Set the image
  clearImage,           // Clear current image
  setCurrentProvider,   // Switch provider
} = useImageGenContext();
```

#### useGenerateImage Hook
Handles the complete generation flow:
```typescript
const { generateImage, isLoading } = useGenerateImage();

// Generates image, handles response, updates state
await generateImage({
  prompt: "A mountain landscape",
  size: "1024x1024"
});
```

## Adding a New Image Provider

### Step 1: Update Domain Models

Add your provider type to `src/domain/models/ImageGen.ts`:

```typescript
export type ImageProviderType = 'openai' | 'gemini' | 'newprovider';

export const IMAGE_PROVIDERS: Record<ImageProviderType, ImageProviderConfig> = {
  // ... existing providers
  newprovider: {
    type: 'newprovider',
    name: 'New Provider Name',
    description: 'Description of the provider',
    docsUrl: 'https://docs.newprovider.com/api-keys',
    apiKeyEnvVar: 'NEWPROVIDER_API_KEY',
    modelName: 'model-name',
    apiKeyInstructions: [
      'Go to https://newprovider.com/api-keys',
      'Create an account or sign in',
      'Generate a new API key',
      'Add to .env.local: NEWPROVIDER_API_KEY=your-key',
    ],
  },
};

export const IMAGE_PROVIDER_PRIORITY: ImageProviderType[] = [
  'openai', 'gemini', 'newprovider'
];
```

### Step 2: Create Provider Implementation

Create `src/infrastructure/services/ai/NewProviderImageProvider.ts`:

```typescript
import { BaseImageProvider } from './BaseImageProvider';
import { ImageProviderType, GeneratedImage, ImageGenOptions } from '@/domain/models';

export class NewProviderImageProvider extends BaseImageProvider {
  readonly type: ImageProviderType = 'newprovider';
  readonly modelName = 'model-name';

  constructor() {
    super('NEWPROVIDER_API_KEY');
  }

  async generateImage(prompt: string, options?: ImageGenOptions): Promise<GeneratedImage> {
    const apiKey = this.getApiKey();

    const response = await fetch('https://api.newprovider.com/v1/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        size: options?.size || '1024x1024',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || 'Image generation failed');
    }

    const data = await response.json();

    return {
      url: data.url,
      revisedPrompt: data.revised_prompt,
    };
  }
}
```

### Step 3: Register in Factory

Update `src/infrastructure/services/ai/ImageProviderFactory.ts`:

```typescript
import { NewProviderImageProvider } from './NewProviderImageProvider';

private static createProvider(type: ImageProviderType): IImageProviderService {
  switch (type) {
    case 'openai':
      return new OpenAIImageProvider();
    case 'gemini':
      return new GeminiImageProvider();
    case 'newprovider':
      return new NewProviderImageProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
```

### Step 4: Export Provider

Update `src/infrastructure/services/ai/index.ts`:
```typescript
export { NewProviderImageProvider } from './NewProviderImageProvider';
```

### Step 5: Update Validation Schema

Update `src/infrastructure/security/validation/requestValidator.ts`:
```typescript
export const imageRequestSchema = z.object({
  prompt: z.string().min(1).max(LIMITS.image.maxPromptLength),
  size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).optional(),
  provider: z.enum(['openai', 'gemini', 'newprovider'] as const).optional(),
});
```

## Security

The Image Generation feature uses the same security infrastructure as AI Chat.

### Security Features

#### 1. Rate Limiting
- **Per-IP**: 10 requests/minute
- Returns 429 with `Retry-After` header when limited

#### 2. Input Validation
- Maximum prompt length: 1,000 characters
- Maximum request body: 1MB
- Zod schema validation

#### 3. Prompt Injection Protection
Same patterns as chat - detects and blocks injection attempts in image prompts.

#### 4. Output Filtering
The `revisedPrompt` field is filtered for sensitive data before returning.

### Security Middleware

The image route uses `withSecurity`:

```typescript
export const POST = withSecurity<ValidatedImageRequest>(
  {
    modality: 'image-generation',
    validateInput: true,
    timeout: 60000, // Images take longer
  },
  async (request, body) => {
    // Handler receives validated, sanitized input
  }
);
```

## Provider Details

### OpenAI DALL-E 3

| Property | Value |
|----------|-------|
| Model | `dall-e-3` |
| Endpoint | `https://api.openai.com/v1/images/generations` |
| Sizes | 1024x1024, 1792x1024, 1024x1792 |
| Auth | Bearer token |
| Response | URL to generated image |

### Google Imagen 3

| Property | Value |
|----------|-------|
| Model | `imagen-3.0-generate-002` |
| Endpoint | `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict` |
| Aspect Ratios | 1:1, 3:4, 4:3, 9:16, 16:9 |
| Auth | `x-goog-api-key` header |
| Response | Base64 encoded image |

**Note:** Imagen 3 requires a Google Cloud project with billing enabled and the Generative Language API activated.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key (for DALL-E 3) | No* |
| `GEMINI_API_KEY` | Google Gemini API key (for Imagen 3) | No* |
| `IMAGE_PROVIDER` | Force specific provider | No |

*At least one provider API key is required for image generation.

## Testing

### Manual Testing
1. Configure at least one provider API key
2. Navigate to `/image-gen`
3. Enter a prompt and click Generate
4. Verify image appears
5. Test download functionality
6. Test provider switching (if multiple configured)
7. Test error handling (invalid API key, empty prompt)

### Example Prompts
- "A serene mountain landscape at golden hour"
- "A futuristic cityscape with neon lights"
- "A cozy coffee shop interior with warm lighting"
- "An astronaut riding a horse on Mars"

## Troubleshooting

### Common Issues

#### "No image provider is configured"
- Ensure you have `OPENAI_API_KEY` or `GEMINI_API_KEY` in `.env.local`
- Restart the development server after adding keys

#### "Image generation service error"
- Check API key is valid
- Verify billing is enabled on your account
- Check API rate limits haven't been exceeded

#### Imagen 3 returns 403/404
- Imagen 3 requires Google Cloud billing
- The Generative Language API must be enabled
- Try using OpenAI DALL-E instead

#### Images not displaying
- Check browser console for CORS errors
- Verify the image URL is accessible
- For base64 images, check the data URL format
