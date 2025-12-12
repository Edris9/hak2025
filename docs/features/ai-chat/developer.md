# AI Chat - Developer Documentation

## Overview

The AI Chat feature is built following Clean Architecture principles, making it easy to understand, extend, and maintain. It supports multiple AI providers with a plug-and-play architecture.

## Architecture

```
AI Chat Feature
├── Domain Layer
│   ├── Chat Model (AIProviderType, ChatMessage, AIProviderConfig)
│   └── IAIProviderService Interface
├── Application Layer
│   └── Chat DTOs (SendMessageRequest, ChatStreamEvent, etc.)
├── Infrastructure Layer
│   ├── BaseAIProvider (abstract class)
│   ├── Provider Implementations (Gemini, OpenAI, Mistral, Anthropic)
│   └── AIProviderFactory
├── API Layer
│   ├── /api/chat (POST - streaming)
│   └── /api/chat/providers (GET)
└── Presentation Layer
    ├── ChatProvider (context)
    ├── Hooks (useSendMessage, useProviders)
    └── Components (ChatMessages, ChatInput, etc.)
```

## File Structure

```
src/
├── domain/
│   ├── models/Chat.ts                    # Types and constants
│   └── interfaces/IAIProviderService.ts  # Provider interface
├── application/
│   └── dto/chat.dto.ts                   # Data transfer objects
├── infrastructure/
│   └── services/ai/
│       ├── BaseAIProvider.ts             # Abstract base class
│       ├── GeminiProvider.ts             # Google AI implementation
│       ├── OpenAIProvider.ts             # OpenAI implementation
│       ├── MistralProvider.ts            # Mistral implementation
│       ├── AnthropicProvider.ts          # Anthropic implementation
│       ├── AIProviderFactory.ts          # Factory for providers
│       └── index.ts
├── app/
│   ├── api/chat/
│   │   ├── route.ts                      # Chat streaming endpoint
│   │   └── providers/route.ts            # Providers list endpoint
│   └── (dashboard)/chat/page.tsx         # Chat page
└── presentation/
    ├── providers/ChatProvider.tsx        # Chat state management
    ├── hooks/
    │   ├── useSendMessage.ts             # Send message hook
    │   └── useProviders.ts               # Fetch providers hook
    ├── utils/chat-validation.ts          # Validation schemas
    └── components/chat/
        ├── ChatMessages.tsx              # Message list
        ├── ChatInput.tsx                 # Input field
        ├── ProviderSetup.tsx             # Setup instructions
        ├── ProviderSelector.tsx          # Provider dropdown
        └── index.ts
```

## Key Components

### Domain Layer

#### Chat.ts
Defines the core types:
```typescript
type AIProviderType = 'gemini' | 'openai' | 'mistral' | 'anthropic';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  provider?: AIProviderType;
}

interface AIProviderConfig {
  type: AIProviderType;
  name: string;
  description: string;
  docsUrl: string;
  apiKeyEnvVar: string;
  apiKeyInstructions: string[];
  modelName: string;
}
```

#### IAIProviderService.ts
The interface all providers must implement:
```typescript
interface IAIProviderService {
  readonly type: AIProviderType;
  readonly modelName: string;
  isConfigured(): boolean;
  sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void>;
}
```

### Infrastructure Layer

#### Provider Implementation Pattern
Each provider extends `BaseAIProvider` and implements `sendMessage`:

```typescript
export class MyProvider extends BaseAIProvider {
  constructor() {
    super('mytype', process.env.MY_API_KEY);
  }

  async sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    // 1. Format messages for the provider's API
    // 2. Make streaming request
    // 3. Parse streaming response
    // 4. Call callbacks.onToken() for each token
    // 5. Call callbacks.onComplete() when done
    // 6. Call callbacks.onError() on errors
  }
}
```

#### AIProviderFactory
Factory pattern for managing providers:
```typescript
// Get a specific provider
const openai = AIProviderFactory.getProvider('openai');

// Get the first configured provider
const defaultProvider = AIProviderFactory.getDefaultProvider();

// Check if any provider is configured
if (AIProviderFactory.hasAnyConfigured()) {
  // At least one provider has an API key
}
```

### API Layer

#### POST /api/chat
Streaming chat endpoint using Server-Sent Events (SSE):

**Request:**
```json
{
  "message": "Hello, AI!",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ],
  "provider": "openai"  // optional
}
```

**Response (SSE stream):**
```
data: {"type":"token","data":"Hello","provider":"openai"}
data: {"type":"token","data":"!","provider":"openai"}
data: {"type":"complete","data":"Hello!","provider":"openai"}
```

#### GET /api/chat/providers
Returns available providers and their configuration status:

**Response:**
```json
{
  "providers": [
    {
      "type": "anthropic",
      "name": "Anthropic Claude",
      "isConfigured": true,
      ...
    },
    ...
  ],
  "defaultProvider": "anthropic",
  "hasAnyConfigured": true
}
```

