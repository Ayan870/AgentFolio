"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { getToken, getUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

interface AgentCard {
  user_id: string;
  name: string;
  bio: string;
  location: string;
  skills: string[];
  github_url: string;
  website: string;
  avatar_url?: string;
}

function Avatar({ name, avatar_url }: { name: string; avatar_url?: string }) {
  if (avatar_url) {
    return (
      <img
        src={`${API_URL.replace("/api/v1", "")}${avatar_url}`}
        alt={name}
        className="w-14 h-14 rounded-xl object-cover border border-[#222222] shadow-lg flex-shrink-0"
      />
    );
  }
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = [
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-fuchsia-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Card({ agent }: { agent: AgentCard }) {
  return (
    <div className="bg-[#111111] border border-[#222222] hover:border-[#c8ff00]/40 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-[0_0_30px_rgba(200,255,0,0.07)] group">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar name={agent.name} avatar_url={agent.avatar_url} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base leading-tight">{agent.name}</h3>
          <p className="text-gray-600 text-sm">@{agent.user_id}</p>
          {agent.location && (
            <p className="text-gray-700 text-xs mt-0.5">📍 {agent.location}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
        {agent.bio}
      </p>

      {/* Skills */}
      {agent.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {agent.skills.map((skill) => (
            <span key={skill} className="px-2.5 py-1 bg-[#1a1a1a] text-gray-500 text-xs rounded-lg border border-[#2a2a2a]">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 mt-auto pt-2">
        <Link
          href={`/agent/${agent.user_id}`}
          className="flex-1 text-center py-2.5 bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-bold rounded-xl text-sm transition-all"
        >
          Chat with {agent.name.split(" ")[0]} →
        </Link>
        {agent.github_url && (
          <a href={agent.github_url} target="_blank" rel="noopener noreferrer"
            className="p-2.5 bg-[#1a1a1a] hover:bg-[#222] rounded-xl border border-[#2a2a2a] transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
        {agent.website && (
          <a href={agent.website} target="_blank" rel="noopener noreferrer"
            className="p-2.5 bg-[#1a1a1a] hover:bg-[#222] rounded-xl border border-[#2a2a2a] transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createHref, setCreateHref] = useState("/signup");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (getToken()) {
      setCreateHref("/dashboard");
      setCurrentUser(getUser());
    }

    axios.get(`${API_URL}/agents`)
      .then(res => setAgents(res.data))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.bio.toLowerCase().includes(search.toLowerCase()) ||
    a.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="font-black text-xl">
            <span className="text-white">Agent</span>
            <span className="text-[#c8ff00]">Folio</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {currentUser && (
            <Link href="/dashboard" className="flex items-center">
              {currentUser.avatar_url ? (
                <img
                  src={`${API_URL.replace("/api/v1", "")}${currentUser.avatar_url}`}
                  alt="My Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-[#c8ff00]/50 hover:scale-105 transition-all shadow-[0_0_10px_rgba(200,255,0,0.1)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-105 transition-all border border-transparent hover:border-[#c8ff00]/50">
                  {currentUser.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
              )}
            </Link>
          )}
          <Link
            href={createHref}
            className="px-4 py-2 bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-bold rounded-xl text-sm transition-all"
          >
            + Create Your Agent
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">
            All Agents <span className="text-[#c8ff00]">({agents.length})</span>
          </h1>
          <p className="text-gray-600">Click any agent to start a conversation</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, skill, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md bg-[#111] border border-[#222] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8ff00]/50 placeholder-gray-700"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-700">
            <p className="text-lg">Loading agents...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">
              {search ? "No agents match your search" : "No agents yet"}
            </p>
            {!search && (
              <Link href={createHref}
                className="px-6 py-3 bg-[#c8ff00] text-black font-bold rounded-xl transition-all hover:bg-[#d4ff33]">
                Be the first →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(agent => (
              <Card key={agent.user_id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
