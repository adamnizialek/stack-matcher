import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStackRecommendation } from "@/lib/openai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const description: string = body?.description ?? "";

  if (!description || description.trim().length < 10) {
    return NextResponse.json(
      { error: "Description must be at least 10 characters" },
      { status: 400 }
    );
  }

  const session = await auth();

  try {
    const aiResponse = await generateStackRecommendation(description.trim());

    const recommendation = await prisma.recommendation.create({
      data: {
        description: description.trim(),
        aiResponse: JSON.parse(JSON.stringify(aiResponse)) as Prisma.InputJsonValue,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("Recommend error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate recommendation: ${message}` },
      { status: 500 }
    );
  }
}
