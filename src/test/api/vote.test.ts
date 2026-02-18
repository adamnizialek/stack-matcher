import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    vote: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
    recommendation: {
      update: vi.fn(),
    },
  },
}));

import { POST } from "@/app/api/vote/route";
import { auth } from "@/lib/auth";

describe("POST /api/vote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ recommendationId: "rec-1", type: "up" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 if recommendationId is missing", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ type: "up" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
