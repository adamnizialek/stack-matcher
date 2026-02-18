import { AiResponse } from "@/lib/openai";
import Link from "next/link";

interface Props {
  id: string;
  description: string;
  aiResponse: AiResponse;
  voteCount: number;
  createdAt: string;
}

export function FeedCard({ id, description, aiResponse, voteCount, createdAt }: Props) {
  const techNames = aiResponse.stack?.map((s) => s.name) ?? [];

  return (
    <Link
      href={`/r/${id}`}
      className="block bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-colors"
    >
      <p className="text-zinc-300 text-sm mb-3 line-clamp-2">&ldquo;{description}&rdquo;</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {techNames.map((name) => (
          <span
            key={name}
            className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-zinc-600 text-xs">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <span>▲ {voteCount}</span>
      </div>
    </Link>
  );
}
