/**
 * AI Chat Domain Models
 *
 * This file defines the core data structures for the AI Chat feature.
 * It supports multiple AI providers (Gemini, OpenAI, Mistral, Anthropic)
 * with a plug-and-play architecture.
 */

/**
 * Supported AI provider types
 */
export type AIProviderType = 'gemini' | 'openai' | 'mistral' | 'anthropic';

/**
 * Chat message roles
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Represents a single chat message
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  provider?: AIProviderType;
}

/**
 * Configuration for an AI provider including setup instructions
 */
export interface AIProviderConfig {
  type: AIProviderType;
  name: string;
  description: string;
  docsUrl: string;
  apiKeyEnvVar: string;
  apiKeyInstructions: string[];
  modelName: string;
}

/**
 * Provider status including configuration state
 */
export interface AIProviderStatus extends AIProviderConfig {
  isConfigured: boolean;
}

/**
 * Configuration for all supported AI providers
 * Includes setup instructions for workshop participants
 */
export const AI_PROVIDERS: Record<AIProviderType, AIProviderConfig> = {
  anthropic: {
    type: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude Sonnet 4.5 - Intelligent and efficient, excellent for coding and complex tasks.',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    modelName: 'claude-sonnet-4-5-20250929',
    apiKeyInstructions: [
      'Go to https://console.anthropic.com/settings/keys',
      'Sign in or create an Anthropic account',
      'Click "Create Key"',
      'Give your key a name and click "Create Key"',
      'Copy the key (it starts with sk-ant-...)',
      'Add to .env.local: ANTHROPIC_API_KEY=sk-ant-...',
    ],
  },
  openai: {
    type: 'openai',
    name: 'OpenAI ChatGPT',
    description: 'GPT-4.1 mini - Fast and efficient, great for a wide range of tasks.',
    docsUrl: 'https://platform.openai.com/api-keys',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    modelName: 'gpt-4.1-mini',
    apiKeyInstructions: [
      'Go to https://platform.openai.com/api-keys',
      'Sign in or create an OpenAI account',
      'Click "Create new secret key"',
      'Give your key a name and click "Create secret key"',
      'Copy the key immediately (shown only once, starts with sk-...)',
      'Add to .env.local: OPENAI_API_KEY=sk-...',
    ],
  },
  gemini: {
    type: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 2.0 Flash - Fast multimodal AI with 1M token context window.',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    apiKeyEnvVar: 'GEMINI_API_KEY',
    modelName: 'gemini-2.0-flash',
    apiKeyInstructions: [
      'Go to https://aistudio.google.com/app/apikey',
      'Sign in with your Google account',
      'Click "Create API Key"',
      'Select or create a Google Cloud project',
      'Copy the generated API key',
      'Add to .env.local: GEMINI_API_KEY=your-key-here',
    ],
  },
  mistral: {
    type: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral Small - Efficient and cost-effective for general purpose tasks.',
    docsUrl: 'https://console.mistral.ai/api-keys/',
    apiKeyEnvVar: 'MISTRAL_API_KEY',
    modelName: 'mistral-small-latest',
    apiKeyInstructions: [
      'Go to https://console.mistral.ai/api-keys/',
      'Sign in or create a Mistral account',
      'Click "Create new key"',
      'Give your key a name',
      'Copy the generated API key',
      'Add to .env.local: MISTRAL_API_KEY=your-key-here',
    ],
  },
};

/**
 * Priority order for selecting default provider
 * First configured provider in this list will be used as default
 */
export const PROVIDER_PRIORITY: AIProviderType[] = ['anthropic', 'openai', 'gemini', 'mistral'];

/**
 * Helper to generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Helper to create a new chat message
 */
export function createChatMessage(
  role: MessageRole,
  content: string,
  provider?: AIProviderType
): ChatMessage {
  return {
    id: generateMessageId(),
    role,
    content,
    timestamp: new Date(),
    provider,
  };
}
