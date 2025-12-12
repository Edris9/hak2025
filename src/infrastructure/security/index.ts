/**
 * Security Module Exports
 *
 * Centralized exports for all security functionality.
 */

// Error handling
export {
  SecurityErrorCode,
  type SanitizedError,
  type ErrorResponse,
  generateRequestId,
  sanitizeError,
  createErrorResponse,
  getStatusCode,
  createSanitizedErrorResponse,
} from './errors/sanitizedErrors';

// Request validation
export {
  LIMITS,
  chatRequestSchema,
  imageRequestSchema,
  ttsRequestSchema,
  type ValidatedChatRequest,
  type ValidatedImageRequest,
  type ValidatedTTSRequest,
  type ValidationResult,
  validateRequestSize,
  validateHistorySize,
  validateChatRequest,
  calculateHistorySize,
} from './validation/requestValidator';

// Input sanitization (prompt injection protection)
export {
  type SanitizationResult,
  sanitizePrompt,
  hasInjectionPatterns,
  logSanitizationResult,
} from './validation/inputSanitizer';

// Output filtering
export {
  filterOutput,
  filterOutputWithLogging,
  filterStackTrace,
  containsSensitiveData,
  createStreamingFilter,
} from './validation/outputFilter';

// System prompt protection
export {
  wrapSystemPrompt,
  createMinimalSystemPrompt,
  DEFAULT_SYSTEM_PROMPTS,
  validateSystemPrompt,
  getDefaultChatSystemPrompt,
} from './validation/systemPromptProtection';

// Rate limiting
export {
  type RateLimitConfig,
  type RateLimitResult,
  RATE_LIMITS,
  rateLimitByIP,
  rateLimitByUser,
  rateLimitCustom,
  extractClientIP,
  createRateLimitHeaders,
  resetRateLimitStore,
} from './middleware/rateLimiter';

// Security middleware
export {
  type SecurityConfig,
  type SecureRequest,
  withSecurity,
  withSecurityGet,
} from './middleware/withSecurity';
