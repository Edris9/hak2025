import { useCallback } from 'react';
import { useChatContext } from '../providers/ChatProvider';
import { MessageRole } from '@/domain/models';
import { ChatStreamEvent } from '@/application/dto';

/**
 * Hook for sending messages to the AI and handling streaming responses
 *
 * This hook manages the entire flow of sending a message:
 * 1. Adds the user's message to the chat
 * 2. Creates a placeholder assistant message
 * 3. Streams the response from the API
 * 4. Updates the assistant message with each token
 *
 * @example
 * ```tsx
 * const { sendMessage, isLoading } = useSendMessage();
 *
 * const handleSubmit = async (text: string) => {
 *   await sendMessage(text);
 * };
 * ```
 */
export function useSendMessage() {
  const {
    messages,
    isLoading,
    currentProvider,
    addMessage,
    updateLastAssistantMessage,
    setIsLoading,
  } = useChatContext();

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      setIsLoading(true);

      // Add user message
      addMessage('user', message.trim());

      // Add placeholder assistant message for streaming
      addMessage('assistant', '', currentProvider || undefined);

      try {
        // Build history from existing messages (excluding the placeholder)
        const history = messages.map((msg) => ({
          role: msg.role as MessageRole,
          content: msg.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim(),
            history,
            provider: currentProvider,
          }),
        });

        // Check if response is JSON (error) or SSE stream
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          updateLastAssistantMessage(
            `Error: ${error.error?.message || 'Failed to get response'}\n\n${
              error.error?.instructions?.join('\n') || ''
            }`
          );
          return;
        }

        // Process SSE stream
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.startsWith('data:'));

          for (const line of lines) {
            const data = line.replace('data:', '').trim();
            if (!data) continue;

            try {
              const event: ChatStreamEvent = JSON.parse(data);

              switch (event.type) {
                case 'token':
                  fullContent += event.data;
                  updateLastAssistantMessage(fullContent);
                  break;
                case 'complete':
                  // Final update with complete content
                  updateLastAssistantMessage(event.data);
                  break;
                case 'error':
                  updateLastAssistantMessage(`Error: ${event.data}`);
                  break;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      } catch (error) {
        console.error('Send message error:', error);
        updateLastAssistantMessage(
          `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, currentProvider, addMessage, updateLastAssistantMessage, setIsLoading]
  );

  return { sendMessage, isLoading };
}
