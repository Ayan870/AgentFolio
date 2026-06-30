"use client";
import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  onChange?: (val: string) => void;
}

export default function ChatInput({ onSend, disabled, onChange }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    onChange?.("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (val: string) => {
    setValue(val);
    onChange?.(val);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-end",
      gap: "0.75rem",
      padding: "1rem",
      borderTop: "1px solid var(--divider, rgba(255, 255, 255, 0.06))",
      background: "var(--input-bg, rgba(13, 13, 16, 0.8))",
      backdropFilter: "blur(12px)",
    }}>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask me anything..."
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--card-border, rgba(255, 255, 255, 0.06))",
          color: "var(--text-body, #d1d5db)",
          borderRadius: "0.75rem",
          padding: "0.75rem 1rem",
          fontSize: "0.875rem",
          resize: "none",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--brand)";
          e.currentTarget.style.boxShadow = "0 0 0 2px rgba(212, 255, 0, 0.15)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--card-border, rgba(255, 255, 255, 0.06))";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        style={{
          padding: "0.75rem",
          background: disabled || !value.trim() ? "rgba(212, 255, 0, 0.1)" : "var(--brand)",
          color: disabled || !value.trim() ? "var(--text-faint)" : "#000",
          borderRadius: "0.75rem",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          transition: "background 0.15s, color 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={e => {
          if (!disabled && value.trim()) {
            e.currentTarget.style.background = "var(--brand-dim, #a8cc00)";
          }
        }}
        onMouseLeave={e => {
          if (!disabled && value.trim()) {
            e.currentTarget.style.background = "var(--brand)";
          }
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );
}