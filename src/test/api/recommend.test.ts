import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before import
vi.mock("@/lib/prisma", () => ({
  prisma: {
    recommendation: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/openai", () => ({
  generateStackRecommendation: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

import { POST } from "@/app/api/recommend/route";
import { prisma } from "@/lib/prisma";
import { generateStackRecommendation } from "@/lib/openai";

const mockAiResponse = {
  stack: [{ name: "Next.js", role: "Frontend", reason: "Great for SSR" }],
  summary: "A solid modern stack",
  alternatives: ["Remix"],
};

describe("POST /api/recommend", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if description is missing", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 if description is too short", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ description: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns recommendation on valid input", async () => {
    vi.mocked(generateStackRecommendation).mockResolvedValue(mockAiResponse);
    vi.mocked(prisma.recommendation.create).mockResolvedValue({
      id: "rec-123",
      description: "A todo app",
      aiResponse: mockAiResponse,
      voteCount: 0,
      createdAt: new Date(),
      userId: null,
    } as any);

    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ description: "A todo app with reminders" }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("rec-123");
    expect(data.aiResponse).toEqual(mockAiResponse);
  });
});
