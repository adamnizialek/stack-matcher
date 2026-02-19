"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StackCard } from "./StackCard";
import { MermaidDiagram } from "./MermaidDiagram";
import { AiResponse } from "@/lib/openai";

export function RecommendForm() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; aiResponse: AiResponse } | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

  const toggleListening = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        setDescription((prev) => (prev ? prev + " " + transcript.trim() : transcript.trim()));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted") {
        setError("Mic error: " + event.error);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setError(null);
  }, [listening]);

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
      <form onSubmit={handleSubmit}>
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/40">
          <textarea
            className="w-full bg-transparent text-white placeholder:text-zinc-500 focus:outline-none resize-none text-base leading-relaxed"
            placeholder="Describe your project idea..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                listening
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
              title={listening ? "Stop listening" : "Voice input"}
            >
              {listening ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                  <span className="relative w-2.5 h-2.5 bg-red-500 rounded-full" />
                </>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              )}
            </button>
            <button
              type="submit"
              disabled={loading || description.trim().length < 10}
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Matching...
                </span>
              ) : (
                "Match my stack →"
              )}
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="animate-fade-in mt-6 sm:mt-8">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
              {(result.aiResponse.stack ?? []).map((item) => (
                <StackCard key={item.name} item={item} />
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {result.aiResponse.summary}
              </p>
              {result.aiResponse.alternatives?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                  <span className="text-zinc-500 text-xs">Alternatives:</span>
                  {result.aiResponse.alternatives.map((alt) => (
                    <span key={alt} className="text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">{alt}</span>
                  ))}
                </div>
              )}
            </div>
            {result.aiResponse.diagram && (
              <MermaidDiagram chart={result.aiResponse.diagram} />
            )}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
              <button
                onClick={() => router.push(`/r/${result.id}`)}
                className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
              >
                View shareable link →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
