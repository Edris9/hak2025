/**
 * Request Validation
 *
 * Validates and limits request sizes to prevent:
 * - Memory exhaustion attacks
 * - Large payload DoS
 * - History accumulation attacks
 */

import { z } from 'zod';

/**
 * Security limits for requests
 */
export const LIMITS = {
  message: {
    maxLength: 10000, // 10K characters
    maxBytes: 50000, // ~50KB
  },
  history: {
    maxMessages: 50, // Max conversation history
    maxMessageLength: 10000, // Per message in history
    maxTotalBytes: 500000, // ~500KB total
  },
  request: {
    maxBodySize: 1000000, // 1MB max request body
    timeoutMs: 30000, // 30 second timeout
  },
  image: {
    maxPromptLength: 1000, // Image prompt limit
  },
  tts: {
    maxTextLength: 5000, // TTS text limit
  },
};

/**
 * Chat message schema
 */
const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z
    .string()
    .max(LIMITS.history.maxMessageLength, `Message exceeds ${LIMITS.history.maxMessageLength} characters`),
});

/**
 * Validated chat request schema
 */
export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(LIMITS.message.maxLength, `Message exceeds ${LIMITS.message.maxLength} characters`),
  history: z
    .array(chatMessageSchema)
    .max(LIMITS.history.maxMessages, `History exceeds ${LIMITS.history.maxMessages} messages`)
    .optional()
    .default([]),
  provider: z
    .enum(['anthropic', 'openai', 'gemini', 'mistral'] as const)
    .optional(),
});

export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * Image generation request schema (for future use)
 */
export const imageRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(LIMITS.image.maxPromptLength, `Prompt exceeds ${LIMITS.image.maxPromptLength} characters`),
  size: z.enum(['256x256', '512x512', '1024x1024']).optional().default('512x512'),
  n: z.number().min(1).max(4).optional().default(1),
  provider: z.enum(['openai', 'stability'] as const).optional(),
});

export type ValidatedImageRequest = z.infer<typeof imageRequestSchema>;

/**
 * Text-to-speech request schema (for future use)
 */
export const ttsRequestSchema = z.object({
  text: z
    .string()
    .min(1, 'Text is required')
    .max(LIMITS.tts.maxTextLength, `Text exceeds ${LIMITS.tts.maxTextLength} characters`),
  voice: z.string().optional(),
  speed: z.number().min(0.5).max(2.0).optional().default(1.0),
  provider: z.enum(['openai', 'elevenlabs', 'google'] as const).optional(),
});

export type ValidatedTTSRequest = z.infer<typeof ttsRequestSchema>;

/**
 * Validate request size before parsing body
 * Returns false if request is too large
 */
export function validateRequestSize(request: Request): boolean {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > LIMITS.request.maxBodySize) {
      return false;
    }
  }
  return true;
}

/**
 * Calculate approximate byte size of history
 */
export function calculateHistorySize(
  history: Array<{ role: string; content: string }>
): number {
  return history.reduce((total, msg) => {
    return total + msg.role.length + msg.content.length;
  }, 0);
}

/**
 * Validate history doesn't exceed byte limit
 */
export function validateHistorySize(
  history: Array<{ role: string; content: string }>
): boolean {
  const size = calculateHistorySize(history);
  return size <= LIMITS.history.maxTotalBytes;
}

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate chat request with all checks
 */
export function validateChatRequest(body: unknown): ValidationResult<ValidatedChatRequest> {
  // Schema validation
  const result = chatRequestSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || 'Invalid request',
    };
  }

  // History size validation
  if (result.data.history && !validateHistorySize(result.data.history)) {
    return {
      success: false,
      error: 'Conversation history is too large',
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
