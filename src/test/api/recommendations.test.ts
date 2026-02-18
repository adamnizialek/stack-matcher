import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recommendation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { GET as getFeed } from "@/app/api/recommendations/route";
import { GET as getOne } from "@/app/api/recommendations/[id]/route";
import { prisma } from "@/lib/prisma";

const mockRec = {
  id: "rec-1",
  description: "A habit tracker",
  aiResponse: { stack: [], summary: "test", alternatives: [] },
  voteCount: 3,
  createdAt: new Date(),
  userId: null,
  user: null,
  votes: [],
};

describe("GET /api/recommendations", () => {
  it("returns list of recommendations", async () => {
    vi.mocked(prisma.recommendation.findMany).mockResolvedValue([mockRec] as any);
    const req = new Request("http://localhost/api/recommendations");
    const res = await getFeed(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it("accepts sort=top query param", async () => {
    vi.mocked(prisma.recommendation.findMany).mockResolvedValue([mockRec] as any);
    const req = new Request("http://localhost/api/recommendations?sort=top");
    await getFeed(req);
    expect(prisma.recommendation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { voteCount: "desc" },
      })
    );
  });
});

describe("GET /api/recommendations/[id]", () => {
  it("returns 404 for unknown id", async () => {
    vi.mocked(prisma.recommendation.findUnique).mockResolvedValue(null);
    const req = new Request("http://localhost/api/recommendations/unknown");
    const res = await getOne(req, { params: { id: "unknown" } });
    expect(res.status).toBe(404);
  });

  it("returns recommendation for valid id", async () => {
    vi.mocked(prisma.recommendation.findUnique).mockResolvedValue(mockRec as any);
    const req = new Request("http://localhost/api/recommendations/rec-1");
    const res = await getOne(req, { params: { id: "rec-1" } });
    expect(res.status).toBe(200);
  });
});
