"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

interface AgentSettingsPanelProps {
  userId: string;
}

interface Settings {
  tone: string;
  response_length: string;
  model: string;
}

export default function AgentSettingsPanel({ userId }: AgentSettingsPanelProps) {
  const [settings, setSettings] = useState<Settings>({
    tone: "professional",
    response_length: "medium",
    model: "meta-llama/llama-3-8b-instruct",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_URL}/settings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setSettings({
            tone: res.data.tone || "professional",
            response_length: res.data.response_length || "medium",
            model: res.data.model || "meta-llama/llama-3-8b-instruct",
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = getToken();
      await axios.put(`${API_URL}/settings/${userId}`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-[#222] rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-[#222] rounded"></div>
          <div className="h-10 bg-[#222] rounded"></div>
          <div className="h-10 bg-[#222] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 shadow-xl transition-all hover:border-[#c8ff00]/20">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">⚙️</span>
        <div>
          <h2 className="text-xl font-bold text-white">Agent Settings</h2>
          <p className="text-gray-500 text-xs">Configure your AI agent's behavior and personality</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Tone */}
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            Agent Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "professional", label: "💼 Professional" },
              { id: "friendly", label: "🤝 Friendly" },
              { id: "casual", label: "☕ Casual" },
              { id: "witty", label: "✨ Witty" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, tone: t.id }))}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.tone === t.id
                    ? "bg-[#c8ff00] text-black border-[#c8ff00] shadow-[0_0_15px_rgba(200,255,0,0.2)]"
                    : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-gray-600 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            Response Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "short", label: "Short", desc: "1-2 sentences" },
              { id: "medium", label: "Medium", desc: "2-4 sentences" },
              { id: "detailed", label: "Detailed", desc: "Thorough info" },
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, response_length: l.id }))}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                  settings.response_length === l.id
                    ? "bg-[#c8ff00] text-black border-[#c8ff00] shadow-[0_0_15px_rgba(200,255,0,0.2)]"
                    : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-gray-600 hover:text-white"
                }`}
              >
                <span>{l.label}</span>
                <span className={`text-[10px] font-normal ${settings.response_length === l.id ? "text-black/70" : "text-gray-600"}`}>
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            LLM Model
          </label>
          <div className="relative">
            <select
              value={settings.model}
              onChange={(e) => setSettings((prev) => ({ ...prev, model: e.target.value }))}
              className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8ff00] transition-colors appearance-none cursor-pointer"
            >
              <option value="meta-llama/llama-3-8b-instruct">Llama 3 8B (Default)</option>
              <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</option>
              <option value="google/gemini-flash-1.5">Gemini 1.5 Flash</option>
              <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message / Status */}
        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-medium border ${
              message.type === "success"
                ? "bg-green-950/30 text-green-400 border-green-900/50"
                : "bg-red-950/30 text-red-400 border-red-900/50"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-[#c8ff00] hover:bg-[#d4ff33] disabled:bg-gray-800 disabled:text-gray-600 text-black font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-[0_0_20px_rgba(200,255,0,0.3)] flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </div>
  );
}
