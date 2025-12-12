import { AIProviderFactory } from '@/infrastructure/services/ai';
import { AI_PROVIDERS, createChatMessage, ChatMessage } from '@/domain/models';
import {
  withSecurity,
  SecureRequest,
  ValidatedChatRequest,
  filterOutput,
  wrapSystemPrompt,
} from '@/infrastructure/security';

/**
 * POST /api/chat
 *
 * Secure AI chat endpoint with:
 * - Rate limiting (30 req/min per IP)
 * - Input validation (max 10K chars, max 50 history messages)
 * - Prompt injection protection
 * - Output filtering (sensitive data redaction)
 * - Sanitized error responses
 *
 * Request body:
 * - message: The user's message (required, max 10000 chars)
 * - history: Previous messages in the conversation (optional, max 50)
 * - provider: Specific provider to use (optional)
 *
 * Response:
 * - Stream of SSE events with type: 'token' | 'complete' | 'error'
 * - X-Request-ID header for request tracking
 * - X-RateLimit-Remaining header showing remaining quota
 */
export const POST = withSecurity<ValidatedChatRequest>(
  {
    modality: 'text-chat',
    validateInput: true,
    requireAuth: false, // Anonymous access for workshop convenience
  },
  async (request: SecureRequest, body: ValidatedChatRequest) => {
    const { message, history, provider: requestedProvider } = body;
    const { requestId } = request;

    // Get the provider
    let provider;
    if (requestedProvider) {
      provider = AIProviderFactory.getProvider(requestedProvider);
      if (!provider.isConfigured()) {
        const config = AI_PROVIDERS[requestedProvider];
        return new Response(
          JSON.stringify({
            error: {
              code: 'NO_PROVIDER_CONFIGURED',
              message: `${config.name} is not configured. Please add your API key.`,
              requestId,
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      provider = AIProviderFactory.getDefaultProvider();
    }

    // If no provider is configured, return helpful instructions
    if (!provider) {
      const allInstructions = Object.values(AI_PROVIDERS).flatMap((config) => [
        `--- ${config.name} ---`,
        ...config.apiKeyInstructions,
        '',
      ]);

      return new Response(
        JSON.stringify({
          error: {
            code: 'NO_PROVIDER_CONFIGURED',
            message: 'No AI provider is configured. Please add an API key for at least one provider.',
            instructions: allInstructions,
            requestId,
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Build conversation with protected system prompt
    const systemPrompt = wrapSystemPrompt(
      'You are a helpful AI assistant. Answer questions accurately and helpfully.'
    );

    const messages: ChatMessage[] = [
      createChatMessage('system', systemPrompt),
      ...(history || []).map((msg) => createChatMessage(msg.role, msg.content)),
      createChatMessage('user', message),
    ];

    // Create a streaming response using SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (type: string, data: string) => {
          // Filter output to remove sensitive data
          const filteredData = type === 'token' || type === 'complete'
            ? filterOutput(data)
            : data;

          const event = JSON.stringify({
            type,
            data: filteredData,
            provider: provider!.type,
            requestId,
          });
          controller.enqueue(encoder.encode(`data: ${event}\n\n`));
        };

        try {
          await provider!.sendMessage(messages, {
            onToken: (token) => {
              sendEvent('token', token);
            },
            onComplete: (fullResponse) => {
              sendEvent('complete', fullResponse);
              controller.close();
            },
            onError: (error) => {
              // Never expose raw error messages
              console.error(`[${requestId}] Provider error:`, error);
              sendEvent('error', 'An error occurred while generating the response.');
              controller.close();
            },
          });
        } catch (error) {
          // Never expose raw error messages
          console.error(`[${requestId}] Stream error:`, error);
          sendEvent('error', 'An error occurred. Please try again.');
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Request-ID': requestId,
      },
    });
  }
);
