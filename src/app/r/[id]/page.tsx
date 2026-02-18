import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { StackCard } from "@/components/StackCard";
import { VoteButtons } from "@/components/VoteButtons";
import { AiResponse } from "@/lib/openai";
import { CopyLinkButton } from "@/components/CopyLinkButton";

interface Props {
  params: { id: string };
}

export default async function RecommendationPage({ params }: Props) {
  const [recommendation, session] = await Promise.all([
    prisma.recommendation.findUnique({
      where: { id: params.id },
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
    <main className="min-h-screen bg-zinc-950 text-white px-4 pt-16 pb-20">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block">
          ← Back to home
        </a>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <p className="text-zinc-300 text-sm mb-4 italic">&ldquo;{recommendation.description}&rdquo;</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {aiResponse.stack.map((item) => (
              <StackCard key={item.name} item={item} />
            ))}
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">{aiResponse.summary}</p>
          {aiResponse.alternatives?.length > 0 && (
            <p className="text-zinc-600 text-xs mb-4">
              Alternatives: {aiResponse.alternatives.join(", ")}
            </p>
          )}
          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
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
