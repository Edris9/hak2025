'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatProvider, useChatContext } from '@/presentation/providers';
import { useProviders } from '@/presentation/hooks';
import {
  ChatMessages,
  ChatInput,
  ProviderSetup,
  ProviderSelector,
} from '@/presentation/components/chat';

/**
 * Chat Page Content
 *
 * The main chat interface that shows either:
 * - Provider setup instructions (when no provider is configured)
 * - The chat interface (when at least one provider is configured)
 */
function ChatContent() {
  const { providers, hasConfigured, isLoading } = useProviders();
  const { clearMessages, messages } = useChatContext();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasConfigured) {
    return <ProviderSetup providers={providers} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">AI Chat</h1>
          <p className="text-sm text-muted-foreground">
            Chat with an AI assistant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProviderSelector />
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ChatMessages />

      {/* Input */}
      <ChatInput />
    </div>
  );
}

/**
 * Chat Page
 *
 * A full-featured AI chat interface that supports multiple providers.
 * Messages are stored in session (not persisted to database).
 *
 * Features:
 * - Multiple AI provider support (Gemini, OpenAI, Mistral, Anthropic)
 * - Streaming responses for real-time token display
 * - Helpful setup instructions when no provider is configured
 * - Provider switching (when multiple are configured)
 * - Clear chat functionality
 */
export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="h-[calc(100vh-4rem)]">
        <ChatContent />
      </div>
    </ChatProvider>
  );
}
