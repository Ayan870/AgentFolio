"use client";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { RotateCcw } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Tell me about your projects",
  "What are your main skills?",
  "What's your work experience?",
  "How can I contact you?",
];

export default function AgentPage() {
  const { userId } = useParams<{ userId: string }>();
  const { messages, isLoading, error, send, reset } = useChat(userId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h1 className="text-lg font-semibold text-white capitalize">
            {userId.replace(/_/g, " ")}'s Agent
          </h1>
          <p className="text-xs text-gray-500">Powered by AgentFolio · Ask me anything</p>
        </div>
        <button
          onClick={reset}
          className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          title="Reset conversation"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="text-4xl">🤖</div>
            <p className="text-gray-400 text-sm max-w-sm">
              Hi! I'm {userId.replace(/_/g, " ")}'s AI agent. Ask me about their projects, skills, or experience.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="text-red-400 text-sm text-center py-2 bg-red-950 rounded-lg px-4">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={send} disabled={isLoading} />
    </div>
  );
}