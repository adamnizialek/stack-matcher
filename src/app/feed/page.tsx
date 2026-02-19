import { prisma } from "@/lib/prisma";
import { FeedCard } from "@/components/FeedCard";
import { AiResponse } from "@/lib/openai";

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function FeedPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort === "top" ? "top" : "latest";

  const recommendations = await prisma.recommendation.findMany({
    orderBy: sort === "top" ? { voteCount: "desc" } : { createdAt: "desc" },
    take: 30,
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-3 sm:px-4 pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold">Community Stacks</h1>
          <div className="flex gap-2 text-sm">
            <a
              href="/feed"
              className={`px-3 py-1 rounded-full ${sort === "latest" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Latest
            </a>
            <a
              href="/feed?sort=top"
              className={`px-3 py-1 rounded-full ${sort === "top" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Top
            </a>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">
            No stacks yet. <a href="/" className="text-indigo-400 hover:underline">Be the first!</a>
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {recommendations.map((rec) => (
              <FeedCard
                key={rec.id}
                id={rec.id}
                description={rec.description}
                aiResponse={rec.aiResponse as unknown as AiResponse}
                voteCount={rec.voteCount}
                createdAt={rec.createdAt.toISOString()}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
