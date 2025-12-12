/**
 * Security Middleware Wrapper
 *
 * Higher-order function that wraps API route handlers with security features:
 * - Request ID generation
 * - Request size validation
 * - Rate limiting
 * - Input validation
 * - Prompt injection detection
 * - Error sanitization
 * - Request timeout
 */

import { NextRequest } from 'next/server';
import { AIModality } from '../../services/ai/types/modalities';
import {
  generateRequestId,
  sanitizeError,
  createErrorResponse,
  getStatusCode,
  SecurityErrorCode,
  SanitizedError,
} from '../errors/sanitizedErrors';
import {
  validateRequestSize,
  validateChatRequest,
  validateImageRequest,
  validateTTSRequest,
  ValidatedChatRequest,
  ValidatedImageRequest,
  ValidatedTTSRequest,
  LIMITS,
} from '../validation/requestValidator';
import {
  sanitizePrompt,
  logSanitizationResult,
} from '../validation/inputSanitizer';
import {
  rateLimitByIP,
  extractClientIP,
  createRateLimitHeaders,
} from './rateLimiter';

/**
 * Security configuration for route handlers
 */
export interface SecurityConfig {
  /** Whether to require authentication */
  requireAuth?: boolean;
  /** AI modality for rate limiting */
  modality: AIModality;
  /** Whether to validate and sanitize input */
  validateInput?: boolean;
  /** Custom timeout in ms (default: 30000) */
  timeout?: number;
}

/**
 * Extended request with security context
 */
export interface SecureRequest extends NextRequest {
  /** Unique request ID */
  requestId: string;
  /** Client IP address */
  clientIP: string;
  /** User ID if authenticated */
  userId?: string;
}

/**
 * Handler function type
 */
type SecureHandler<T = unknown> = (
  request: SecureRequest,
  validatedBody: T
) => Promise<Response>;

/**
 * Create a 429 Rate Limited response
 */
function createRateLimitResponse(
  requestId: string,
  retryAfter: number
): Response {
  const error: SanitizedError = {
    code: SecurityErrorCode.RATE_LIMITED,
    message: 'Too many requests. Please slow down.',
    retryable: true,
    retryAfter,
  };

  return new Response(
    JSON.stringify(createErrorResponse(error, requestId)),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'Retry-After': String(retryAfter),
      },
    }
  );
}

/**
 * Create a 400 Bad Request response
 */
function createBadRequestResponse(
  requestId: string,
  message: string
): Response {
  const error: SanitizedError = {
    code: SecurityErrorCode.INVALID_REQUEST,
    message,
    retryable: false,
  };

  return new Response(
    JSON.stringify(createErrorResponse(error, requestId)),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
    }
  );
}

/**
 * Create a content blocked response
 */
function createBlockedResponse(requestId: string): Response {
  const error: SanitizedError = {
    code: SecurityErrorCode.CONTENT_BLOCKED,
    message: 'Your message could not be processed.',
    retryable: false,
  };

  return new Response(
    JSON.stringify(createErrorResponse(error, requestId)),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
    }
  );
}

/**
 * Wrap an API handler with security middleware
 *
 * @param config - Security configuration
 * @param handler - Route handler function
 * @returns Wrapped handler with security features
 *
 * @example
 * ```typescript
 * export const POST = withSecurity(
 *   { modality: 'text-chat', validateInput: true },
 *   async (request, body) => {
 *     // Handle request with validated body
 *     return new Response('OK');
 *   }
 * );
 * ```
 */
