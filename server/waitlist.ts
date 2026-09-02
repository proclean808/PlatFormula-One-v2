import { z } from "zod";

export const WAITLIST_CONSENT_VERSION = "2026-09-01";

export const waitlistInput = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(160),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(320),
  phone: z.string().trim().regex(/^[+()\d\s.-]{7,32}$/, "Please enter a valid phone number."),
  consent: z.boolean().refine((value) => value, {
    message: "Please agree to the waiting-list contact terms.",
  }),
});

export type WaitlistInput = z.infer<typeof waitlistInput>;
