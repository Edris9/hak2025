/**
 * Sanitized Error Handling
 *
 * This module provides safe error responses that never expose:
 * - Stack traces
 * - File paths
 * - API keys or tokens
 * - Provider-specific error details
 * - Internal service names
 */

/**
 * Security error codes for standardized responses
 */
export enum SecurityErrorCode {
  RATE_LIMITED = 'RATE_LIMITED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_REQUEST = 'INVALID_REQUEST',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONTENT_BLOCKED = 'CONTENT_BLOCKED',
  REQUEST_TOO_LARGE = 'REQUEST_TOO_LARGE',
  TIMEOUT = 'TIMEOUT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/**
 * Sanitized error structure for client responses
 */
export interface SanitizedError {
  code: SecurityErrorCode;
  message: string;
  retryable: boolean;
  retryAfter?: number;
}

/**
 * Standardized error response format
 */
export interface ErrorResponse {
  error: {
    code: SecurityErrorCode;
    message: string;
    requestId: string;
  };
  meta?: {
    retryable: boolean;
    retryAfter?: number;
  };
}

/**
 * Patterns that indicate specific error types
 */
const ERROR_PATTERNS: Array<{ pattern: RegExp | string; error: SanitizedError }> = [
  {
    pattern: /ECONNREFUSED/i,
    error: {
      code: SecurityErrorCode.SERVICE_UNAVAILABLE,
      message: 'AI service temporarily unavailable. Please try again.',
      retryable: true,
      retryAfter: 10,
    },
  },
  {
    pattern: /ETIMEDOUT|timeout/i,
    error: {
      code: SecurityErrorCode.TIMEOUT,
      message: 'Request timed out. Please try again.',
      retryable: true,
      retryAfter: 5,
    },
  },
  {
    pattern: /rate.?limit/i,
    error: {
      code: SecurityErrorCode.RATE_LIMITED,
      message: 'Service is busy. Please try again shortly.',
      retryable: true,
      retryAfter: 30,
    },
  },
  {
    pattern: /quota|exceeded|limit/i,
    error: {
      code: SecurityErrorCode.RATE_LIMITED,
      message: 'Usage limit reached. Please try again later.',
      retryable: true,
      retryAfter: 60,
    },
  },
  {
    pattern: /unauthorized|invalid.*key|authentication/i,
    error: {
      code: SecurityErrorCode.PROVIDER_ERROR,
      message: 'AI provider configuration error. Please contact support.',
      retryable: false,
    },
  },
  {
    pattern: /content.*policy|safety|blocked|harmful/i,
    error: {
      code: SecurityErrorCode.CONTENT_BLOCKED,
      message: 'Your request could not be processed due to content restrictions.',
      retryable: false,
    },
  },
];

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Sanitize an error for safe client response
 * Never exposes internal details, always logs full error for debugging
 *
 * @param error - The original error
 * @param requestId - Request ID for correlation
 * @returns Sanitized error safe for client
 */
export function sanitizeError(error: unknown, requestId: string): SanitizedError {
  // Log the full error internally for debugging (with request ID for correlation)
  console.error(`[${requestId}] Internal error:`, error);

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Check for known error patterns
    for (const { pattern, error: safeError } of ERROR_PATTERNS) {
      const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
      if (regex.test(errorMessage) || regex.test(error.name)) {
        return safeError;
      }
    }
  }

  // Default to generic error - never expose details
  return {
    code: SecurityErrorCode.INTERNAL_ERROR,
    message: 'An error occurred. Please try again.',
    retryable: true,
  };
}

/**
 * Create a standardized error response
 *
 * @param error - Sanitized error
 * @param requestId - Request ID for support correlation
 * @returns Formatted error response
 */
export function createErrorResponse(
  error: SanitizedError,
  requestId: string
): ErrorResponse {
  return {
    error: {
      code: error.code,
      message: error.message,
      requestId, // Allows users to reference for support
    },
    meta: {
      retryable: error.retryable,
      ...(error.retryAfter && { retryAfter: error.retryAfter }),
    },
  };
}

/**
 * Get HTTP status code for error type
 */
export function getStatusCode(code: SecurityErrorCode): number {
  switch (code) {
    case SecurityErrorCode.RATE_LIMITED:
      return 429;
    case SecurityErrorCode.UNAUTHORIZED:
      return 401;
    case SecurityErrorCode.FORBIDDEN:
      return 403;
    case SecurityErrorCode.INVALID_REQUEST:
    case SecurityErrorCode.CONTENT_BLOCKED:
    case SecurityErrorCode.REQUEST_TOO_LARGE:
      return 400;
    case SecurityErrorCode.TIMEOUT:
      return 504;
    case SecurityErrorCode.SERVICE_UNAVAILABLE:
      return 503;
    case SecurityErrorCode.PROVIDER_ERROR:
    case SecurityErrorCode.INTERNAL_ERROR:
    default:
      return 500;
  }
}

/**
 * Create a JSON Response with sanitized error
 */
export function createSanitizedErrorResponse(
  error: unknown,
  requestId: string
): Response {
  const sanitized = sanitizeError(error, requestId);
  const response = createErrorResponse(sanitized, requestId);
  const status = getStatusCode(sanitized.code);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
  };

  if (sanitized.retryAfter) {
    headers['Retry-After'] = String(sanitized.retryAfter);
  }

  return new Response(JSON.stringify(response), { status, headers });
}
