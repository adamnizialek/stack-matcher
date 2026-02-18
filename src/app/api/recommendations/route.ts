import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 20;

  const recommendations = await prisma.recommendation.findMany({
    orderBy: sort === "top" ? { voteCount: "desc" } : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(recommendations);
}
