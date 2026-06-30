"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getToken, getUser, logout } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

function AgentSettingsPanel({ userId }: { userId: string }) {
  const [settings, setSettings] = useState({
    tone: "professional",
    response_length: "medium",
    model: "meta-llama/llama-3-8b-instruct",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/settings/${userId}`)
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, [userId]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await axios.put(`${API_URL}/settings/${userId}`, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const selectClass = "w-full bg-[#0a0a0a] border border-[#222] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8ff00]/50";
  const labelClass = "text-gray-600 text-xs uppercase tracking-wide block mb-2";

  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-1">🎛️ Agent Settings</h3>
      <p className="text-gray-700 text-xs mb-5">Tweak how your agent talks and thinks</p>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Tone</label>
          <select
            className={selectClass}
            value={settings.tone}
            onChange={e => setSettings({ ...settings, tone: e.target.value })}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="witty">Witty</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Response Length</label>
          <select
            className={selectClass}
            value={settings.response_length}
            onChange={e => setSettings({ ...settings, response_length: e.target.value })}
          >
            <option value="short">Short (1-2 sentences)</option>
            <option value="medium">Medium (default)</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Model</label>
          <select
            className={selectClass}
            value={settings.model}
            onChange={e => setSettings({ ...settings, model: e.target.value })}
          >
            <option value="meta-llama/llama-3-8b-instruct">Llama 3 8B (fast, default)</option>
            <option value="mistralai/mistral-7b-instruct">Mistral 7B (balanced)</option>
            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B (smarter, slower)</option>
          </select>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-2.5 bg-[#c8ff00] hover:bg-[#d4ff33] disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-all"
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
    const router = useRouter();
    const [me, setMe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push("/login");
            return;
        }
        axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setMe(res.data))
            .catch(() => {
                logout();
                router.push("/login");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = getToken();
            const { data } = await axios.post(`${API_URL}/auth/upload-avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setMe((prev: any) => ({ ...prev, avatar_url: data.avatar_url }));
            const cachedUser = getUser();
            if (cachedUser) {
                cachedUser.avatar_url = data.avatar_url;
                localStorage.setItem("agentfolio_user", JSON.stringify(cachedUser));
            }
        } catch (error) {
            console.error("Avatar upload failed:", error);
            alert("Failed to upload avatar. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* Nav */}
            <nav className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <Link href="/" className="font-black text-xl">
                    <span className="text-white">Agent</span>
                    <span className="text-[#c8ff00]">Folio</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">{me?.email}</span>
                    {me?.avatar_url ? (
                        <img
                            src={`${API_URL.replace("/api/v1", "")}${me.avatar_url}`}
                            alt="Nav Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-[#c8ff00]/50"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                            {me?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-white transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10 flex items-center gap-6">
                    <div className="relative group cursor-pointer flex-shrink-0">
                        {me?.avatar_url ? (
                            <img
                                src={`${API_URL.replace("/api/v1", "")}${me.avatar_url}`}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full object-cover border-2 border-[#c8ff00] shadow-[0_0_20px_rgba(200,255,0,0.15)]"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-transparent hover:border-[#c8ff00] transition-colors">
                                {me?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                            />
                        </label>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Welcome back,</p>
                        <h1 className="text-3xl font-black">{me?.name} 👋</h1>
                    </div>
                </div>

                {me?.has_agent ? (
                    <div className="space-y-6">

                        {/* Agent Status */}
                        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
                                        <span className="text-[#c8ff00] text-xs font-bold uppercase tracking-wide">Agent Live</span>
                                    </div>
                                    <h2 className="text-xl font-bold">{me?.agent?.name}</h2>
                                    <p className="text-gray-600 text-sm">@{me?.user_id}</p>
                                </div>
                                <Link
                                    href={`/agent/${me?.user_id}`}
                                    className="px-4 py-2 bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-bold rounded-xl text-sm transition-all"
                                >
                                    View Agent →
                                </Link>
                            </div>

                            <div>
                                <p className={`text-gray-500 text-sm leading-relaxed ${isBioExpanded ? "" : "line-clamp-2"}`}>
                                    {me?.agent?.bio}
                                </p>
                                {me?.agent?.bio && me.agent.bio.length > 120 && (
                                    <button
                                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                                        className="text-xs text-[#c8ff00] hover:text-[#d4ff33] transition-colors mt-1 font-semibold focus:outline-none"
                                    >
                                        {isBioExpanded ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </div>

                            {/* Skills */}
                            {me?.agent?.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    {me.agent.skills.slice(0, 8).map((s: string) => (
                                        <span key={s} className="px-2.5 py-1 bg-[#1a1a1a] text-gray-500 text-xs rounded-lg border border-[#2a2a2a]">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href={`/agent/${me?.user_id}`}
                                className="bg-[#111] border border-[#1e1e1e] hover:border-[#c8ff00]/30 rounded-2xl p-5 transition-all group"
                            >
                                <div className="text-2xl mb-2">💬</div>
                                <h3 className="font-bold text-sm mb-1">Chat with Agent</h3>
                                <p className="text-gray-700 text-xs">Test how your agent responds</p>
                            </Link>

                            <Link
                                href="/onboarding"
                                className="bg-[#111] border border-[#1e1e1e] hover:border-[#c8ff00]/30 rounded-2xl p-5 transition-all group"
                            >
                                <div className="text-2xl mb-2">✏️</div>
                                <h3 className="font-bold text-sm mb-1">Edit Profile</h3>
                                <p className="text-gray-700 text-xs">Update your agent's knowledge</p>
                            </Link>

                            <Link
                                href="/agent"
                                className="bg-[#111] border border-[#1e1e1e] hover:border-[#c8ff00]/30 rounded-2xl p-5 transition-all group"
                            >
                                <div className="text-2xl mb-2">🌐</div>
                                <h3 className="font-bold text-sm mb-1">Browse Agents</h3>
                                <p className="text-gray-700 text-xs">See other people's agents</p>
                            </Link>
                        </div>

                        {/* Agent URL */}
                        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
                            <p className="text-gray-600 text-xs uppercase tracking-wide mb-2">Your Agent URL</p>
                            <div className="flex items-center gap-3">
                                <code className="text-[#c8ff00] text-sm flex-1 bg-[#0a0a0a] px-3 py-2 rounded-lg border border-[#1e1e1e]">
                                    agentfolio.com/agent/{me?.user_id}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(`http://localhost:3001/agent/${me?.user_id}`)}
                                    className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] rounded-lg text-xs text-gray-500 hover:text-white transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        {/* Settings */}
                        <AgentSettingsPanel userId={me?.user_id} />

                    </div>
                ) : (
                    /* No agent yet */
                    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-12 text-center">
                        <div className="text-5xl mb-4">🤖</div>
                        <h2 className="text-xl font-bold mb-2">No agent yet</h2>
                        <p className="text-gray-600 mb-6">Build your AI agent in 5 minutes</p>
                        <Link
                            href="/onboarding"
                            className="px-8 py-3 bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-bold rounded-xl transition-all"
                        >
                            Build My Agent →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}