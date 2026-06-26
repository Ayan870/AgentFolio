"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";

const SUGGESTED = [
  "Tell me about your projects",
  "What are your main skills?",
  "What's your work experience?",
  "How can I contact you?",
];

const STACK_TAGS = ["Python", "FastAPI", "LangGraph", "Next.js", "Chroma", "Docker"];

type Theme = "dark" | "light";

export default function AgentPage() {
  const { userId } = useParams<{ userId: string }>();
  const { messages, isLoading, error, send, reset } = useChat(userId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const displayName = userId.replace(/_/g, " ");

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "var(--page-bg)",
        fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Ambient layers */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute",
          top: "-10rem", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "520px", borderRadius: "50%",
          background: "rgba(212,255,0,0.08)", filter: "blur(140px)",
        }} />
        <div style={{
          position: "absolute",
          top: "33%", left: "-10rem",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "rgba(6,182,212,0.07)", filter: "blur(140px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: 0, right: "-10rem",
          width: "520px", height: "520px", borderRadius: "50%",
          background: "rgba(139,92,246,0.07)", filter: "blur(140px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          opacity: "var(--grid-opacity)" as any,
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--scrim)" }} />
      </div>

      {/* Layout grid */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
        }}
        className="agent-layout"
      >
        <style>{`
          @media (min-width: 1280px) {
            .agent-layout { grid-template-columns: 256px 1fr 256px !important; }
            .left-rail, .right-rail { display: flex !important; }
          }
          @media (max-width: 1279px) {
            .left-rail, .right-rail { display: none !important; }
          }
        `}</style>

        {/* LEFT RAIL */}
        <aside className="left-rail" style={{ display: "none", flexDirection: "column", gap: "1rem" }}>
          {/* Agent card */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: "40px", height: "40px",
                  borderRadius: "0.625rem",
                  background: "var(--brand)",
                  display: "grid", placeItems: "center",
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.7rem", fontWeight: 700, color: "#000",
                  letterSpacing: "0.05em",
                }}>
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div style={{
                  position: "absolute", bottom: "-2px", right: "-2px",
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: "#4ade80",
                  border: "2px solid var(--page-bg)",
                }} />
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-title)", textTransform: "capitalize" }}>
                  {displayName}
                </p>
                <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--text-faint)" }}>
                  online · agent active
                </p>
              </div>
            </div>
          </div>

          {/* System info */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "1rem" }}>System</p>
            {[["Model", "agentfolio-1"], ["Context", "128k"], ["Retrieval", "Chroma"], ["Region", "local"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.8rem" }}>
                <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>{k}</span>
                <span style={{ fontFamily: "Geist Mono, monospace", fontWeight: 500, color: "var(--text-title)" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Recent */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Recent</p>
            {["Show me your projects", "What models do you work with?", "Walk me through your stack"].map((q) => (
              <button key={q} onClick={() => send(q)} style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "0.5rem 0.625rem",
                borderRadius: "0.5rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginBottom: "0.25rem",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                transition: "background 0.15s, color 0.15s",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--sidebar-recent-hover)"; (e.target as HTMLElement).style.color = "var(--text-body)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "var(--text-muted)"; }}
              >{q}</button>
            ))}
          </div>
        </aside>

        {/* CENTER CHAT */}
        <main style={{ display: "flex", flexDirection: "column" }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 4rem)",
            borderRadius: "1.5rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-strong-bg)",
            backdropFilter: "blur(24px)",
            boxShadow: "var(--card-strong-shadow)",
            overflow: "hidden",
          }}>
            {/* Top glow line */}
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(212,255,0,0.25), transparent)",
              pointerEvents: "none",
            }} />

            {/* Header */}
            <header style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid var(--divider)",
              flexShrink: 0,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  {/* Live dot */}
                  <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px" }}>
                    <span style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      background: "var(--brand)", opacity: 0.6,
                      animation: "ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite",
                    }} />
                    <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand)", display: "inline-block" }} />
                  </span>
                  <h1 style={{
                    fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-0.01em",
                    color: "var(--text-title)", textTransform: "capitalize",
                  }}>
                    {displayName}&apos;s Agent
                  </h1>
                </div>
                <p style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.65rem", color: "var(--text-muted)",
                  letterSpacing: "0.05em", marginTop: "0.125rem",
                }}>
                  Powered by AgentFolio · Ask me anything
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {/* Theme toggle */}
                <button
                  onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                  title="Toggle theme"
                  style={{
                    width: "36px", height: "36px",
                    display: "grid", placeItems: "center",
                    borderRadius: "0.625rem",
                    border: "1px solid var(--icon-btn-border)",
                    background: "var(--icon-btn-bg)",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  {theme === "dark" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>

                {/* Reset */}
                <button
                  onClick={reset}
                  title="Reset conversation"
                  style={{
                    width: "36px", height: "36px",
                    display: "grid", placeItems: "center",
                    borderRadius: "0.625rem",
                    border: "1px solid var(--icon-btn-border)",
                    background: "var(--icon-btn-bg)",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.75rem" }}>
              {messages.length === 0 && (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  height: "100%", gap: "1.5rem", textAlign: "center",
                }}>
                  <div style={{
                    width: "56px", height: "56px",
                    borderRadius: "1rem",
                    background: "var(--brand)",
                    display: "grid", placeItems: "center",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.8rem", fontWeight: 700, color: "#000",
                    boxShadow: "0 0 30px -5px rgba(212,255,0,0.5)",
                  }}>
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "340px" }}>
                    Hi! I&apos;m <strong style={{ color: "var(--text-body)", textTransform: "capitalize" }}>{displayName}</strong>&apos;s AI agent.
                    Ask me about projects, skills, or experience.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "999px",
                          border: "1px solid var(--chip-border)",
                          background: "var(--chip-bg)",
                          backdropFilter: "blur(8px)",
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontFamily: "Geist Mono, monospace",
                          letterSpacing: "0.02em",
                          transition: "border-color 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget;
                          el.style.borderColor = "var(--chip-hover-border)";
                          el.style.color = "var(--brand)";
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget;
                          el.style.borderColor = "var(--chip-border)";
                          el.style.color = "var(--text-muted)";
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} agentInitials={displayName.slice(0, 2).toUpperCase()} />
                ))}
                {isLoading && <TypingIndicator initials={displayName.slice(0, 2).toUpperCase()} />}
                {error && (
                  <div style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}>
                    {error}
                  </div>
                )}
              </div>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={send} disabled={isLoading} />
          </div>
        </main>

        {/* RIGHT RAIL */}
        <aside className="right-rail" style={{ display: "none", flexDirection: "column", gap: "1rem" }}>
          {/* About */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>About</p>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "var(--text-body)" }}>
              Full-stack developer & AI engineer obsessed with agentic systems, RAG pipelines, and beautiful products.
            </p>
          </div>

          {/* Stack */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Stack</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {STACK_TAGS.map(t => (
                <span key={t} style={{
                  padding: "0.25rem 0.625rem",
                  borderRadius: "0.375rem",
                  border: "1px solid var(--tag-border)",
                  background: "var(--tag-bg)",
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Suggested */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--suggestion-wrap)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--brand)", marginBottom: "0.75rem" }}>Suggested</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {SUGGESTED.slice(0, 3).map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  textAlign: "left",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.625rem",
                  border: "1px solid var(--card-border)",
                  background: "var(--card-bg)",
                  color: "var(--text-body)",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,255,0,0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--card-border)")}
                >{q}</button>
              ))}
            </div>
          </div>

          {/* Signal bars */}
          <div style={{
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(16px)",
            padding: "1.25rem",
          }}>
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Signal</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "48px" }}>
              {[40, 60, 30, 70, 55, 80, 45, 65, 75, 50, 90, 60].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: "3px",
                  background: "linear-gradient(to top, rgba(212,255,0,0.2), rgba(212,255,0,0.6))",
                }} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}