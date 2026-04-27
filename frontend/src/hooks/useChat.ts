"use client";
import { useState, useCallback } from "react";
import { Message } from "@/types";
import { sendMessage } from "@/lib/api";
import { v4 as uuidv4 } from "uuid";

export function useChat(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      setError(null);

      const userMsg: Message = {
        id: uuidv4(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await sendMessage({
          user_id: userId,
          message: content,
          session_id: sessionId,
          history,
        });

        setSessionId(res.session_id);

        const assistantMsg: Message = {
          id: uuidv4(),
          role: "assistant",
          content: res.reply,
          sources: res.sources,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError("Failed to get a response. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, sessionId, userId]
  );

  const reset = () => {
    setMessages([]);
    setSessionId(undefined);
    setError(null);
  };

  return { messages, isLoading, error, send, reset };
}