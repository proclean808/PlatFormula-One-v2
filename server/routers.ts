import { COOKIE_NAME } from "@shared/const";
import { upsertWaitlistEntry } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { waitlistInput } from "./waitlist";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  waitlist: router({
    enroll: protectedProcedure.input(waitlistInput).mutation(async ({ ctx, input }) => {
      const result = await upsertWaitlistEntry(ctx.user.id, input);
      return {
        ...result,
        message: result.created
          ? "You're on the Free Tier waiting list. We'll be in touch."
          : "Your waiting-list details have been updated.",
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
