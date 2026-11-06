import { protectedProcedure, publicProcedure, router } from "../index";
import { blogRouter } from "./blog";
import { partnerRouter } from "./partner";
import { perkRouter } from "./perk";

export const appRouter = router({
  blog: blogRouter,
  healthCheck: publicProcedure.query(() => "OK"),
  partner: partnerRouter,
  perk: perkRouter,
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
});

export type AppRouter = typeof appRouter;
