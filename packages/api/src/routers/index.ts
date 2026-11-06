import { protectedProcedure, publicProcedure, router } from "../index";
import { perkRouter } from "./perk";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  perk: perkRouter,
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
});

export type AppRouter = typeof appRouter;
