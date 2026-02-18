"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StackCard } from "./StackCard";
import { AiResponse } from "@/lib/openai";

export function RecommendForm() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; aiResponse: AiResponse } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Describe your project in a few sentences... e.g. 'A real-time chat app for remote teams with file sharing and search'"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading || description.trim().length < 10}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Matching your stack..." : "Match my stack →"}
        </button>
      </form>

      {result && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(result.aiResponse.stack ?? []).map((item) => (
              <StackCard key={item.name} item={item} />
            ))}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
            {result.aiResponse.summary}
          </p>
          {result.aiResponse.alternatives?.length > 0 && (
            <p className="text-zinc-500 text-xs">
              Alternatives: {result.aiResponse.alternatives.join(", ")}
            </p>
          )}
          <button
            onClick={() => router.push(`/r/${result.id}`)}
            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm underline"
          >
            View shareable link →
          </button>
        </div>
      )}
    </div>
  );
}
