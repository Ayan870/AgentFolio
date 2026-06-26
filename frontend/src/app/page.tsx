import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        background: "var(--page-bg)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "520px",
            borderRadius: "50%",
            background: "rgba(212,255,0,0.08)",
            filter: "blur(140px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "-10rem",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.08)",
            filter: "blur(140px)",
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: "var(--grid-opacity)",
            backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--scrim)",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "520px" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            backdropFilter: "blur(12px)",
            borderRadius: "999px",
            padding: "0.375rem 1rem",
            marginBottom: "2rem",
            fontSize: "0.75rem",
            fontFamily: "Geist Mono, monospace",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
            }}
          />
          AI Portfolio · Powered by RAG
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--text-title)",
            marginBottom: "1rem",
          }}
        >
          Agent
          <span style={{ color: "var(--brand)" }}>Folio</span>
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
          }}
        >
          Your AI portfolio agent — answers questions about you, in your voice,
          powered by your CV and LinkedIn.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/agent/hamza_dev"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              background: "var(--brand)",
              color: "#000",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "filter 0.15s",
            }}
          >
            View Demo Agent →
          </Link>
          <Link
            href="/onboarding"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              backdropFilter: "blur(12px)",
              color: "var(--text-body)",
              borderRadius: "0.75rem",
              fontWeight: 500,
              fontSize: "0.9rem",
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
          >
            Create Yours
          </Link>
        </div>
      </div>
    </main>
  );
}