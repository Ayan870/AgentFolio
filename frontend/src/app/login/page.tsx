"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { saveAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            saveAuth(data.token, { name: data.name, email: data.email, user_id: data.user_id });
            if (data.has_agent) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding");
            }
        } catch (e: any) {
            setError(e.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-[#111] border border-[#222] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8ff00]/50 placeholder-gray-700";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <Link href="/" className="font-black text-2xl mb-10">
                <span className="text-white">Agent</span>
                <span className="text-[#c8ff00]">Folio</span>
            </Link>

            <div className="w-full max-w-sm bg-[#111] border border-[#1e1e1e] rounded-2xl p-8">
                <h1 className="text-xl font-bold mb-1">Welcome back</h1>
                <p className="text-gray-600 text-sm mb-6">Sign in to manage your agent</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Email</label>
                        <input
                            className={inputClass}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Password</label>
                        <input
                            className={inputClass}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm bg-red-950/50 border border-red-900 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 bg-[#c8ff00] hover:bg-[#d4ff33] disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-all"
                    >
                        {loading ? "Signing in..." : "Sign In →"}
                    </button>
                </div>

                <p className="text-center text-gray-700 text-sm mt-6">
                    No account?{" "}
                    <Link href="/signup" className="text-[#c8ff00] hover:underline">
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
}