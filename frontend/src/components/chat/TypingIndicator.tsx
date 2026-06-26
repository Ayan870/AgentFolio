interface Props {
  initials: string;
}

export default function TypingIndicator({ initials }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
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
        {initials}
      </div>

      <div style={{
        padding: "0.875rem 1.125rem",
        borderRadius: "1rem 1rem 1rem 0.25rem",
        border: "1px solid var(--ai-bubble-border)",
        background: "var(--ai-bubble-bg)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--text-muted)",
              display: "inline-block",
              animation: `bounce-dot 1.2s ease-in-out ${delay}ms infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}