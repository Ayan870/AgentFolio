"use client";
import { Message } from "@/types";

interface Props {
  message: Message;
  agentInitials: string;
}

export default function ChatBubble({ message, agentInitials }: Props) {
  const isUser = message.role === "user";

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: "0.75rem" }}>
      {!isUser && (
        <div style={{
          width: "34px", height: "34px", flexShrink: 0,
          borderRadius: "0.625rem",
          background: "var(--brand)",
          display: "grid", placeItems: "center",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.65rem", fontWeight: 700, color: "#000",
          boxShadow: "0 0 20px -5px rgba(212,255,0,0.5)",
          marginTop: "2px",
        }}>
          {agentInitials}
        </div>
      )}

      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <div style={{
          padding: "0.75rem 1rem",
          borderRadius: isUser ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          backdropFilter: "blur(8px)",
          background: isUser ? "var(--user-bubble-bg)" : "var(--ai-bubble-bg)",
          border: `1px solid ${isUser ? "var(--user-bubble-border)" : "var(--ai-bubble-border)"}`,
          boxShadow: isUser ? "var(--user-bubble-shadow)" : "none",
          color: "var(--text-body)",
        }}>
          {message.content}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {message.sources.map((s) => (
              <span key={s} style={{
                padding: "0.2rem 0.625rem",
                borderRadius: "999px",
                border: "1px solid var(--tag-border)",
                background: "var(--tag-bg)",
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
              }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}