### Presentation Layer

#### ChatProvider
React context for managing chat state:
```typescript
const {
  messages,           // Current messages
  isLoading,          // Loading state
  currentProvider,    // Selected provider
  addMessage,         // Add a message
  clearMessages,      // Clear chat
} = useChatContext();
```

#### useSendMessage Hook
Handles the complete send flow:
```typescript
const { sendMessage, isLoading } = useSendMessage();

// Sends message, handles streaming, updates state
await sendMessage("Hello!");
```

## Adding a New AI Provider

### Step 1: Update Domain Models

Add your provider type to `src/domain/models/Chat.ts`:

```typescript
export type AIProviderType = 'gemini' | 'openai' | 'mistral' | 'anthropic' | 'newprovider';

export const AI_PROVIDERS: Record<AIProviderType, AIProviderConfig> = {
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

export const PROVIDER_PRIORITY: AIProviderType[] = [
  'anthropic', 'openai', 'gemini', 'mistral', 'newprovider'
];
```

### Step 2: Create Provider Implementation

Create `src/infrastructure/services/ai/NewProviderProvider.ts`:

```typescript
import { ChatMessage } from '@/domain/models';
import { StreamCallbacks } from '@/domain/interfaces';
import { BaseAIProvider } from './BaseAIProvider';

export class NewProviderProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://api.newprovider.com/v1/chat';

  constructor() {
    super('newprovider', process.env.NEWPROVIDER_API_KEY);
  }

  async sendMessage(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    if (!this.apiKey) {
      callbacks.onError(new Error('New Provider API key not configured'));
      return;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: this.formatMessages(messages),
          stream: true,
        }),
      });

      // Handle streaming response...
      // Parse SSE events and call callbacks

      callbacks.onComplete(fullResponse);
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
```

### Step 3: Register in Factory

Update `src/infrastructure/services/ai/AIProviderFactory.ts`:

```typescript
import { NewProviderProvider } from './NewProviderProvider';

private static createProvider(type: AIProviderType): IAIProviderService {
  switch (type) {
    // ... existing cases
    case 'newprovider':
      return new NewProviderProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
```

### Step 4: Export Provider

Update `src/infrastructure/services/ai/index.ts`:
```typescript
export { NewProviderProvider } from './NewProviderProvider';
```

### Step 5: Update Environment

Add to `.env.example`:
```bash
# Get your API key from: https://newprovider.com/api-keys
NEWPROVIDER_API_KEY=
```

## Streaming Implementation Details

### Server-Side (API Route)
```typescript
const stream = new ReadableStream({
  async start(controller) {
    const encoder = new TextEncoder();

    await provider.sendMessage(messages, {
      onToken: (token) => {
        const event = JSON.stringify({ type: 'token', data: token });
        controller.enqueue(encoder.encode(`data: ${event}\n\n`));
      },
      onComplete: (full) => {
        const event = JSON.stringify({ type: 'complete', data: full });
        controller.enqueue(encoder.encode(`data: ${event}\n\n`));
        controller.close();
      },
      onError: (error) => {
        const event = JSON.stringify({ type: 'error', data: error.message });
        controller.enqueue(encoder.encode(`data: ${event}\n\n`));
        controller.close();
      },
    });
  },
});

return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
});
```

### Client-Side (Hook)
```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let fullContent = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

  for (const line of lines) {
    const event = JSON.parse(line.replace('data:', '').trim());
    if (event.type === 'token') {
      fullContent += event.data;
      updateLastAssistantMessage(fullContent);
    }
  }
}
```

## Testing

### Manual Testing
1. Configure at least one provider API key
2. Navigate to `/chat`
3. Send messages and verify streaming works
4. Test provider switching (if multiple configured)
5. Test error handling (invalid API key, network issues)

