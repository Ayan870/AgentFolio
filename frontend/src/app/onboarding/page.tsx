"use client";
import { getToken } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const STEPS = ["Basics", "Skills", "Projects", "Experience", "Your Story"];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [basics, setBasics] = useState({
        user_id: "", name: "", bio: "", location: "",
        github_url: "", website: "", linkedin_url: "",
    });

    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");

    const [projects, setProjects] = useState([
        { title: "", description: "", github_url: "", live_url: "", tech: "" }
    ]);

    const [experience, setExperience] = useState([
        { company: "", role: "", duration: "", description: "" }
    ]);

    const [education, setEducation] = useState([
        { institution: "", degree: "", year: "" }
    ]);

    const [story, setStory] = useState({
        how_started: "", biggest_win: "", biggest_failure: "",
        currently_obsessed: "", looking_for: "",
    });

    const addSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));

    const addProject = () => setProjects([...projects, { title: "", description: "", github_url: "", live_url: "", tech: "" }]);
    const addExperience = () => setExperience([...experience, { company: "", role: "", duration: "", description: "" }]);
    const addEducation = () => setEducation([...education, { institution: "", degree: "", year: "" }]);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const payload = {
                ...basics,
                skills,
                projects: projects.map(p => ({
                    ...p,
                    tech: p.tech.split(",").map((t: string) => t.trim()).filter(Boolean)
                })),
                experience,
                education,
                story,
            };

            await axios.post(`${API_URL}/onboard`, payload);

            // Link agent to logged-in account if token exists
            const token = getToken();
            if (token) {
                await axios.post(
                    `${API_URL}/auth/link-agent`,
                    { user_id: basics.user_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                router.push("/dashboard");
            } else {
                router.push(`/agent/${basics.user_id}`);
            }
        } catch (e: any) {
            setError(e.response?.data?.detail || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500";
    const labelClass = "block text-gray-400 text-xs mb-1 uppercase tracking-wide";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between bg-[#0a0a0a]/90 backdrop-blur-sm z-20">
                <Link href="/" className="font-black text-xl">
                    <span className="text-white">Agent</span>
                    <span className="text-[#c8ff00]">Folio</span>
                </Link>
            </nav>

            <div className="max-w-2xl mx-auto mt-16">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Build Your Agent 🤖</h1>
                    <p className="text-gray-400">Fill in your details and your AI agent goes live instantly</p>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full ${i <= step ? "bg-indigo-500" : "bg-gray-700"}`} />
                            <p className={`text-xs mt-1 text-center ${i === step ? "text-indigo-400" : "text-gray-600"}`}>{s}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

                    {/* Step 1 — Basics */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold mb-4">The Basics</h2>
                            <div>
                                <label className={labelClass}>Username (your agent URL) *</label>
                                <input className={inputClass} placeholder="e.g. hamza_dev" value={basics.user_id}
                                    onChange={e => setBasics({ ...basics, user_id: e.target.value.toLowerCase().replace(/\s/g, "_") })} />
                                {basics.user_id && <p className="text-xs text-indigo-400 mt-1">Agent URL: /agent/{basics.user_id}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Full Name *</label>
                                <input className={inputClass} placeholder="Hamza Ahmed" value={basics.name}
                                    onChange={e => setBasics({ ...basics, name: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>Bio * (2-3 sentences about yourself)</label>
                                <textarea className={inputClass} rows={3} placeholder="I'm a full-stack developer..."
                                    value={basics.bio} onChange={e => setBasics({ ...basics, bio: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input className={inputClass} placeholder="Lahore, Pakistan" value={basics.location}
                                    onChange={e => setBasics({ ...basics, location: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub URL *</label>
                                <input className={inputClass} placeholder="https://github.com/yourusername" value={basics.github_url}
                                    onChange={e => setBasics({ ...basics, github_url: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>Website / Portfolio</label>
                                <input className={inputClass} placeholder="https://yoursite.com" value={basics.website}
                                    onChange={e => setBasics({ ...basics, website: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>LinkedIn URL</label>
                                <input className={inputClass} placeholder="https://linkedin.com/in/yourname" value={basics.linkedin_url}
                                    onChange={e => setBasics({ ...basics, linkedin_url: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Skills */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold mb-4">Your Skills</h2>
                            <div className="flex gap-2">
                                <input className={inputClass} placeholder="e.g. Python" value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addSkill()} />
                                <button onClick={addSkill}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium whitespace-nowrap">
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[60px]">
                                {skills.map(s => (
                                    <span key={s} className="flex items-center gap-1 bg-indigo-900 text-indigo-200 px-3 py-1 rounded-full text-sm">
                                        {s}
                                        <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-white ml-1">×</button>
                                    </span>
                                ))}
                                {skills.length === 0 && <p className="text-gray-600 text-sm">No skills added yet</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Projects */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
                            {projects.map((proj, i) => (
                                <div key={i} className="space-y-3 pb-4 border-b border-gray-800">
                                    <p className="text-indigo-400 text-sm font-medium">Project {i + 1}</p>
                                    <div>
                                        <label className={labelClass}>Project Title *</label>
                                        <input className={inputClass} placeholder="AgentFolio" value={proj.title}
                                            onChange={e => { const p = [...projects]; p[i].title = e.target.value; setProjects(p); }} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Description *</label>
                                        <textarea className={inputClass} rows={2} placeholder="What does it do and why did you build it?"
                                            value={proj.description}
                                            onChange={e => { const p = [...projects]; p[i].description = e.target.value; setProjects(p); }} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>GitHub Repo URL *</label>
                                        <input className={inputClass} placeholder="https://github.com/you/project" value={proj.github_url}
                                            onChange={e => { const p = [...projects]; p[i].github_url = e.target.value; setProjects(p); }} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Live URL (optional)</label>
                                        <input className={inputClass} placeholder="https://yourproject.com" value={proj.live_url}
                                            onChange={e => { const p = [...projects]; p[i].live_url = e.target.value; setProjects(p); }} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tech Stack (comma separated)</label>
                                        <input className={inputClass} placeholder="React, FastAPI, PostgreSQL" value={proj.tech}
                                            onChange={e => { const p = [...projects]; p[i].tech = e.target.value; setProjects(p); }} />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addProject}
                                className="w-full py-2 border border-dashed border-gray-700 hover:border-indigo-500 rounded-lg text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                                + Add Another Project
                            </button>
                        </div>
                    )}

                    {/* Step 4 — Experience + Education */}
                    {step === 3 && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
                                {experience.map((exp, i) => (
                                    <div key={i} className="space-y-3 pb-4 border-b border-gray-800 mb-4">
                                        <p className="text-indigo-400 text-sm font-medium">Role {i + 1}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Company</label>
                                                <input className={inputClass} placeholder="Google" value={exp.company}
                                                    onChange={e => { const x = [...experience]; x[i].company = e.target.value; setExperience(x); }} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Role</label>
                                                <input className={inputClass} placeholder="Software Engineer" value={exp.role}
                                                    onChange={e => { const x = [...experience]; x[i].role = e.target.value; setExperience(x); }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Duration</label>
                                            <input className={inputClass} placeholder="2022 – Present" value={exp.duration}
                                                onChange={e => { const x = [...experience]; x[i].duration = e.target.value; setExperience(x); }} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>What did you do?</label>
                                            <textarea className={inputClass} rows={2} placeholder="Built and shipped..."
                                                value={exp.description}
                                                onChange={e => { const x = [...experience]; x[i].description = e.target.value; setExperience(x); }} />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addExperience}
                                    className="w-full py-2 border border-dashed border-gray-700 hover:border-indigo-500 rounded-lg text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                                    + Add Experience
                                </button>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4">Education</h2>
                                {education.map((edu, i) => (
                                    <div key={i} className="space-y-3 pb-4 border-b border-gray-800 mb-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Institution</label>
                                                <input className={inputClass} placeholder="UET Lahore" value={edu.institution}
                                                    onChange={e => { const x = [...education]; x[i].institution = e.target.value; setEducation(x); }} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Year</label>
                                                <input className={inputClass} placeholder="2024" value={edu.year}
                                                    onChange={e => { const x = [...education]; x[i].year = e.target.value; setEducation(x); }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Degree</label>
                                            <input className={inputClass} placeholder="BSc Computer Science" value={edu.degree}
                                                onChange={e => { const x = [...education]; x[i].degree = e.target.value; setEducation(x); }} />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addEducation}
                                    className="w-full py-2 border border-dashed border-gray-700 hover:border-indigo-500 rounded-lg text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                                    + Add Education
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5 — Story */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold mb-1">Your Story</h2>
                            <p className="text-gray-500 text-sm mb-4">These answers make your agent sound human. Answer casually — like you're talking to a friend.</p>
                            {[
                                { key: "how_started", label: "How did you get into coding?", placeholder: "I was 15 when I built my first website..." },
                                { key: "biggest_win", label: "What's your biggest project win?", placeholder: "I built an app that got 500 users in the first week..." },
                                { key: "biggest_failure", label: "What's a failure you learned from?", placeholder: "I spent 3 months on a product nobody wanted..." },
                                { key: "currently_obsessed", label: "What are you currently obsessed with?", placeholder: "LangGraph and agentic AI systems..." },
                                { key: "looking_for", label: "What kind of work are you looking for?", placeholder: "I'm looking for a team building AI products..." },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key}>
                                    <label className={labelClass}>{label}</label>
                                    <textarea className={inputClass} rows={3} placeholder={placeholder}
                                        value={story[key as keyof typeof story]}
                                        onChange={e => setStory({ ...story, [key]: e.target.value })} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {error && <p className="text-red-400 text-sm mt-4 bg-red-950 px-4 py-2 rounded-lg">{error}</p>}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(s => s - 1)}
                            disabled={step === 0}
                            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-colors"
                        >
                            Back
                        </button>

                        {step < STEPS.length - 1 ? (
                            <button
                                onClick={() => setStep(s => s + 1)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                {loading ? "Launching agent..." : "🚀 Launch My Agent"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}