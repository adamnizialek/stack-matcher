import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { recommendationId, type } = body;

  if (!recommendationId || !["up", "down"].includes(type)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = session.user.id;

  const existingVote = await prisma.vote.findUnique({
    where: { userId_recommendationId: { userId, recommendationId } },
  });

  if (existingVote) {
    // Toggle: remove vote if same type
    await prisma.vote.delete({ where: { id: existingVote.id } });
    const delta = existingVote.type === "up" ? -1 : 1;
    await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { voteCount: { increment: delta } },
    });
    return NextResponse.json({ removed: true });
  }

  await prisma.vote.create({ data: { userId, recommendationId, type } });
  await prisma.recommendation.update({
    where: { id: recommendationId },
    data: { voteCount: { increment: type === "up" ? 1 : -1 } },
  });

  return NextResponse.json({ success: true });
}
