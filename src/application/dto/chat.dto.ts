import { AIProviderType, AIProviderStatus, MessageRole } from '@/domain/models';

/**
 * Chat DTOs (Data Transfer Objects)
 *
 * These types define the structure of data transferred between
 * the client and server for the AI Chat feature.
 */

/**
 * Request to send a message to the AI
 */
export interface SendMessageRequest {
  /** The user's message content */
  message: string;
  /** Conversation history for context */
  history: {
    role: MessageRole;
    content: string;
  }[];
  /** Specific provider to use (optional, uses default if not specified) */
  provider?: AIProviderType;
}

/**
 * Server-Sent Event types for streaming responses
 */
export type ChatStreamEventType = 'token' | 'complete' | 'error';

/**
 * Structure of SSE events sent during chat streaming
 */
export interface ChatStreamEvent {
  type: ChatStreamEventType;
  data: string;
  provider?: AIProviderType;
}

/**
 * Response from the providers endpoint
 */
export interface ProvidersResponse {
  /** List of all providers with their configuration status */
  providers: AIProviderStatus[];
  /** The default provider to use (first configured provider) */
  defaultProvider: AIProviderType | null;
  /** Whether any provider is configured */
  hasAnyConfigured: boolean;
}

/**
 * Error response with helpful setup instructions
 */
export interface ChatErrorResponse {
  error: {
    code: 'NO_PROVIDER_CONFIGURED' | 'PROVIDER_ERROR' | 'INVALID_REQUEST';
    message: string;
    instructions?: string[];
  };
}

/**
 * Serialized chat message for API transfer
 */
export interface ChatMessageDTO {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO string
  provider?: AIProviderType;
}
