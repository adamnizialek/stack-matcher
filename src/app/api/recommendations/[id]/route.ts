import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const recommendation = await prisma.recommendation.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, image: true } },
      votes: true,
    },
  });

  if (!recommendation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recommendation);
}
