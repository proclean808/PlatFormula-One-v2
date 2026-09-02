import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { upsertWaitlistEntry } = vi.hoisted(() => ({
  upsertWaitlistEntry: vi.fn(),
}));

vi.mock("./db", () => ({ upsertWaitlistEntry }));

import { appRouter } from "./routers";

function createAuthenticatedContext(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "google-user",
      email: "founder@example.com",
      name: "Founder Name",
      loginMethod: "google",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const input = {
  fullName: "Founder Name",
  email: "FOUNDER@EXAMPLE.COM",
  phone: "+1 415 555 0199",
  consent: true,
};

describe("waitlist.enroll", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a consented Free Tier waiting-list request for a signed-in Google user", async () => {
    upsertWaitlistEntry.mockResolvedValue({ created: true });

    const caller = appRouter.createCaller(createAuthenticatedContext());
    await expect(caller.waitlist.enroll(input)).resolves.toEqual({
      created: true,
      message: "You're on the Free Tier waiting list. We'll be in touch.",
    });
    expect(upsertWaitlistEntry).toHaveBeenCalledWith(42, {
      ...input,
      email: "founder@example.com",
    });
  });

  it("reports an update when the signed-in user already has a waiting-list request", async () => {
    upsertWaitlistEntry.mockResolvedValue({ created: false });

    const caller = appRouter.createCaller(createAuthenticatedContext());
    await expect(caller.waitlist.enroll(input)).resolves.toEqual({
      created: false,
      message: "Your waiting-list details have been updated.",
    });
  });

  it("does not accept an unchecked consent box", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext());
    await expect(caller.waitlist.enroll({ ...input, consent: false })).rejects.toThrow(/contact terms/i);
    expect(upsertWaitlistEntry).not.toHaveBeenCalled();
  });
});
