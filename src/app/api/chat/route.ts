import { NextRequest } from 'next/server';
import { AIProviderFactory } from '@/infrastructure/services/ai';
import { AI_PROVIDERS, createChatMessage, ChatMessage } from '@/domain/models';
import { SendMessageRequest, ChatErrorResponse } from '@/application/dto';

/**
 * POST /api/chat
 *
 * Send a message to the AI and receive a streaming response.
 * Uses Server-Sent Events (SSE) for real-time token streaming.
 *
 * Request body:
 * - message: The user's message
 * - history: Previous messages in the conversation
 * - provider: (optional) Specific provider to use
 *
 * Response:
 * - Stream of SSE events with type: 'token' | 'complete' | 'error'
 */
export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    const { message, history, provider: requestedProvider } = body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      const errorResponse: ChatErrorResponse = {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Message is required',
        },
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the provider
    let provider;
    if (requestedProvider) {
      provider = AIProviderFactory.getProvider(requestedProvider);
      if (!provider.isConfigured()) {
        const config = AI_PROVIDERS[requestedProvider];
        const errorResponse: ChatErrorResponse = {
          error: {
            code: 'NO_PROVIDER_CONFIGURED',
            message: `${config.name} is not configured. Please add your API key.`,
            instructions: config.apiKeyInstructions,
          },
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
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

      const errorResponse: ChatErrorResponse = {
        error: {
          code: 'NO_PROVIDER_CONFIGURED',
          message:
            'No AI provider is configured. Please add an API key for at least one provider.',
          instructions: allInstructions,
        },
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build conversation history
    const messages: ChatMessage[] = [
      ...(history || []).map((msg) =>
        createChatMessage(msg.role, msg.content)
      ),
      createChatMessage('user', message.trim()),
    ];

    // Create a streaming response using SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (type: string, data: string) => {
          const event = JSON.stringify({ type, data, provider: provider!.type });
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
              sendEvent('error', error.message);
              controller.close();
            },
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          sendEvent('error', errorMessage);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorResponse: ChatErrorResponse = {
      error: {
        code: 'PROVIDER_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
