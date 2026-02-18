"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  recommendationId: string;
  initialVotes: number;
  userVote: "up" | "down" | null;
}

export function VoteButtons({ recommendationId, initialVotes, userVote }: Props) {
  const [votes, setVotes] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState(userVote);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function vote(type: "up" | "down") {
    setLoading(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, type }),
      });

      if (res.status === 401) {
        router.push("/api/auth/signin");
        return;
      }

      const data = await res.json();
      if (data.removed) {
        setVotes((v) => v + (currentVote === "up" ? -1 : 1));
        setCurrentVote(null);
      } else {
        setVotes((v) => v + (type === "up" ? 1 : -1));
        setCurrentVote(type);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => vote("up")}
        disabled={loading}
        className={`text-2xl transition-opacity ${currentVote === "up" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        ▲
      </button>
      <span className="text-lg font-semibold text-white">{votes}</span>
      <button
        onClick={() => vote("down")}
        disabled={loading}
        className={`text-2xl transition-opacity ${currentVote === "down" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        ▼
      </button>
    </div>
  );
}