### E2E Testing
Add tests in `tests/e2e/chat.spec.ts`:
```typescript
test.describe('AI Chat', () => {
  test('shows setup instructions when no provider configured', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.getByText('No AI Provider Configured')).toBeVisible();
  });

  test('sends message and receives streaming response', async ({ page }) => {
    // This requires a configured provider in test environment
    await page.goto('/chat');
    await page.fill('textarea', 'Hello');
    await page.click('button[type="submit"]');
    // Verify response appears
  });
});
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key (Claude Sonnet 4.5) | No* |
| `OPENAI_API_KEY` | OpenAI API key (GPT-4.1 mini) | No* |
| `GEMINI_API_KEY` | Google Gemini API key (Gemini 2.0 Flash) | No* |
| `MISTRAL_API_KEY` | Mistral API key (Mistral Small) | No* |
| `AI_PROVIDER` | Force specific provider | No |

*At least one provider API key is required for the chat to function.

## Model Versions (Updated December 2025)

| Provider | Model Name | Notes |
|----------|------------|-------|
| Anthropic | `claude-sonnet-4-5-20250929` | Claude 4.5 series |
| OpenAI | `gpt-4.1-mini` | Replaced GPT-4o |
| Google | `gemini-2.0-flash` | Gemini 1.5 retired |
| Mistral | `mistral-small-latest` | Auto-updating alias |

## Security

The AI Chat feature includes comprehensive security measures to protect against common attack vectors.

### Security Architecture

```
src/infrastructure/security/
├── errors/
│   └── sanitizedErrors.ts     # Safe error responses
├── validation/
│   ├── requestValidator.ts    # Size limits, schema validation
│   ├── inputSanitizer.ts      # Prompt injection protection
│   ├── outputFilter.ts        # Sensitive data filtering
│   └── systemPromptProtection.ts  # System prompt defense
├── middleware/
│   ├── rateLimiter.ts         # Rate limiting logic
│   └── withSecurity.ts        # Security HOF wrapper
└── index.ts                   # Centralized exports
```

### Security Features

#### 1. Rate Limiting
- **Per-IP**: 30 requests/minute (anonymous users)
- **Per-User**: 60 requests/minute (authenticated users - reserved for future)
- In-memory sliding window implementation
- Edge middleware (`src/middleware.ts`) provides first-line defense
- Returns 429 with `Retry-After` header when limited

#### 2. Input Validation
- Maximum message length: 10,000 characters
- Maximum history: 50 messages
- Maximum request body: 1MB
- Zod schema validation for all requests
- Early rejection of oversized requests

#### 3. Prompt Injection Protection
Detects and blocks common injection patterns:
- Instruction override attempts ("ignore previous instructions")
- Role manipulation ("you are now a different AI")
- Prompt extraction attempts ("reveal your system prompt")
- Delimiter injection attempts

The sanitizer:
- Removes control characters
- Limits consecutive newlines
- Flags suspicious patterns for monitoring
- Blocks confirmed injection attempts

#### 4. Output Filtering
Automatically redacts sensitive data from AI responses:
- API keys (patterns: `sk-*`, `sk-ant-*`, `AIza*`, etc.)
- File paths (Windows and Unix)
- Internal IP addresses (192.168.x.x, 10.x.x.x, etc.)
- Database connection strings
- AWS/Azure secrets

#### 5. System Prompt Protection
System prompts are wrapped with defensive instructions:
```typescript
const securePrompt = wrapSystemPrompt(
  'You are a helpful AI assistant.'
);
// Adds instructions to never reveal system prompt or change persona
```

#### 6. Error Sanitization
Internal errors are never exposed to clients:
- Stack traces are filtered
- File paths are removed
- Provider-specific errors are generalized
- Each error gets a unique `requestId` for tracking

### Security Middleware

The `withSecurity` HOF wraps route handlers:

```typescript
export const POST = withSecurity<ValidatedChatRequest>(
  {
    modality: 'text-chat',
    validateInput: true,
    requireAuth: false, // Workshop convenience
  },
  async (request, body) => {
    // Handler receives validated, sanitized input
  }
);
```

The middleware automatically:
1. Generates unique request ID
2. Validates request size
3. Applies rate limiting
4. Parses and validates body
5. Sanitizes input for injection
6. Executes handler with timeout
7. Catches and sanitizes errors

### Rate Limit Configuration

| Modality | Per-IP | Per-User (Future) |
|----------|--------|-------------------|
| text-chat | 30/min | 60/min |
| image-generation | 10/min | 20/min |
| text-to-speech | 20/min | 40/min |

### Security Headers

Edge middleware adds security headers to all responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Request-ID: <uuid>` (for tracking)
- `X-RateLimit-Remaining: <number>`

### Adding Security to New Modalities

When adding image generation or TTS, use the same security patterns:

```typescript
// Image generation route
export const POST = withSecurity<ValidatedImageRequest>(
  { modality: 'image-generation', validateInput: true },
  async (request, body) => {
    // body is validated and sanitized
  }
);
```

Validation schemas for new modalities are pre-defined:
- `imageRequestSchema` - for image generation
- `ttsRequestSchema` - for text-to-speech

### Monitoring

Security events are logged with request IDs:
```
[req_abc123] Suspicious input detected: delimiter_injection
[req_def456] Rate limit exceeded for IP: 203.0.113.50
[req_ghi789] Provider error sanitized: OpenAI API timeout
```

Use request IDs to trace issues without exposing internal details to users.

### Production Recommendations

For production deployments:
1. **Replace in-memory rate limiter** with Redis or Vercel KV
2. **Add authentication** for higher rate limits
3. **Enable CORS** for specific origins only
4. **Use WAF** (Web Application Firewall) for additional protection
5. **Monitor security logs** for patterns
