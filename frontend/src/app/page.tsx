"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, getUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";
const BASE_URL = API_URL.replace("/api/v1", "");

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (getToken()) {
      setCurrentUser(getUser());
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1f0a_0%,_#0a0a0a_70%)]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Top Navigation */}
      <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-20">
        {mounted && currentUser ? (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <span className="text-gray-400 group-hover:text-white text-sm font-semibold transition-colors">
              Dashboard
            </span>
            {currentUser.avatar_url ? (
              <img
                src={`${BASE_URL}${currentUser.avatar_url}`}
                alt="My Avatar"
                className="w-9 h-9 rounded-full object-cover border border-[#c8ff00]/50 group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(200,255,0,0.15)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-105 transition-all border border-transparent group-hover:border-[#c8ff00]/50">
                {currentUser.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-400 hover:text-white font-semibold text-sm transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm border border-gray-700 hover:border-gray-600 transition-all"
            >
              Create Yours →
            </Link>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm mb-10 text-xs tracking-[0.2em] text-gray-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
          AI Portfolio · Powered by RAG
        </div>

        {/* Title */}
        <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-none mb-8">
          <span className="text-white">Agent</span>
          <span className="text-[#c8ff00]">Folio</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mb-12">
          Your AI portfolio agent — answers questions about you, in your voice, powered by your CV and LinkedIn.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/agent/hamza_dev"
            className="px-8 py-4 bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-bold rounded-2xl text-base transition-all hover:scale-105 shadow-[0_0_30px_rgba(200,255,0,0.3)]"
          >
            View Demo Agent →
          </Link>
          <Link
            href="/agent"
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl text-base border border-gray-700 hover:border-gray-600 transition-all"
          >
            Browse All Agents
          </Link>
        </div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </div>
  );
}