export function withSecurity<T = ValidatedChatRequest>(
  config: SecurityConfig,
  handler: SecureHandler<T>
): (request: NextRequest) => Promise<Response> {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requireAuth = false, // Reserved for future authentication
    modality,
    validateInput = true,
    timeout = LIMITS.request.timeoutMs,
  } = config;

  return async (request: NextRequest): Promise<Response> => {
    const requestId = generateRequestId();
    const clientIP = extractClientIP(request);

    try {
      // 1. Validate request size (before parsing body)
      if (!validateRequestSize(request)) {
        return createBadRequestResponse(requestId, 'Request body too large');
      }

      // 2. Rate limiting (IP-based for now)
      const rateLimitResult = rateLimitByIP(clientIP, modality);
      if (!rateLimitResult.allowed) {
        return createRateLimitResponse(requestId, rateLimitResult.retryAfter);
      }

      // 3. Parse request body
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return createBadRequestResponse(requestId, 'Invalid JSON body');
      }

      // 4. Validate request body
      let validatedBody: T;
      if (validateInput) {
        if (modality === 'text-chat') {
          const validation = validateChatRequest(body);
          if (!validation.success) {
            return createBadRequestResponse(
              requestId,
              validation.error || 'Invalid request'
            );
          }
          validatedBody = validation.data as T;
        } else if (modality === 'image-generation') {
          const validation = validateImageRequest(body);
          if (!validation.success) {
            return createBadRequestResponse(
              requestId,
              validation.error || 'Invalid request'
            );
          }
          validatedBody = validation.data as T;
        } else if (modality === 'text-to-speech') {
          const validation = validateTTSRequest(body);
          if (!validation.success) {
            return createBadRequestResponse(
              requestId,
              validation.error || 'Invalid request'
            );
          }
          validatedBody = validation.data as T;
        } else {
          validatedBody = body as T;
        }
      } else {
        validatedBody = body as T;
      }

      // 5. Prompt injection check (for text chat and image generation)
      if (validateInput && validatedBody) {
        if (
          modality === 'text-chat' &&
          typeof (validatedBody as unknown as ValidatedChatRequest).message === 'string'
        ) {
          const chatBody = validatedBody as unknown as ValidatedChatRequest;
          const sanitizationResult = sanitizePrompt(chatBody.message);

          // Log any flags for monitoring
          logSanitizationResult(requestId, sanitizationResult);

          // Block if injection detected
          if (sanitizationResult.blocked) {
            return createBlockedResponse(requestId);
          }

          // Use sanitized message
          chatBody.message = sanitizationResult.sanitized;
        } else if (
          modality === 'image-generation' &&
          typeof (validatedBody as unknown as ValidatedImageRequest).prompt === 'string'
        ) {
          const imageBody = validatedBody as unknown as ValidatedImageRequest;
          const sanitizationResult = sanitizePrompt(imageBody.prompt);

          // Log any flags for monitoring
          logSanitizationResult(requestId, sanitizationResult);

          // Block if injection detected
          if (sanitizationResult.blocked) {
            return createBlockedResponse(requestId);
          }

          // Use sanitized prompt
          imageBody.prompt = sanitizationResult.sanitized;
        } else if (
          modality === 'text-to-speech' &&
          typeof (validatedBody as unknown as ValidatedTTSRequest).text === 'string'
        ) {
          const ttsBody = validatedBody as unknown as ValidatedTTSRequest;
          const sanitizationResult = sanitizePrompt(ttsBody.text);

          // Log any flags for monitoring
          logSanitizationResult(requestId, sanitizationResult);

          // Block if injection detected
          if (sanitizationResult.blocked) {
            return createBlockedResponse(requestId);
          }

          // Use sanitized text
          ttsBody.text = sanitizationResult.sanitized;
        }
      }

      // 6. Create secure request object
      const secureRequest = request as SecureRequest;
      secureRequest.requestId = requestId;
      secureRequest.clientIP = clientIP;

      // 7. Execute handler with timeout
      const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      const handlerPromise = handler(secureRequest, validatedBody);
      const response = await Promise.race([handlerPromise, timeoutPromise]);

      // 8. Add security headers to response
      const headers = new Headers(response.headers);
      headers.set('X-Request-ID', requestId);

      // Add rate limit headers
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
      for (const [key, value] of Object.entries(rateLimitHeaders)) {
        headers.set(key, value);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      // Sanitize all errors before returning
      const sanitized = sanitizeError(error, requestId);
      return new Response(
        JSON.stringify(createErrorResponse(sanitized, requestId)),
        {
          status: getStatusCode(sanitized.code),
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    }
  };
}

/**
 * Simpler security wrapper for GET requests (no body validation)
 */
export function withSecurityGet(
  config: Omit<SecurityConfig, 'validateInput'>,
  handler: (request: SecureRequest) => Promise<Response>
): (request: NextRequest) => Promise<Response> {
  const { modality, timeout = LIMITS.request.timeoutMs } = config;

  return async (request: NextRequest): Promise<Response> => {
    const requestId = generateRequestId();
    const clientIP = extractClientIP(request);

    try {
      // Rate limiting
      const rateLimitResult = rateLimitByIP(clientIP, modality);
      if (!rateLimitResult.allowed) {
        return createRateLimitResponse(requestId, rateLimitResult.retryAfter);
      }

      // Create secure request
      const secureRequest = request as SecureRequest;
      secureRequest.requestId = requestId;
      secureRequest.clientIP = clientIP;

      // Execute with timeout
      const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      const response = await Promise.race([
        handler(secureRequest),
        timeoutPromise,
      ]);

      // Add headers
      const headers = new Headers(response.headers);
      headers.set('X-Request-ID', requestId);
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
      for (const [key, value] of Object.entries(rateLimitHeaders)) {
        headers.set(key, value);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const sanitized = sanitizeError(error, requestId);
      return new Response(
        JSON.stringify(createErrorResponse(sanitized, requestId)),
        {
          status: getStatusCode(sanitized.code),
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    }
  };
}
