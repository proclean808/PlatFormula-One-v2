import { describe, expect, it } from "vitest";
import { WAITLIST_CONSENT_VERSION, waitlistInput } from "./waitlist";

describe("waitlistInput", () => {
  const validInput = {
    fullName: "Jordan Founder",
    email: "JORDAN@EXAMPLE.COM",
    phone: "+1 (415) 555-0199",
    consent: true as const,
  };

  it("accepts consented, valid waiting-list details and normalizes email", () => {
    const result = waitlistInput.parse(validInput);
    expect(result.email).toBe("jordan@example.com");
    expect(WAITLIST_CONSENT_VERSION).toBe("2026-09-01");
  });

  it("rejects enrollment without explicit consent", () => {
    expect(() => waitlistInput.parse({ ...validInput, consent: false })).toThrow(/contact terms/i);
  });

  it("rejects malformed phone numbers", () => {
    expect(() => waitlistInput.parse({ ...validInput, phone: "not-a-phone" })).toThrow(/phone/i);
  });
});

