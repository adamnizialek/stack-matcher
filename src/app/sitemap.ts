import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recommendations = await prisma.recommendation.findMany({
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const base = "https://stack-matcher.vercel.app";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/feed`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    ...recommendations.map((rec) => ({
      url: `${base}/r/${rec.id}`,
      lastModified: rec.createdAt,
      priority: 0.6 as const,
    })),
  ];
}
