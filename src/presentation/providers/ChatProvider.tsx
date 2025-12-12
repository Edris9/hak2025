'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ChatMessage, AIProviderType, AIProviderStatus, createChatMessage } from '@/domain/models';

/**
 * Chat context state interface
 */
interface ChatContextState {
  /** Current conversation messages */
  messages: ChatMessage[];
  /** Whether a message is being sent/received */
  isLoading: boolean;
  /** Currently selected provider */
  currentProvider: AIProviderType | null;
  /** List of available providers */
  availableProviders: AIProviderStatus[];
  /** Whether any provider is configured */
  hasConfiguredProvider: boolean;
  /** Add a message to the conversation */
  addMessage: (role: 'user' | 'assistant', content: string, provider?: AIProviderType) => void;
  /** Update the last assistant message (for streaming) */
  updateLastAssistantMessage: (content: string) => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set the current provider */
  setCurrentProvider: (provider: AIProviderType) => void;
  /** Set available providers (from API) */
  setAvailableProviders: (providers: AIProviderStatus[], defaultProvider: AIProviderType | null) => void;
}

const ChatContext = createContext<ChatContextState | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

/**
 * Chat Provider Component
 *
 * Manages the chat state including messages, loading state, and provider selection.
 * Messages are stored in React state only (session-based, not persisted).
 *
 * @example
 * ```tsx
 * <ChatProvider>
 *   <ChatPage />
 * </ChatProvider>
 * ```
 */
export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<AIProviderType | null>(null);
  const [availableProviders, setAvailableProvidersState] = useState<AIProviderStatus[]>([]);
  const [hasConfiguredProvider, setHasConfiguredProvider] = useState(false);

  const addMessage = useCallback(
    (role: 'user' | 'assistant', content: string, provider?: AIProviderType) => {
      const message = createChatMessage(role, content, provider);
      setMessages((prev) => [...prev, message]);
    },
    []
  );

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;

      const lastIndex = prev.length - 1;
      const lastMessage = prev[lastIndex];

      // Only update if the last message is from the assistant
      if (lastMessage.role !== 'assistant') return prev;

      const updated = [...prev];
      updated[lastIndex] = {
        ...lastMessage,
        content,
      };
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setAvailableProviders = useCallback(
    (providers: AIProviderStatus[], defaultProvider: AIProviderType | null) => {
      setAvailableProvidersState(providers);
      setHasConfiguredProvider(providers.some((p) => p.isConfigured));
      if (defaultProvider && !currentProvider) {
        setCurrentProvider(defaultProvider);
      }
    },
    [currentProvider]
  );

  const value: ChatContextState = {
    messages,
    isLoading,
    currentProvider,
    availableProviders,
    hasConfiguredProvider,
    addMessage,
    updateLastAssistantMessage,
    clearMessages,
    setIsLoading,
    setCurrentProvider,
    setAvailableProviders,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * Hook to access the chat context
 *
 * @throws Error if used outside of ChatProvider
 */
export function useChatContext(): ChatContextState {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
