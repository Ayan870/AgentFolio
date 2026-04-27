import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-5xl">🤖</div>
      <h1 className="text-4xl font-bold mb-3 text-white">AgentFolio</h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        Your AI portfolio agent — answers questions about you, in your voice, powered by your CV and LinkedIn.
      </p>
      <div className="flex gap-4">
        <Link
          href="/agent/hamza_dev"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
        >
          View Demo Agent
        </Link>
        <Link
          href="/onboarding"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          Create Yours
        </Link>
      </div>
    </main>
  );
}