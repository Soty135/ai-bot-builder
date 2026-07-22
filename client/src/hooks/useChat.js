import { useState, useCallback, useRef } from 'react';
import { sendMessage } from '../api/chat';

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: "Hello! I'm your AI support assistant, currently configured with your latest documentation. How can I help you today?",
  },
];

export function useChat(botId) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(generateSessionId());

  const send = useCallback(async (text) => {
    if (!text.trim() || isLoading || !botId) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendMessage(text, sessionIdRef.current, botId);
      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${err.message}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, botId]);

  const clearChat = useCallback(() => {
    sessionIdRef.current = generateSessionId();
    setMessages(INITIAL_MESSAGES);
  }, []);

  return { messages, isLoading, send, clearChat, sessionId: sessionIdRef.current };
}
