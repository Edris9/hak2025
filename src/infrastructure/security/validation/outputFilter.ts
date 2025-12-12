/**
 * Output Filtering
 *
 * Filters sensitive information from AI responses before sending to clients.
 * Prevents accidental exposure of:
 * - API keys
 * - File system paths
 * - Internal IPs
 * - Database connection strings
 * - Environment variables
 */

/**
 * Patterns to redact from output
 */
const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  // API Keys
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, name: 'openai_key' },
  { pattern: /sk-ant-[a-zA-Z0-9\-_]{40,}/g, name: 'anthropic_key' },
  { pattern: /AIza[a-zA-Z0-9_\-]{35}/g, name: 'google_key' },
  { pattern: /[a-zA-Z0-9]{32}/g, name: 'generic_api_key' }, // Be careful with this one

  // AWS credentials
  { pattern: /AKIA[0-9A-Z]{16}/g, name: 'aws_access_key' },
  { pattern: /aws_secret_access_key[=:]\s*[^\s]+/gi, name: 'aws_secret' },

  // File system paths (Unix)
  { pattern: /\/Users\/[^\s\/]+\/[^\s]*/g, name: 'unix_user_path' },
  { pattern: /\/home\/[^\s\/]+\/[^\s]*/g, name: 'unix_home_path' },
  { pattern: /\/var\/[^\s]*/g, name: 'unix_var_path' },
  { pattern: /\/etc\/[^\s]*/g, name: 'unix_etc_path' },

  // File system paths (Windows)
  { pattern: /C:\\Users\\[^\\]+\\[^\s]*/gi, name: 'windows_user_path' },
  { pattern: /[A-Z]:\\[^\s]*/gi, name: 'windows_path' },

  // Database connection strings
  { pattern: /mongodb(\+srv)?:\/\/[^\s]+/gi, name: 'mongodb_uri' },
  { pattern: /postgres(ql)?:\/\/[^\s]+/gi, name: 'postgres_uri' },
  { pattern: /mysql:\/\/[^\s]+/gi, name: 'mysql_uri' },
  { pattern: /redis:\/\/[^\s]+/gi, name: 'redis_uri' },

  // Internal/Private IPs
  {
    pattern: /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    name: 'private_ip_10',
  },
  {
    pattern: /\b172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}\b/g,
    name: 'private_ip_172',
  },
  {
    pattern: /\b192\.168\.\d{1,3}\.\d{1,3}\b/g,
    name: 'private_ip_192',
  },

  // Environment variable references
  { pattern: /process\.env\.[A-Z_]+/g, name: 'env_reference' },
  { pattern: /\$\{?[A-Z_]+\}?/g, name: 'env_variable' },

  // JWT tokens (basic pattern)
  { pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, name: 'jwt_token' },

  // Bearer tokens
  { pattern: /Bearer\s+[a-zA-Z0-9\-_.]+/gi, name: 'bearer_token' },

  // Email addresses (optional - comment out if needed in output)
  // { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, name: 'email' },
];

/**
 * Less aggressive patterns for specific contexts
 */
const CONTEXT_PATTERNS = {
  // Stack traces
  stackTrace: /at\s+[^\n]+\([^\)]+:\d+:\d+\)/g,
  // Error locations
  errorLocation: /\([^\)]+\.(?:ts|js|tsx|jsx):\d+:\d+\)/g,
};

/**
 * Filter sensitive information from output
 *
 * @param output - Raw output from AI
 * @returns Filtered output with sensitive data redacted
 */
export function filterOutput(output: string): string {
  let filtered = output;

  // Apply all sensitive patterns
  for (const { pattern } of SENSITIVE_PATTERNS) {
    // Reset regex state for global patterns
    pattern.lastIndex = 0;
    filtered = filtered.replace(pattern, '[REDACTED]');
  }

  return filtered;
}

/**
 * Filter sensitive information with logging
 *
 * @param output - Raw output
 * @param requestId - Request ID for logging
 * @returns Filtered output
 */
export function filterOutputWithLogging(
  output: string,
  requestId: string
): { filtered: string; redactedCount: number } {
  let filtered = output;
  let redactedCount = 0;

  for (const { pattern, name } of SENSITIVE_PATTERNS) {
    pattern.lastIndex = 0;
    const matches = output.match(pattern);
    if (matches) {
      redactedCount += matches.length;
      console.warn(`[${requestId}] Redacting ${matches.length} ${name} patterns`);
    }
    filtered = filtered.replace(pattern, '[REDACTED]');
  }

  return { filtered, redactedCount };
}

/**
 * Filter stack traces from error messages
 */
export function filterStackTrace(message: string): string {
  return message
    .replace(CONTEXT_PATTERNS.stackTrace, '[stack trace redacted]')
    .replace(CONTEXT_PATTERNS.errorLocation, '[location redacted]');
}

/**
 * Check if output contains sensitive patterns
 * Use for detection before sending
 */
export function containsSensitiveData(output: string): boolean {
  for (const { pattern } of SENSITIVE_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(output)) {
      return true;
    }
  }
  return false;
}

/**
 * Create a filtered streaming token handler
 * Accumulates tokens and filters when complete words are formed
 */
export function createStreamingFilter() {
  let buffer = '';

  return {
    /**
     * Process a token and return filtered output
     */
    processToken(token: string): string {
      buffer += token;

      // For single tokens, apply light filtering
      // Full filtering happens on complete messages
      let filtered = token;

      // Quick check for obvious patterns in token
      if (token.includes('sk-') || token.includes('AIza')) {
        filtered = '[REDACTED]';
      }

      return filtered;
    },

    /**
     * Get the fully filtered buffer
     */
    getFilteredBuffer(): string {
      return filterOutput(buffer);
    },

    /**
     * Reset the buffer
     */
    reset(): void {
      buffer = '';
    },
  };
}
