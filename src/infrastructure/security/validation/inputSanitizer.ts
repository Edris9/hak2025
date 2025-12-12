/**
 * Input Sanitization - Prompt Injection Protection
 *
 * Detects and blocks common prompt injection patterns that attempt to:
 * - Override system instructions
 * - Extract system prompts
 * - Manipulate AI behavior
 * - Bypass content filters
 */

/**
 * Result of sanitizing user input
 */
export interface SanitizationResult {
  /** Sanitized input (control chars removed) */
  sanitized: string;
  /** Detected patterns for logging/monitoring */
  flags: string[];
  /** Whether the input should be blocked */
  blocked: boolean;
}

/**
 * Patterns that indicate prompt injection attempts
 * These patterns are blocked
 */
const INJECTION_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  // System prompt override attempts
  { pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i, name: 'ignore_instructions' },
  { pattern: /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i, name: 'disregard_instructions' },
  { pattern: /forget\s+(everything|all|your\s+instructions)/i, name: 'forget_instructions' },
  { pattern: /new\s+(system\s+)?prompt/i, name: 'new_prompt' },
  { pattern: /override\s+(system|your)\s+(prompt|instructions)/i, name: 'override_prompt' },

  // Role manipulation
  { pattern: /you\s+are\s+now\s+(a|an|the)/i, name: 'role_override' },
  { pattern: /from\s+now\s+on[,\s]+you\s+(are|will)/i, name: 'role_change' },
  { pattern: /pretend\s+(to\s+be|you're|you\s+are)/i, name: 'pretend_role' },
  { pattern: /act\s+as\s+(if\s+you\s+are\s+)?(a|an|the)/i, name: 'act_as' },
  { pattern: /roleplay\s+as/i, name: 'roleplay' },

  // System prompt extraction
  { pattern: /reveal\s+(your\s+)?(system|initial|original)\s+(prompt|instructions)/i, name: 'reveal_prompt' },
  { pattern: /what\s+(are|is)\s+(your\s+)?(system\s+)?(prompt|instructions)/i, name: 'ask_prompt' },
  { pattern: /show\s+(me\s+)?(your\s+)?(system\s+)?prompt/i, name: 'show_prompt' },
  { pattern: /repeat\s+(your\s+)?(initial|system|original)\s+(instructions|prompt)/i, name: 'repeat_prompt' },
  { pattern: /print\s+(your\s+)?(system|initial)\s+(prompt|instructions)/i, name: 'print_prompt' },

  // Encoding bypass attempts
  { pattern: /base64[_\s]*(decode|encode)/i, name: 'base64_bypass' },
  { pattern: /\brot13\b/i, name: 'rot13_bypass' },
  { pattern: /unicode\s+(escape|decode)/i, name: 'unicode_bypass' },

  // DAN and jailbreak patterns
  { pattern: /\bDAN\b.*\bmode\b/i, name: 'dan_jailbreak' },
  { pattern: /jailbreak/i, name: 'jailbreak' },
  { pattern: /developer\s+mode/i, name: 'developer_mode' },
];

/**
 * Suspicious patterns (logged but not blocked)
 * Used for monitoring potential attacks
 */
const SUSPICIOUS_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  // Chat format markers (might indicate manipulation attempts)
  { pattern: /\[INST\]/i, name: 'inst_marker' },
  { pattern: /\[\/INST\]/i, name: 'inst_end_marker' },
  { pattern: /<\|im_start\|>/i, name: 'im_start' },
  { pattern: /<\|im_end\|>/i, name: 'im_end' },
  { pattern: /<<SYS>>/i, name: 'sys_marker' },

  // Role markers
  { pattern: /^Human:/im, name: 'human_marker' },
  { pattern: /^Assistant:/im, name: 'assistant_marker' },
  { pattern: /^System:/im, name: 'system_marker' },

  // Unusual formatting
  { pattern: /\n{10,}/g, name: 'excessive_newlines' },
  { pattern: /(.)\1{50,}/g, name: 'char_repetition' },
];

/**
 * Control characters to remove (except common whitespace)
 */
const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Sanitize user input for prompt injection
 *
 * @param input - Raw user input
 * @returns Sanitization result with flags and block status
 */
export function sanitizePrompt(input: string): SanitizationResult {
  const flags: string[] = [];
  let blocked = false;

  // Check for injection patterns (blocking)
  for (const { pattern, name } of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      flags.push(`blocked:${name}`);
      blocked = true;
    }
  }

  // Check for suspicious patterns (logging only)
  for (const { pattern, name } of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      flags.push(`suspicious:${name}`);
    }
  }

  // Sanitize the input
  let sanitized = input
    // Remove control characters (keep tab, newline, carriage return)
    .replace(CONTROL_CHAR_REGEX, '')
    // Trim whitespace
    .trim();

  // Limit consecutive newlines (prevent formatting attacks)
  sanitized = sanitized.replace(/\n{5,}/g, '\n\n\n\n');

  // Limit consecutive spaces
  sanitized = sanitized.replace(/ {10,}/g, '          ');

  return { sanitized, flags, blocked };
}

/**
 * Quick check if input contains potential injection
 * Use for fast pre-filtering before full sanitization
 */
export function hasInjectionPatterns(input: string): boolean {
  for (const { pattern } of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

/**
 * Log sanitization results for security monitoring
 */
export function logSanitizationResult(
  requestId: string,
  result: SanitizationResult
): void {
  if (result.flags.length > 0) {
    console.warn(`[${requestId}] Input sanitization flags:`, result.flags);
  }
  if (result.blocked) {
    console.warn(`[${requestId}] Input BLOCKED due to injection patterns`);
  }
}
