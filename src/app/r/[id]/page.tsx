import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { StackCard } from "@/components/StackCard";
import { VoteButtons } from "@/components/VoteButtons";
import { AiResponse } from "@/lib/openai";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { MermaidDiagram } from "@/components/MermaidDiagram";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RecommendationPage({ params }: Props) {
  const { id } = await params;
  const [recommendation, session] = await Promise.all([
    prisma.recommendation.findUnique({
      where: { id },
      include: { votes: true, user: { select: { name: true } } },
    }),
    auth(),
  ]);

  if (!recommendation) notFound();

  const aiResponse = recommendation.aiResponse as unknown as AiResponse;
  const userVote = session?.user?.id
    ? recommendation.votes.find((v) => v.userId === session.user.id)?.type as "up" | "down" | undefined
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-3 sm:px-4 pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-sm px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Back to home
        </a>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-6">
          <p className="text-zinc-200 text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-center italic">&ldquo;{recommendation.description}&rdquo;</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {aiResponse.stack.map((item) => (
              <StackCard key={item.name} item={item} />
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-zinc-300 text-sm leading-relaxed">{aiResponse.summary}</p>
            {aiResponse.alternatives?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                <span className="text-zinc-500 text-xs">Alternatives:</span>
                {aiResponse.alternatives.map((alt) => (
                  <span key={alt} className="text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">{alt}</span>
                ))}
              </div>
            )}
          </div>
          {aiResponse.diagram && (
            <MermaidDiagram chart={aiResponse.diagram} />
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-800 pt-4 mt-4">
            <VoteButtons
              recommendationId={recommendation.id}
              initialVotes={recommendation.voteCount}
              userVote={userVote ?? null}
            />
            <CopyLinkButton />
          </div>
        </div>
      </div>
    </main>
  );
}
