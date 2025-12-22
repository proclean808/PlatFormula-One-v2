import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("pitch.save", () => {
  it("saves a pitch analysis successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      score: 85,
      clarity: 92,
      pacing: 78,
      persuasion: 88,
      transcript: "Test pitch transcript",
      feedback: [
        { type: "positive" as const, text: "Great opening" },
        { type: "improvement" as const, text: "Slow down a bit" },
      ],
      recordingDuration: 120,
    };

    const result = await caller.pitch.save(input);

    expect(result).toEqual({ success: true });
  });

  it("requires authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    const input = {
      score: 85,
      clarity: 92,
      pacing: 78,
      persuasion: 88,
      transcript: "Test pitch transcript",
      feedback: [
        { type: "positive" as const, text: "Great opening" },
      ],
      recordingDuration: 120,
    };

    await expect(caller.pitch.save(input)).rejects.toThrow();
  });
});

describe("pitch.list", () => {
  it("returns pitch analyses for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First save a pitch
    await caller.pitch.save({
      score: 85,
      clarity: 92,
      pacing: 78,
      persuasion: 88,
      transcript: "Test pitch transcript",
      feedback: [
        { type: "positive" as const, text: "Great opening" },
      ],
      recordingDuration: 120,
    });

    // Then list pitches
    const result = await caller.pitch.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("score");
    expect(result[0]).toHaveProperty("transcript");
  });

  it("requires authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.pitch.list()).rejects.toThrow();
  });
});
